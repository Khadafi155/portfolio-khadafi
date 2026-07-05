"use client";

import * as React from "react";

import { ChatProvider } from "@/app/components/portfolio/ChatContext";
import { Nav } from "@/app/components/portfolio/Nav";
import { FloatingChat } from "@/app/components/portfolio/FloatingChat";
import {
  Hero,
  ActivitiesGroup,
  Contact,
  Footer,
} from "@/app/components/portfolio/sections";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import {
  Background,
  Certifications,
} from "@/app/components/portfolio/extras";

export function PortfolioApp() {
  const [chatOpen, setChatOpen] = React.useState(false);

  // Cursor-following spotlight: update --mx/--my on the hovered .spot-card.
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(".spot-card") as
        | HTMLElement
        | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  // Ask-my-AI: if near the top, focus the hero console; else open the widget.
  const openChat = React.useCallback(() => {
    if (window.scrollY < window.innerHeight * 0.5) {
      const el = document.getElementById("hero-console");
      const input = el?.querySelector("input");
      input?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setChatOpen(true);
    }
  }, []);

  return (
    <ChatProvider>
      <Nav onAskAI={openChat} />
      <main id="main">
        <Hero />
        <LogoMarquee />
        <Background />
        <ActivitiesGroup />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <FloatingChat open={chatOpen} setOpen={setChatOpen} />
    </ChatProvider>
  );
}
