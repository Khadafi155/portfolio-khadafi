"use client";

import * as React from "react";

import { Bot, SquarePen, Trash2, User } from "lucide-react";

import { suggestions as SUGGESTIONS } from "@/lib/portfolioData";
import { renderRichNodes } from "@/app/components/portfolio/Icon";
import { useChat, type UiMessage } from "@/app/components/portfolio/ChatContext";

/** New-chat + delete-chat controls, placed in the chat header. */
export function ChatActions({ className = "" }: { className?: string }) {
  const { reset, clear, messages, busy } = useChat();
  const hasChat = messages.length > 1; // more than the greeting
  return (
    <div className={"chat-actions " + className}>
      <button
        type="button"
        className="chat-action"
        title="New chat"
        aria-label="New chat"
        onClick={reset}
        disabled={busy}
      >
        <SquarePen size={15} />
      </button>
      <button
        type="button"
        className="chat-action"
        title="Delete chat"
        aria-label="Delete chat"
        onClick={() => {
          if (window.confirm("Delete this conversation? This can't be undone."))
            clear();
        }}
        disabled={busy || !hasChat}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// Section anchors the bot may deep-link to via [[cta:id|label]].
const SECTION_IDS = new Set([
  "top", "education", "skills-tech", "experience", "projects", "awards",
  "organization", "publication", "speaking", "certs", "contact",
]);
// Two token kinds the bot may emit inline:
//   [[cta:section-id|Label]]  -> jump-to-section button
//   [[reply:Label]]           -> quick-reply that sends "Label" as the next message
const TOKEN_RE = /\[\[(cta|reply):([^\]]+)\]\]/g;

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** A clickable button the bot emits to jump straight to a page section. */
function ChatCTA({ id, label }: { id: string; label: string }) {
  if (!SECTION_IDS.has(id)) return null; // ignore unknown / hallucinated ids
  return (
    <button type="button" className="chat-cta" onClick={() => scrollToSection(id)}>
      <span>{label}</span>
    </button>
  );
}

/** A quick-reply pill: clicking sends its label as the visitor's next reply. */
function ChatReply({ label }: { label: string }) {
  const { send, busy } = useChat();
  return (
    <button
      type="button"
      className="chat-reply"
      disabled={busy}
      onClick={() => send(label)}
    >
      {label}
    </button>
  );
}

/** Render a run of plain answer text: paragraphs (\n\n), line breaks (\n), bold. */
function TextBody({ text, cursor }: { text: string; cursor?: boolean }) {
  const paragraphs = text.split("\n\n");
  return (
    <>
      {paragraphs.map((para, i) => {
        const last = i === paragraphs.length - 1;
        if (para === "" && !last) return null;
        const lines = para.split("\n");
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <React.Fragment key={j}>
                {renderRichNodes(line)}
                {j < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
            {cursor && last ? <span className="cursor" /> : null}
          </p>
        );
      })}
    </>
  );
}

function Message({ m }: { m: UiMessage }) {
  const isBot = m.role === "bot";
  const showCursor = isBot && m.streaming;

  // Split the answer into text runs and clickable buttons (cta + reply). Always
  // hide a trailing incomplete token (mid-stream OR truncated by the token cap)
  // so its raw "[[cta:" / "[[reply:" syntax never shows.
  const text = m.text.replace(/\[\[(?:cta|reply):[^\]]*$/, "");

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  for (const match of text.matchAll(TOKEN_RE)) {
    const before = text.slice(cursor, match.index);
    if (before.trim()) parts.push(<TextBody key={key++} text={before} />);
    if (match[1] === "cta") {
      const [id, label = ""] = match[2].split("|");
      parts.push(<ChatCTA key={key++} id={id} label={label.trim()} />);
    } else {
      parts.push(<ChatReply key={key++} label={match[2].trim()} />);
    }
    cursor = (match.index ?? 0) + match[0].length;
  }
  const rest = text.slice(cursor);
  if (rest.trim() || parts.length === 0 || showCursor) {
    parts.push(<TextBody key={key++} text={rest} cursor={showCursor} />);
  }

  // WhatsApp-style bubbles with avatars: bot (robot) left, user (person) right.
  return (
    <div className={`wa-row ${isBot ? "bot" : "user"}`}>
      {isBot && (
        <span className="wa-avatar bot" aria-hidden="true">
          <Bot size={17} />
        </span>
      )}
      <div className="wa-bubble">
        {m.thinking ? (
          <p style={{ color: "var(--text-faint)" }}>
            <span className="cursor" />
          </p>
        ) : (
          parts
        )}
      </div>
      {!isBot && (
        <span className="wa-avatar user" aria-hidden="true">
          <User size={17} />
        </span>
      )}
    </div>
  );
}

export function MessageList({ variant }: { variant: "console" | "fchat" }) {
  const { messages } = useChat();
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);
  return (
    <div className={variant === "fchat" ? "fchat-body" : "console-body"} ref={ref}>
      {messages.map((m) => (
        <Message key={m.id} m={m} />
      ))}
    </div>
  );
}

export function Suggestions({
  onPick,
  compact,
}: {
  onPick: (q: string) => void;
  compact?: boolean;
}) {
  const { busy } = useChat();
  const list = compact ? SUGGESTIONS.slice(0, 3) : SUGGESTIONS;
  return (
    <div className="suggest">
      {list.map((s, i) => (
        <button
          className="chip"
          key={i}
          disabled={busy}
          onClick={() => onPick(s)}
          type="button"
        >
          <span className="pre">›</span>
          {s}
        </button>
      ))}
    </div>
  );
}
