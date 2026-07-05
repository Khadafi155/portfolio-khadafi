"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * One framed photo that cross-fades through the graduation cut-out figures
 * over a campus backdrop. Auto-advances; prev/next buttons for manual control.
 */
export function EduPhotoFrame({
  photos,
  background,
  interval = 3800,
}: {
  photos: string[];
  background: string;
  interval?: number;
}) {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % photos.length),
      interval,
    );
    return () => clearInterval(t);
  }, [photos.length, interval]);

  const go = (d: number) =>
    setIdx((i) => (i + d + photos.length) % photos.length);

  return (
    <div className="edu-3d">
      <div className="edu-frame edu-3d-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="edu-frame-bg" src={background} alt="" />
        <div className="edu-frame-overlay" aria-hidden="true" />

        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className={`edu-frame-figure${i === idx ? " active" : ""}`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        className="cg-nav cg-prev"
        onClick={() => go(-1)}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Next"
        className="cg-nav cg-next"
        onClick={() => go(1)}
      >
        <ChevronRight size={20} />
      </button>

      <div className="edu-frame-dots" aria-hidden="true">
        {photos.map((_, i) => (
          <span key={i} className={i === idx ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}
