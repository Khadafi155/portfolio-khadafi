"use client";

import React, { useState, useEffect, useRef, HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial?: string;
  /** Per-item backdrop (overrides the gallery `background`). */
  background?: string;
  /** Per-item fit (overrides the gallery `fit`). */
  fit?: "cover" | "contain";
  /** Per-item card size in px (overrides the gallery itemWidth/itemHeight). */
  width?: number;
  height?: number;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by?: string;
  };
}

export interface CircularGalleryApi {
  prev: () => void;
  next: () => void;
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** When false, ignore page scroll and only auto-rotate. */
  scrollDriven?: boolean;
  /** Continuously spin on its own. */
  autoRotate?: boolean;
  /** Show prev/next rotate buttons. */
  controls?: boolean;
  /** Shared backdrop image behind each item (item photos render as figures). */
  background?: string;
  /** Card size in px. */
  itemWidth?: number;
  itemHeight?: number;
  /** How the item image fits its card (no effect in background mode). */
  fit?: "cover" | "contain";
  /** Exposes prev/next rotate controls to a parent. */
  apiRef?: React.MutableRefObject<CircularGalleryApi | null>;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 600,
      autoRotateSpeed = 0.02,
      scrollDriven = true,
      autoRotate = true,
      controls = false,
      background,
      itemWidth = 300,
      itemHeight = 400,
      fit = "cover",
      apiRef,
      ...props
    },
    ref,
  ) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Effect to handle scroll-based rotation
    useEffect(() => {
      if (!scrollDriven) return;
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, [scrollDriven]);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      if (!autoRotate) return;
      const tick = () => {
        if (!isScrolling) {
          setRotation((prev) => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(tick);
      };

      animationFrameRef.current = requestAnimationFrame(tick);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed, autoRotate]);

    // expose prev/next controls to a parent
    useEffect(() => {
      if (!apiRef) return;
      const ang = 360 / items.length;
      apiRef.current = {
        prev: () => setRotation((r) => r + ang),
        next: () => setRotation((r) => r - ang),
      };
    }, [apiRef, items.length]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn(
          "relative w-full h-full flex items-center justify-center",
          className,
        )}
        style={{ perspective: "2000px" }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            transition: autoRotate
              ? undefined
              : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle,
            );
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180);
            const bg = item.background ?? background;
            const itemFit = item.fit ?? fit;
            const w = item.width ?? itemWidth;
            const h = item.height ?? itemHeight;

            return (
              <div
                key={i}
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: `${w}px`,
                  height: `${h}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `${-w / 2}px`,
                  marginTop: `${-h / 2}px`,
                  opacity: opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-border bg-card/70 dark:bg-card/30 backdrop-blur-lg">
                  {bg ? (
                    <>
                      <img
                        src={bg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/35" />
                      <img
                        src={item.photo.url}
                        alt={item.photo.text}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[96%] w-auto max-w-full object-contain"
                        style={{ objectPosition: "bottom" }}
                      />
                    </>
                  ) : (
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      className={`absolute inset-0 w-full h-full ${itemFit === "contain" ? "object-contain" : "object-cover"}`}
                      style={{ objectPosition: item.photo.pos || "center" }}
                    />
                  )}
                  {item.common ? (
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <h2 className="text-xl font-bold">{item.common}</h2>
                      {item.binomial ? (
                        <em className="text-sm italic opacity-80">{item.binomial}</em>
                      ) : null}
                      {item.photo.by ? (
                        <p className="text-xs mt-2 opacity-70">Photo by: {item.photo.by}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {controls && (
          <>
            <button
              type="button"
              aria-label="Previous"
              className="cg-nav cg-prev"
              onClick={() => setRotation((r) => r + anglePerItem)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="cg-nav cg-next"
              onClick={() => setRotation((r) => r - anglePerItem)}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    );
  },
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
