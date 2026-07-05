"use client";

import * as React from "react";

import { CoreSpinLoader } from "@/components/ui/core-spin-loader";

/**
 * Full-screen loading overlay shown on initial page load, then fades out.
 * Sits above everything (incl. the fixed particle background) via z-index.
 */
export function LoadingScreen() {
  const [fading, setFading] = React.useState(false);
  const [gone, setGone] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setFading(true), 1700); // min display time
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  React.useEffect(() => {
    if (!fading) return;
    document.body.style.overflow = "";
    const t = setTimeout(() => setGone(true), 600); // matches fade duration
    return () => clearTimeout(t);
  }, [fading]);

  if (gone) return null;

  return (
    <div className={`app-loader${fading ? " is-hide" : ""}`} aria-hidden={fading}>
      <CoreSpinLoader />
    </div>
  );
}
