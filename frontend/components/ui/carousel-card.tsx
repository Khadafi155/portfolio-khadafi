'use client'
import {
  useState,
  useEffect,
  useRef,
} from "react";
import { Trophy, HandCoins, Star, Ribbon } from "lucide-react";
import { webp } from "@/lib/img";
export type MedalRank = "gold" | "silver" | "bronze";

const MEDAL_EMOJI: Record<MedalRank, string> = {
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
};

// Define the type for card data
export interface CardData {
  id: number;
  imgUrl: string;
  content: React.ReactNode;
  /** Optional medal badge shown on the card corner. */
  medal?: MedalRank;
  /** Show an event badge (when there is no medal). */
  event?: boolean;
  /** Show a research-funding badge (when there is no medal/event). */
  funding?: boolean;
  /** Show a finalist badge (star). */
  finalist?: boolean;
  /** Show an honorable-mention / runner-up badge (ribbon). */
  honorable?: boolean;
  /** Fill the image area (object-cover) instead of letterboxing (object-contain). Use for photos. */
  cover?: boolean;
  /** Top-align the sharp image instead of centering it (empty space falls to the bottom). */
  imgTop?: boolean;
  /** Organizer logo URL, shown in the caption panel. */
  logo?: string;
  /** Reduce padding for logos that have a lot of built-in whitespace (enlarges them). */
  logoTight?: boolean;
  /** Country flag as an ISO 3166-1 alpha-2 code (e.g. "ng", "id"); rendered as a flag image. */
  flag?: string;
}

