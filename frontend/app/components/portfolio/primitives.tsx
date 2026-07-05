"use client";

import * as React from "react";

import { Icon } from "@/app/components/portfolio/Icon";
import { techIcon, isColorIcon } from "@/lib/techIcons";

/** Chip icon: a monochrome CSS-mask glyph by default (follows the chip colour),
 *  or a full-colour <img> for brand logos that don't survive masking (Elysia). */
export function TagIcon({ label }: { label: string }) {
  const url = techIcon(label);
  if (isColorIcon(label)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="tag-ico tag-ico-img" src={url} alt="" aria-hidden="true" />;
  }
  return (
    <i
      className="tag-ico"
      style={{ WebkitMaskImage: `url("${url}")`, maskImage: `url("${url}")` }}
    />
  );
}

const prefersReduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reveal-on-scroll: adds `.in` to the element when it enters the viewport. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  opts: { threshold?: number; rootMargin?: string } = {},
): React.RefObject<T | null> {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce()) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.unobserve(el);
        }
      },
      { threshold: opts.threshold ?? 0.14, rootMargin: opts.rootMargin ?? "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opts.threshold, opts.rootMargin]);
  return ref;
}

/** Count-up number that animates when scrolled into view. */
export function CountUp({
  value,
  pad,
}: {
  value: number;
  pad?: number;
}) {
  const fmt = React.useCallback(
    (n: number) => (pad ? String(n).padStart(pad, "0") : String(n)),
    [pad],
  );
  const [disp, setDisp] = React.useState(fmt(0));
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce()) {
      setDisp(fmt(value));
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1100;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisp(fmt(Math.round(eased * value)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, fmt]);

  return <span ref={ref}>{disp}</span>;
}

export function GroupBand({ label, index }: { label: string; index: string }) {
  return (
    <div className="group-band">
      <span className="gi">{index}</span> {label}
    </div>
  );
}

export function SubHead({
  id,
  eyebrow,
  title,
  index,
  icon,
}: {
  id: string;
  eyebrow: string;
  title?: string;
  index?: string;
  icon?: React.ReactNode;
}) {
  const r = useReveal();
  return (
    <div className="sub-head reveal" ref={r} id={id}>
      <div>
        <span className="eyebrow">
          {icon ? <span className="eyebrow-ic">{icon}</span> : null}
          {eyebrow}
        </span>
        {title ? <h3 className="st">{title}</h3> : null}
      </div>
    </div>
  );
}

/**
 * A user-fillable image placeholder. The design's drag-drop web component is
 * simplified here to a styled empty slot - drop real screenshots in later.
 */
export function ImageSlot({
  className,
  placeholder,
  style,
}: {
  className?: string;
  placeholder: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`image-slot${className ? ` ${className}` : ""}`} style={style}>
      <span className="is-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </span>
      <span className="is-cap">{placeholder}</span>
    </div>
  );
}

export { Icon };
