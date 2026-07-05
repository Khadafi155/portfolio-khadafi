"use client";

import * as React from "react";

import * as PD from "@/lib/portfolioData";
import { Icon, renderRichNodes } from "@/app/components/portfolio/Icon";
import { useChat } from "@/app/components/portfolio/ChatContext";
import { ChatActions, MessageList } from "@/app/components/portfolio/ChatUI";
import { Carousel } from "@/app/components/portfolio/Carousel";
import WheelPagination from "@/components/ui/wheel-pagination";
import { webp } from "@/lib/img";
import {
  useReveal,
  CountUp,
  GroupBand,
  SubHead,
  ImageSlot,
  TagIcon,
} from "@/app/components/portfolio/primitives";
import { Bot, Briefcase, FolderGit2, Mic, Smile, Users, BookOpen, Play, Pause, RotateCcw, ExternalLink, Monitor, Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
import { AwardsBlock } from "@/app/components/portfolio/extras";
import { MacbookPro } from "@/components/ui/macbook-pro";
import { SiteFooter, WhatsAppIcon } from "@/components/ui/site-footer";

import dynamic from "next/dynamic";

import { SplineScene } from "@/components/ui/splite";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const ROBOT_SCENE =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/** The 3D robot, mounted client-side only (Spline touches the DOM). */
function HeroRobot() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted ? (
    <SplineScene scene={ROBOT_SCENE} className="spline-fill" />
  ) : (
    <div className="hero-robot-loading">
      <span className="loader" />
    </div>
  );
}

/* ============================================================
   HERO - the chat is the hero
   ============================================================ */