export interface CarouselCardApi {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

interface CardProps {
  data: CardData[];
  showCarousel?: boolean;
  /** Show the built-in prev/next arrows. Default true. */
  showControls?: boolean;
  cardsPerView?: number;
  /** Exposes next/prev/goTo so a parent (e.g. a pagination) can drive it. */
  apiRef?: React.MutableRefObject<CarouselCardApi | null>;
  /** Fired whenever the active index changes (incl. via drag). */
  onIndexChange?: (index: number) => void;
}

const Card = ({
  data,
  showCarousel = true,
  showControls = true,
  cardsPerView = 3,
  apiRef,
  onIndexChange,
}: CardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSingleCard, setIsSingleCard] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive cards-per-view: 1 on phones, 2 on tablets, prop on desktop.
  const [cpv, setCpv] = useState(cardsPerView);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setCpv(w < 640 ? 1 : w < 1024 ? Math.min(2, cardsPerView) : cardsPerView);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [cardsPerView]);

  useEffect(() => {
    setIsSingleCard(data?.length === 1);
  }, [data]);

  // Calculate width percentage for each card based on cardsPerView
  const cardWidth = 75 / cpv;

  const nextSlide = () => {
    if (isAnimating || !showCarousel || !data) return;

    // Don't allow navigation if there aren't enough cards
    if (data.length <= cpv) return;

    setIsAnimating(true);
    const nextIndex = (currentIndex + 1) % data.length;

    if (containerRef.current) {
      // Apply slide out animation
      containerRef.current.style.transition = "transform 500ms ease";
      containerRef.current.style.transform = `translateX(-${cardWidth}%)`;

      // After animation completes, reset position and update index
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        if (containerRef.current) {
          containerRef.current.style.transition = "none";
          containerRef.current.style.transform = "translateX(0)";

          // Force reflow
          void containerRef.current.offsetWidth;

          setIsAnimating(false);
        }
      }, 500);
    }
  };

  const prevSlide = () => {
    if (isAnimating || !showCarousel || !data) return;
    if (data.length <= cpv) return;

    setIsAnimating(true);
    const prevIndex = (currentIndex - 1 + data.length) % data.length;

    if (containerRef.current) {
      // First move instantly to the right position
      containerRef.current.style.transition = "none";
      containerRef.current.style.transform = `translateX(-${cardWidth}%)`;

      // Update the index immediately
      setCurrentIndex(prevIndex);

      // Force reflow
      void containerRef.current.offsetWidth;

      // Then animate back to center
      containerRef.current.style.transition = "transform 500ms ease";
      containerRef.current.style.transform = "translateX(0)";

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  // Jump straight to a card index (no slide) - used for multi-step pagination.
  const goTo = (index: number) => {
    if (isAnimating || !data || data.length === 0) return;
    const n = ((index % data.length) + data.length) % data.length;
    setCurrentIndex(n);
  };

  // Expose imperative controls to the parent.
  useEffect(() => {
    if (apiRef) apiRef.current = { next: nextSlide, prev: prevSlide, goTo };
  });

  // Report the active index (e.g. so a pagination can stay in sync after a drag).
  useEffect(() => {
    onIndexChange?.(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Warm the browser cache for cards just outside the viewport so navigating
  // to the next/prev slide shows the image instantly instead of popping in.
  useEffect(() => {
    if (!data || data.length === 0) return;
    const total = data.length;
    for (let i = -2; i <= cpv + 3; i++) {
      const card = data[((currentIndex + i) % total + total) % total];
      for (const u of [webp(card.imgUrl), webp(card.logo)]) {
        if (u) {
          const im = new window.Image();
          im.decoding = "async";
          im.src = u;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, cpv, data?.length]);

  // Drag / swipe to slide.
  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (dx < -50) nextSlide();
    else if (dx > 50) prevSlide();
  };

  // Calculate which cards to show
  const getVisibleCards = () => {
    if (!showCarousel || !data) return data || [];

    const visibleCards = [];
    const totalCards = data.length;

    // For next slide animation, we need current cards + 1 extra
    for (let i = 0; i < cpv + 1; i++) {
      const index = (currentIndex + i) % totalCards;
      visibleCards.push(data[index]);
    }

    return visibleCards;
  };

  if (!data || data.length === 0) {
    return <div>No card data available</div>;
  }

  return (
    <div
      className="w-full px-4 cursor-grab active:cursor-grabbing touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className={`relative ${isSingleCard ? 'max-w-sm mx-auto' : 'w-full'}`}>
        {/* Carousel Controls */}
        {showControls && showCarousel && data.length > cpv && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
              disabled={isAnimating}
              aria-label="Previous slide"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
              disabled={isAnimating}
              aria-label="Next slide"
            >
              &gt;
            </button>
          </>
        )}

        {/* Cards Container Wrapper - limits visible area */}
        <div className="overflow-hidden">
          {/* Sliding Cards Container */}
          <div
            ref={containerRef}
            className="flex"
            style={{
              transform: "translateX(0)",
              width: showCarousel ? `${(cpv + 1) * 100 / cpv}%` : '100%'
            }}
          >
            {getVisibleCards().map((card, idx) => (
              <div
                key={`card-${card.id}`}
                style={{
                  width: showCarousel ? `${100 / (cpv + 1)}%` : `${100 / Math.min(cpv, data.length)}%`
                }}
                className="px-2"
              >
                <div className="spot-card relative overflow-hidden rounded-2xl h-[30rem] bg-[#0a0d0d] border border-white/[0.15] transition-all duration-300 group hover:border-white/[0.24] hover:shadow-[0_22px_55px_-22px_rgba(0,0,0,0.7)]">
                  {/* blurred cover fills the frame so nothing looks cropped */}
                  <img
                    src={webp(card.imgUrl)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-x-0 top-0 h-80 w-full object-cover scale-[1.6] blur-3xl saturate-150"
                  />
                  <div className="absolute inset-x-0 top-0 h-80 bg-black/10" />
                  {/* sharp image, centered & shown in full (no crop) */}
                  <img
                    src={webp(card.imgUrl)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-x-0 top-0 h-80 w-full object-contain ${card.imgTop ? "object-top" : ""} transition-transform duration-500 group-hover:scale-105`}
                  />
                  {/* caption: sits below the image by default, slides up to cover it on hover */}
                  <div className="cc-cap absolute inset-x-0 bottom-0 top-80 group-hover:top-0 flex flex-col items-center justify-center gap-2 p-5 text-center overflow-hidden bg-[#0f1211] group-hover:bg-[#0f1211]/95 group-hover:backdrop-blur-md border-t border-white/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    {/* Country flag as a faded full-panel background */}
                    {card.flag && (
                      <img
                        src={`https://flagcdn.com/w640/${card.flag}.png`}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center opacity-0 transition-opacity duration-500 group-hover:opacity-20"
                      />
                    )}
                    {/* Organizer logo as a faded full-panel background */}
                    {card.logo && (
                      <img
                        src={webp(card.logo)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 h-full w-full object-contain object-center opacity-0 transition-opacity duration-500 group-hover:opacity-20 ${card.logoTight ? "p-5" : "p-8"}`}
                      />
                    )}
                    {(card.medal ||
                      card.event ||
                      card.funding ||
                      card.finalist ||
                      card.honorable) && (
                      <span
                        className="relative flex items-center justify-center text-2xl leading-none"
                        style={{ animation: "floatY 3s ease-in-out infinite" }}
                        aria-hidden="true"
                      >
                        {card.medal ? (
                          MEDAL_EMOJI[card.medal]
                        ) : card.event ? (
                          <Trophy className="h-7 w-7 cc-ico" />
                        ) : card.funding ? (
                          <HandCoins className="h-7 w-7 cc-ico" />
                        ) : card.finalist ? (
                          <Star className="h-7 w-7 cc-ico" />
                        ) : (
                          <Ribbon className="h-7 w-7 cc-ico" />
                        )}
                      </span>
                    )}
                    <span className="relative h-0.5 w-12 rounded-full bg-[#15c8b6] transition-colors duration-500" />
                    <div className="relative space-y-1.5">{card.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
