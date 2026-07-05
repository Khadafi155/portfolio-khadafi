"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Bot, X, Smile } from "lucide-react";

import { useChat } from "@/app/components/portfolio/ChatContext";
import { ChatActions, MessageList } from "@/app/components/portfolio/ChatUI";
import { suggestions as SUGGESTIONS } from "@/lib/portfolioData";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export function FloatingChat({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const { send, busy } = useChat();
  const [showFab, setShowFab] = React.useState(false);
  const [val, setVal] = React.useState("");
  const [ph, setPh] = React.useState("");
  const [showEmoji, setShowEmoji] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Typewriter placeholder cycling through the suggestions (same as hero console).
  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPh("Ask about his work…");
      return;
    }
    const qs = SUGGESTIONS;
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

  React.useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShowFab(window.scrollY > window.innerHeight * 0.7);
    };
    const on = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    send(val);
    setVal("");
  };

  return (
    <>
      <button
        className={"fab" + (showFab && !open ? "" : " hidden")}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Bot size={16} strokeWidth={2.2} /> Ask My AI
      </button>

      {open && (
        <div className="fchat" role="dialog" aria-label="Chat with KK.AI">
          <div className="console-bar fchat-bar">
            <div className="console-dots" aria-hidden="true"><i /><i /><i /></div>
            <div className="console-title">
              <Bot size={15} strokeWidth={1.8} className="console-title-bot" />
              <b>KK.AI</b>
            </div>
            <div className="fchat-head-tools">
              <ChatActions />
              <span className="fchat-tools-sep" aria-hidden="true" />
              <button
                className="fchat-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                title="Close"
                type="button"
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <MessageList variant="fchat" />

          <div className="fchat-foot">
            <form className="console-input fchat-form" onSubmit={submit}>
              {showEmoji && (
                <div className="ci-emoji-pop">
                  <EmojiPicker
                    onEmojiClick={(d: { emoji: string }) => insertEmoji(d.emoji)}
                    theme={"dark" as never}
                    emojiStyle={"native" as never}
                    lazyLoadEmojis
                    width="100%"
                    height={340}
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
                  aria-label="Ask the AI"
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