function HeroConsole() {
  const { send, busy } = useChat();
  const [val, setVal] = React.useState("");
  const [ph, setPh] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPh("Ask my AI anything about my work…");
      return;
    }
    const qs = PD.suggestions;
    let qi = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = qs[qi];
      if (!deleting) {
        ci++;
        if (ci > full.length) {
          deleting = true;
          timer = setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        if (ci === 0) {
          deleting = false;
          qi = (qi + 1) % qs.length;
        }
      }
      setPh(full.slice(0, ci));
      timer = setTimeout(tick, deleting ? 34 : 58);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    send(val);
    setVal("");
  };

  const [showEmoji, setShowEmoji] = React.useState(false);
  const insertEmoji = (em: string) => {
    setVal((v) => v + em);
    inputRef.current?.focus();
  };
  React.useEffect(() => {
    if (!showEmoji) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(".ci-emoji-pop") || t.closest(".ci-emoji")) return;
      setShowEmoji(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showEmoji]);

  return (
    <div className="console" id="hero-console">
      <div className="console-bar">
        <div className="console-dots" aria-hidden="true"><i /><i /><i /></div>
        <div className="console-title">
          <Bot size={15} strokeWidth={1.8} className="console-title-bot" />
          <b>KK.AI</b>
        </div>
        <div className="console-badge">
          <Icon name="spark" size={12} /> RAG · grounded
        </div>
        <ChatActions className="console-tools" />
      </div>

      <MessageList variant="console" />

      <form className="console-input" onSubmit={submit}>
        {showEmoji && (
          <div className="ci-emoji-pop">
            <EmojiPicker
              onEmojiClick={(d: { emoji: string }) => insertEmoji(d.emoji)}
              theme={"dark" as never}
              emojiStyle={"native" as never}
              lazyLoadEmojis
              width={340}
              height={420}
              searchPlaceholder="Search emoji"
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
        <div className="ci-pill">
          <input
            ref={inputRef}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={ph}
            aria-label="Ask the AI about Khadafi's work"
          />
          <button
            type="button"
            className="ci-emoji"
            onClick={() => setShowEmoji((s) => !s)}
            aria-label="Emoji picker"
            aria-expanded={showEmoji}
          >
            <Smile size={20} strokeWidth={1.8} />
          </button>
        </div>
        <button
          className="send-btn"
          type="submit"
          disabled={busy || !val.trim()}
          aria-label="Send"
        >
          {busy ? (
            "…"
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          )}
        </button>
      </form>

      <div className="console-hint">
        <Icon name="spark" size={12} style={{ color: "var(--accent)" }} />
        Answers are grounded in Khadafi&apos;s documents and cite their source.
      </div>
    </div>
  );
}

export function Hero() {
  const p = PD.profile;
  return (
    <header className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <h1 className="sr-only">{p.name} - {p.roles.join(" · ")}</h1>

        <div className="hero-card">
          <div className="hero-card-grid">
            <div className="hero-card-text">
              <span className="eyebrow">AI &amp; Automation Engineer · Fullstack Developer</span>
              <p className="hero-lede"><span className="accent">Ask My AI</span> anything about my portfolio.</p>
              <p className="hero-lede-sub">
                It&apos;s trained on my CV &amp; projects - RAG-grounded, and it answers with sources.
              </p>
            </div>
            <div className="hero-card-robot">
              <HeroRobot />
            </div>
          </div>
        </div>

        <HeroConsole />
      </div>
    </header>
  );
}

/* ============================================================
   PROOF BAR
   ============================================================ */
export function ProofBar() {
  return (
    <section className="proof" aria-label="Key facts">
      <ul className="proof-grid">
        {PD.proof.map((c, i) => {
          const numIsInt = /^\d+$/.test(c.num);
          return (
            <li className="proof-cell" key={i}>
              <div className="proof-num">
                {numIsInt ? <CountUp value={parseInt(c.num, 10)} pad={c.num.length} /> : c.num}
                <span className="u">{c.unit}</span>
              </div>
              <div className="proof-label" style={{ whiteSpace: "pre-line" }}>{c.label}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ============================================================
   EXPERIENCE GROUP
   ============================================================ */
function MSBadge() {
  return (
    <span className="badge-ms">
      <span className="ms" aria-hidden="true">
        <i style={{ background: "#f25022" }} /><i style={{ background: "#7fba00" }} />
        <i style={{ background: "#00a4ef" }} /><i style={{ background: "#ffb900" }} />
      </span>
      Microsoft for Startups
    </span>
  );
}

function TimelineRow({ e }: { e: PD.ExperienceItem }) {
  const r = useReveal<HTMLLIElement>();
  return (
    <li className="tl-row reveal" ref={r}>
      <div className="tl-node">
        {e.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={webp(e.logo)}
            alt=""
            className="tl-logo"
            onError={(ev) => { ev.currentTarget.style.display = "none"; }}
          />
        ) : (
          <Briefcase size={20} />
        )}
      </div>
      <div className="tl-body">
        <h4 className="tl-r">{e.role}</h4>
        <p className="tl-meta">
          <span className="tl-co">{e.company}</span>
          <span className="tl-sep">·</span>{e.when}
          <span className="tl-sep">·</span>{e.loc}
        </p>
        {e.desc ? <p className="tl-desc">{e.desc}</p> : null}
        <ul className="tl-bullets">
          {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
        </ul>
      </div>
    </li>
  );
}

export function WorkingExperience() {
  return (
    <div className="sub-block">
      <SubHead id="experience" eyebrow="Working experience" title="Five years, remote, across timezones." index="01.4" icon={<Briefcase size={14} />} />
      <ol className="timeline">
        {PD.experience.map((e, i) => <TimelineRow e={e} key={i} />)}
      </ol>
    </div>
  );
}

/** The iPhone shell: bezel, side buttons, dynamic island + screen.
 *  `controls` (optional) render below the phone. */
function PhoneShell({ children, controls }: { children: React.ReactNode; controls?: React.ReactNode }) {
  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        <span className="phone-btn pb-mute" aria-hidden="true" />
        <span className="phone-btn pb-volup" aria-hidden="true" />
        <span className="phone-btn pb-voldn" aria-hidden="true" />
        <span className="phone-btn pb-power" aria-hidden="true" />
        <span className="phone-island" aria-hidden="true" />
        <div className="phone-screen">{children}</div>
      </div>
      {controls}
    </div>
  );
}

/** A MacBook laptop mockup (for n8n & web-app demos). A slim browser bar sits
 *  at the top of the screen; `controls` (optional) render below the laptop. */
function BrowserShell({ children, controls, url }: { children: React.ReactNode; controls?: React.ReactNode; url?: string }) {
  return (
    <div className="mac-wrap">
      <div className="macbook">
        <div className="mac-screen">
          <div className="mac-display">
            <div className="mac-bar">
              <span className="browser-dot r" aria-hidden="true" />
              <span className="browser-dot y" aria-hidden="true" />
              <span className="browser-dot g" aria-hidden="true" />
              {url ? <span className="browser-url">{url}</span> : null}
            </div>
            <div className="mac-content">{children}</div>
          </div>
        </div>
        <div className="mac-base" aria-hidden="true" />
      </div>
      {controls}
    </div>
  );
}

/** Project demo video with a seek bar below the mockup, rendered inside either a
 *  phone or a browser window. Plays once; when it ends the play/pause button
 *  becomes a restart button. */
function DemoMedia({ src, poster, variant, url }: { src: string; poster?: string; variant: "phone" | "browser"; url?: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(true);
  const [ended, setEnded] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0..1
  const [time, setTime] = React.useState({ cur: 0, dur: 0 });
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };
  const restart = () => {
    const v = ref.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    void v.play();
  };
  const onTime = () => {
    const v = ref.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
    setTime({ cur: v.currentTime, dur: v.duration });
  };
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = ref.current;
    if (!v || !v.duration) return;
    if (ended) setEnded(false);
    v.currentTime = (Number(e.target.value) / 1000) * v.duration;
  };
  const controls = (
    <div className="phone-ctrl">
      <button
        type="button"
        onClick={ended ? restart : toggle}
        aria-label={ended ? "Restart" : playing ? "Pause" : "Play"}
      >
        {ended ? <RotateCcw size={14} /> : playing ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <input
        className="phone-seek"
        type="range"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        onChange={seek}
        aria-label="Seek"
        style={{ ["--p" as string]: `${progress * 100}%` }}
      />
      <span className="phone-time">{fmt(time.cur)} / {fmt(time.dur)}</span>
    </div>
  );
  const video = (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="metadata"
      onPlay={() => { setPlaying(true); setEnded(false); }}
      onPause={() => setPlaying(false)}
      onEnded={() => setEnded(true)}
      onTimeUpdate={onTime}
      onLoadedMetadata={onTime}
    />
  );
  return variant === "browser" ? (
    <BrowserShell controls={controls} url={url}>{video}</BrowserShell>
  ) : (
    <PhoneShell controls={controls}>{video}</PhoneShell>
  );
}

/** A project screenshot that prefers the `.webp` variant (via webp()) but
 *  transparently falls back to the original PNG/JPEG if the webp isn't in
 *  storage yet - so uploading webp files later "just works" with no code change. */
function ShotImg({ src, alt, fill }: { src?: string; alt: string; fill?: boolean }) {
  const [errored, setErrored] = React.useState(false);
  React.useEffect(() => setErrored(false), [src]);
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={fill ? "shot shot-fill" : "shot"}
      src={errored ? src : webp(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored((e) => e || true)}
    />
  );
}

/** A rotating screenshot gallery: shows one shot (placed into a mockup via
 *  `render`) with prev/next buttons, dots, and autoplay. Single-shot arrays
 *  render just the mockup with no controls. Autoplay pauses on hover. */
function ShotGallery({
  images,
  render,
  label,
}: {
  images: string[];
  render: (src: string) => React.ReactNode;
  label: string;
}) {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const n = images.length;
  React.useEffect(() => {
    if (n <= 1 || paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 3500);
    return () => clearInterval(t);
  }, [n, paused]);
  const go = (d: number) => setI((p) => (((p + d) % n) + n) % n);
  const cur = images[Math.min(i, n - 1)];
  return (
    <div
      className="shot-gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {render(cur)}
      {n > 1 ? (
        <div className="shot-nav" aria-label={`${label} gallery`}>
          <button type="button" onClick={() => go(-1)} aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <div className="shot-dots">
            {images.map((_, k) => (
              <button
                key={k}
                type="button"
                className={k === i ? "active" : ""}
                onClick={() => setI(k)}
                aria-label={`${label} ${k + 1}`}
                aria-current={k === i}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next">
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** A card image shown in full (contain) with a blurred cover of itself filling
 *  the empty space — so it reads as "full" without cropping. */
export function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="c-media pub-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pub-bg" src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pub-fg" src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

/** The media column for a project. Supports a Desktop/Mobile toggle plus
 *  single- or multi-shot galleries. Desktop = MacBook SVG; mobile = phone
 *  frame (or a video demo). */
function ProjectMedia({ f }: { f: PD.FeatureProject }) {
  const desktopShots = f.desktopImages ?? (f.desktopImage ? [f.desktopImage] : []);
  const mobileShots = f.mobileImages ?? (!f.frame && f.image && !f.video ? [f.image] : []);
  // Dual = a desktop screenshot plus a phone media (video demo OR mobile shot).
  const dual = desktopShots.length > 0 && (mobileShots.length > 0 || !!f.video);
  const [mode, setMode] = React.useState<"desktop" | "phone">("phone");
  const isDesktop = dual ? mode === "desktop" : (desktopShots.length > 0 || f.frame === "desktop");

  let inner: React.ReactNode;
  if (dual) {
    inner =
      mode === "desktop" ? (
        <ShotGallery
          images={desktopShots}
          label={`${f.name} desktop`}
          render={(src) => (
            <div className="macbook-svg-wrap">
              <MacbookPro src={webp(src)} className="macbook-svg" />
            </div>
          )}
        />
      ) : f.video ? (
        <DemoMedia src={f.video} poster={f.poster} variant="phone" url={f.mediaUrl} key={f.video} />
      ) : (
        <ShotGallery
          images={mobileShots}
          label={`${f.name} mobile`}
          render={(src) => (
            <PhoneShell>
              <ShotImg src={src} alt={`${f.name} mobile screenshot`} />
            </PhoneShell>
          )}
        />
      );
  } else if (desktopShots.length > 0) {
    // Desktop-only: screenshot(s) in the MacBook, no toggle.
    inner = (
      <ShotGallery
        images={desktopShots}
        label={`${f.name} desktop`}
        render={(src) => (
          <div className="macbook-svg-wrap">
            <MacbookPro src={webp(src)} className="macbook-svg" />
          </div>
        )}
      />
    );
  } else if (f.video) {
    inner = (
      <DemoMedia
        src={f.video}
        poster={f.poster}
        variant={f.frame === "desktop" ? "browser" : "phone"}
        url={f.mediaUrl}
        key={f.video}
      />
    );
  } else if (f.frame === "desktop") {
    inner = (
      <BrowserShell url={f.mediaUrl}>
        {f.image ? (
          <ShotImg src={f.image} alt={`${f.name} screenshot`} />
        ) : (
          <div className="phone-ph">{f.media}</div>
        )}
      </BrowserShell>
    );
  } else {
    inner = (
      <PhoneShell>
        {f.image ? (
          <ShotImg src={f.image} alt={`${f.name} screenshot`} />
        ) : (
          <div className="phone-ph">{f.media}</div>
        )}
      </PhoneShell>
    );
  }

  return (
    <div className={`proj-feature-media${isDesktop ? " is-desktop" : ""}`}>
      {dual ? (
        <div className="media-toggle" role="tablist" aria-label="View mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "phone"}
            className={mode === "phone" ? "active" : ""}
            onClick={() => setMode("phone")}
          >
            <Smartphone size={13} /> Mobile
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "desktop"}
            className={mode === "desktop" ? "active" : ""}
            onClick={() => setMode("desktop")}
          >
            <Monitor size={13} /> Desktop
          </button>
        </div>
      ) : null}
      {inner}
    </div>
  );
}

export function ProjectsBlock() {
  const list = PD.projects;
  const total = list.length;
  const [idx, setIdx] = React.useState(0);
  const go = (n: number) => setIdx(((n % total) + total) % total);
  const f = list[idx];
  return (
    <div className="sub-block">
      <SubHead id="projects" eyebrow="Projects" title="Shipped products, not slideware." index="01.6" icon={<FolderGit2 size={14} />} />

      <div className="spot-card proj-feature" key={idx}>
        <div className="proj-feature-body">
          {f.funded ? (
            <div className="proj-tag-row">
              <MSBadge />
            </div>
          ) : null}
          <h4 className="proj-name">{f.name}</h4>
          <div className="proj-kicker">{f.kicker}</div>
          <div className="po-grid">
            <div className="po-item"><div className="k">Problem</div><div className="v">{f.problem}</div></div>
            <div className="po-item"><div className="k">Approach</div><div className="v">{renderRichNodes(f.approach)}</div></div>
            <div className="po-item"><div className="k">Outcome</div><div className="v">{renderRichNodes(f.outcome)}</div></div>
          </div>
          <ul className="stack-tags">{f.stack.map((s, i) => (
            <li className="tag" key={i}>
              <TagIcon label={s} />
              {s}
            </li>
          ))}</ul>
          {f.link ? (
            <a className="proj-live" href={f.link} target="_blank" rel="noreferrer">
              <ExternalLink size={15} />
              <span className="proj-live-label">Visit project - {f.linkLabel}</span>
            </a>
          ) : null}
        </div>
        <ProjectMedia f={f} />
      </div>

      <WheelPagination
        className="awards-nav"
        totalPages={total}
        /* window the numbers (max 5) so the prev/next arrows always stay on
           screen — showing all 10 pushed the arrows off the edge on mobile */
        visibleCount={Math.min(total, 5)}
        loop
        page={idx}
        onChange={go}
      />
    </div>
  );
}

function OrganizationBlock() {
  return (
    <div className="sub-block">
      <SubHead id="organization" eyebrow="Organization" title="Communities & leadership." index="02.1" icon={<Users size={14} />} />
      <Carousel label="Organizations">
        {PD.organizations.map((o, i) => (
          <article className={`spot-card c-card org-card${o.placeholder ? " placeholder" : ""}`} key={i}>
            {o.img ? (
              <CardImage src={o.img} alt={o.name || "Organization"} />
            ) : (
              <ImageSlot className="c-media" placeholder="Drop logo / photo" />
            )}
            {o.name ? <h4 className="c-title sm">{o.name}</h4> : null}
            {o.role || o.when ? <p className="c-sub">{o.role}{o.role && o.when ? " · " : ""}{o.when}</p> : null}
            {o.note ? <p className="c-desc">{o.note}</p> : null}
          </article>
        ))}
      </Carousel>
    </div>
  );
}

function PublicationBlock() {
  return (
    <div className="sub-block">
      <SubHead id="publication" eyebrow="Publication" title="Research & writing." index="02.2" icon={<BookOpen size={14} />} />
      <Carousel label="Publications">
        {PD.publications.map((p, i) => (
          <article className={`spot-card c-card pub-card${p.placeholder ? " placeholder" : ""}`} key={i}>
            {p.img ? (
              <CardImage src={p.img} alt={p.title} />
            ) : (
              <ImageSlot className="c-media" placeholder="Drop cover / page" />
            )}
            <h4 className="c-title sm">{p.title}</h4>
            <p className="c-sub">{p.venue}{p.when ? ` · ${p.when}` : ""}</p>
          </article>
        ))}
      </Carousel>
    </div>
  );
}

function SpeakingBlock() {
  const s = PD.speaking;
  return (
    <div className="sub-block">
      <SubHead id="speaking" eyebrow="Speaking" title="On stage & in the room." index="02.3" icon={<Mic size={14} />} />
      <Carousel label="Speaking engagements">
        {s.events.map((ev, i) => (
          <article className={`spot-card c-card speak-card${ev.img ? " has-img" : ""}`} key={i}>
            {ev.img ? (
              <CardImage src={ev.img} alt={ev.title} />
            ) : (
              <>
                <span className="c-idx">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="c-title sm">{ev.title}</h4>
                <p className="c-sub">{ev.org}</p>
              </>
            )}
          </article>
        ))}
      </Carousel>
    </div>
  );
}

export function ActivitiesGroup() {
  const head = useReveal();
  return (
    <section className="section block" id="activities-group">
      <div className="reveal" ref={head} style={{ marginBottom: 8 }}>
        <GroupBand label="Activities" index="02" />
        <h2 className="section-title">Beyond the work.</h2>
      </div>
      <AwardsBlock />
      <OrganizationBlock />
      <PublicationBlock />
      <SpeakingBlock />
    </section>
  );
}

/* ============================================================
   CONTACT + FOOTER
   ============================================================ */
export function Contact() {
  const p = PD.profile;
  const r = useReveal();
  return (
    <section className="section block contact" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-inner contact-split reveal" ref={r}>
        <div className="contact-photo">
          <span className="cp-stars" aria-hidden="true" />
          <span className="cp-stars cp-stars-2" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/pict.webp?v=2"
            alt={p.name}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="contact-copy">
          <div className="contact-hello-row">
            <span className="contact-hello">Let&apos;s talk!</span>
            <svg className="contact-burst" viewBox="0 0 48 44" aria-hidden="true">
              <g fill="currentColor" transform="rotate(30 22 18)">
                <rect x="5.5" y="7.5" width="7" height="15" rx="3.5" transform="rotate(-40 9 15)" />
                <rect x="17.25" y="0.5" width="7.5" height="23" rx="3.75" transform="rotate(4 21 12)" />
                <rect x="30.5" y="11.5" width="7" height="15" rx="3.5" transform="rotate(40 34 19)" />
              </g>
            </svg>
          </div>
          <h2>Have something that<br />needs to <span className="ac">ship?</span></h2>
          <p>I&apos;m open to roles and collaborations - AI/automation, full-stack, or the messy bits in between. Based in Makassar, working worldwide.</p>
          <div className="contact-actions">
            <a className="btn-primary" href={`mailto:${p.email}`}>
              <Icon name="mail" size={16} /> Email
            </a>
            <a
              className="btn-ghost"
              href={`https://wa.me/${p.phone.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon width={16} height={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return <SiteFooter />;
}
