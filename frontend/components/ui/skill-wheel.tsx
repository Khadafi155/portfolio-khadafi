"use client";

import * as React from "react";
import { techIcon, isColorIcon } from "@/lib/techIcons";

/** Core stack shown in the spinning wheel (icons that have a real brand logo). */
const DEFAULT_STACK = [
  "Claude API",
  "LangChain",
  "n8n",
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
  "Supabase",
  "Docker",
  "Vercel",
];

/** A slowly-spinning ring of tech-stack icons around a centre label. Each icon
 *  counter-rotates so it stays upright. Client-only (decorative). */
export function SkillWheel({
  items = DEFAULT_STACK,
  label = "MY STACK",
}: {
  items?: string[];
  label?: string;
}) {
  // The whole wheel scales to fit the viewport so its absolutely-positioned nodes
  // are never clipped on small phones (previously a fixed 374px box).
  const [size, setSize] = React.useState(374);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    const compute = () =>
      setSize(Math.max(232, Math.min(374, window.innerWidth - 44)));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const node = Math.max(38, Math.round(size * 0.14));
  const radius = (size - node - 34) / 2;
  const toRad = (deg: number) => (Math.PI / 180) * deg;

  if (!mounted) {
    return <div className="skill-wheel" style={{ width: size, height: size }} aria-hidden="true" />;
  }

  return (
    <div className="skill-wheel" style={{ width: size, height: size }} aria-hidden="true">
      <div className="skill-wheel-ring">
        {items.map((s, i) => {
          const angle = (360 / items.length) * i;
          const url = techIcon(s);
          return (
            <div
              key={i}
              className="skill-wheel-node"
              style={{
                width: node,
                height: node,
                top: `calc(50% - ${node / 2}px + ${radius * Math.sin(toRad(angle))}px)`,
                left: `calc(50% - ${node / 2}px + ${radius * Math.cos(toRad(angle))}px)`,
              }}
            >
              {isColorIcon(s) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="skill-wheel-ico-img" src={url} alt="" />
              ) : (
                <i
                  className="skill-wheel-ico"
                  style={{ WebkitMaskImage: `url("${url}")`, maskImage: `url("${url}")` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="skill-wheel-center">
        <span>{label}</span>
      </div>
    </div>
  );
}
