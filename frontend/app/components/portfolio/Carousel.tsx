"use client";

import * as React from "react";
import WheelPagination from "@/components/ui/wheel-pagination";

interface Overflow {
  has: boolean;
  atStart: boolean;
  atEnd: boolean;
  frac: number;
  thumb: number;
  index: number;
  /** Number of reachable scroll positions (pagination pages). */
  pages: number;
}

export function Carousel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const count = React.Children.count(children);
  const [ov, setOv] = React.useState<Overflow>({
    has: false, atStart: true, atEnd: false, frac: 0, thumb: 0.3, index: 0, pages: 1,
  });
  const drag = React.useRef({ on: false, startX: 0, startScroll: 0, moved: 0 });

  const measure = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const sl = el.scrollLeft;
    const first = el.children[0] as HTMLElement | undefined;
    let index = 0;
    let pages = 1;
    if (first) {
      const cs = getComputedStyle(el);
      const gap = parseFloat(cs.columnGap || cs.gap || "0") || 0;
      const step = first.getBoundingClientRect().width + gap;
      index = step ? Math.round(sl / step) : 0;
      // reachable pages = how many card-steps fit into the max scroll distance
      pages = step ? Math.max(1, Math.round(max / step) + 1) : 1;
    }
    setOv({
      has: max > 2,
      atStart: sl <= 2,
      atEnd: sl >= max - 2,
      frac: max > 0 ? sl / max : 0,
      thumb: Math.max(0.16, el.clientWidth / el.scrollWidth),
      index,
      pages,
    });
  }, []);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const t = setTimeout(measure, 350);
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [measure, count]);

  const animTo = (el: HTMLDivElement, target: number) => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = el.scrollLeft;
    const dist = target - start;
    if (reduce || Math.abs(dist) < 2) {
      el.scrollLeft = target;
      return;
    }
    const dur = 440;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      el.scrollLeft = start + dist * ease(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // px width of one card + gap (one "page" step).
  const stepPx = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return el.clientWidth * 0.82;
    const cs = getComputedStyle(el);
    const gap = parseFloat(cs.columnGap || cs.gap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const page = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    animTo(el, Math.max(0, Math.min(max, el.scrollLeft + dir * stepPx())));
  };

  // Jump to a card index (driven by the numbered pagination).
  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    animTo(el, Math.max(0, Math.min(max, i * stepPx())));
  };

  const onDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { on: true, startX: e.clientX, startScroll: el.scrollLeft, moved: 0 };
    el.setPointerCapture?.(e.pointerId);
    el.classList.add("dragging");
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.on) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(dx);
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const onUp = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current.on = false;
    el.classList.remove("dragging");
    el.releasePointerCapture?.(e.pointerId);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="carousel" role="region" aria-label={label} aria-roledescription="carousel">
      <div
        className="carousel-track"
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={onClickCapture}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); page(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); page(-1); }
        }}
      >
        {children}
      </div>

      {ov.has && (
        <WheelPagination
          className="awards-nav"
          totalPages={ov.pages}
          /* window the numbers (max 5) so the prev/next arrows always fit on
             screen — showing all pages pushed the arrows off-screen on mobile */
          visibleCount={Math.min(ov.pages, 5)}
          loop
          page={Math.min(ov.index, ov.pages - 1)}
          onChange={scrollToIndex}
        />
      )}
    </div>
  );
}
