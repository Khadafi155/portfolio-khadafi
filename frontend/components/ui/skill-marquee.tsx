"use client";

import * as React from "react";
import * as PD from "@/lib/portfolioData";
import { TagIcon } from "@/app/components/portfolio/primitives";

/** Each skill group becomes one thin auto-scrolling row (alternating direction,
 *  pause on hover, fading edges). Keeps every skill but reads far less dense. */
export function SkillMarquee() {
  return (
    <div className="skill-marq">
      {PD.skills.map((g, i) => {
        // Repeat the group until one copy is wider than the viewport, then
        // duplicate that copy so the -50% scroll loops with no visible seam.
        const reps = Math.max(1, Math.ceil(16 / g.items.length));
        const seq = Array.from({ length: reps }).flatMap(() => g.items);
        return (
          <div className="skill-marq-row" data-dir={i % 2 ? "rev" : "fwd"} key={i}>
            <div className="skill-marq-label">
              <span className="skill-marq-dot" aria-hidden="true" />
              {g.title}
            </div>
            <div className="skill-marq-vp">
              <div
                className="skill-marq-track"
                style={{ animationDuration: `${Math.max(24, seq.length * 3)}s` }}
              >
                {[...seq, ...seq].map((s, j) => (
                  <span className="skill marq-chip" key={j} aria-hidden={j >= g.items.length}>
                    <TagIcon label={s} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
