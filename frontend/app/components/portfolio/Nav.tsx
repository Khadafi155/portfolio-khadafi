"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Home, Layers, Activity, Award, Bot,
  GraduationCap, Cpu, Briefcase, FolderGit2,
  Trophy, Users, BookOpen, Mic, Menu, X,
  type LucideIcon,
} from "lucide-react";

interface NavSubItem {
  label: string;
  href: string;
  icon: LucideIcon;
}
interface NavGroup {
  label: string;
  href: string;
  icon: LucideIcon;
  items?: NavSubItem[];
}

const NAV: NavGroup[] = [
  { label: "Home", href: "#top", icon: Home },
  {
    label: "Background",
    href: "#background-group",
    icon: Layers,
    items: [
      { label: "Education", href: "#education", icon: GraduationCap },
      { label: "Skills", href: "#skills-tech", icon: Cpu },
      { label: "Working Experience", href: "#experience", icon: Briefcase },
      { label: "Projects", href: "#projects", icon: FolderGit2 },
    ],
  },
  {
    label: "Activities",
    href: "#activities-group",
    icon: Activity,
    items: [
      { label: "Achievement & Awards", href: "#awards", icon: Trophy },
      { label: "Organization", href: "#organization", icon: Users },
      { label: "Publication", href: "#publication", icon: BookOpen },
      { label: "Speaking", href: "#speaking", icon: Mic },
    ],
  },
  { label: "Certification & Course", href: "#certs", icon: Award },
];

function Caret() {
  return (
    <svg className="caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Nav({ onAskAI }: { onAskAI: () => void }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(NAV[0].label);
  const [hovered, setHovered] = React.useState<string | null>(null);
  // The lamp follows the hovered tab; when nothing is hovered it returns to
  // the scroll-active tab.
  const lit = hovered ?? active;

  // Scroll-spy: light the lamp under the tab whose section is in view.
  // Section offsets are cached and only recomputed on resize, so scrolling
  // does no layout reads; the handler is throttled to one run per frame.
  React.useEffect(() => {
    let offsets: { label: string; top: number }[] = [];
    const measure = () => {
      offsets = NAV.map((t) => {
        const el = document.getElementById(t.href.slice(1));
        return { label: t.label, top: el ? el.offsetTop : Infinity };
      });
    };
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 24);
      const mid = window.scrollY + window.innerHeight * 0.35;
      let current = NAV[0].label;
      for (const o of offsets) if (o.top <= mid) current = o.label;
      setActive(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <a className="brand" href="#top">
        <span className="brand-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kk-logo.svg" alt="KK logo" width={24} height={24} />
        </span>
        <span>
          <span className="brand-name">
            Muh. Khadafi Kasim{" "}
            <span className="brand-suffix" style={{ color: "var(--accent)" }}>
              Portfolio
            </span>
          </span>
        </span>
      </a>
      <ul className={"nav-links" + (open ? " open" : "")} onClick={() => setOpen(false)}>
        {NAV.map((item) => {
          const isLit = lit === item.label;
          const TabIcon = item.icon;
          return (
            <li
              className="nav-item"
              key={item.label}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <a className={"nav-link" + (isLit ? " active" : "")} href={item.href}>
                <TabIcon className="nav-ico" size={14} strokeWidth={2} />
                {item.label}
                {item.items ? <Caret /> : null}
                {isLit ? (
                  <motion.span
                    layoutId="nav-lamp"
                    className="nav-lamp"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
              </a>
              {item.items ? (
                <div className="nav-menu">
                  {item.items.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <a href={sub.href} key={sub.href}>
                        <SubIcon className="mi" size={15} strokeWidth={2} /> {sub.label}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </li>
          );
        })}
        <li>
          <button
            className="nav-cta"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAskAI();
            }}
          >
            <Bot size={16} strokeWidth={2.2} /> Ask My AI
          </button>
        </li>
      </ul>
      <button
        className="nav-burger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {open ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
      </button>
    </nav>
  );
}
