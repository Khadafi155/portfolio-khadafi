"use client";

import * as React from "react";

import {
  clearUserName,
  deleteConversation,
  fetchConversation,
  getSessionId,
  resetSessionId,
  streamChat,
  type Source,
} from "@/lib/chatClient";

// The one static, client-side line: the opening greeting. Everything after this
// (the whole intake + Q&A) is driven by the AI on the server. Kept in sync with the
// backend `_OPENING_GREETING`, which seeds it into history so the AI won't re-ask.
const OPENING =
  "Hey there! 👋 I'm **KK.AI**, Khadafi's AI assistant, ready to show you around his work. Let's get you set up in a few seconds first!\n\nTo kick things off, what should I call you? 😊";

export interface UiMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  sources?: Source[];
  streaming?: boolean;
  thinking?: boolean;
}

interface ChatValue {
  messages: UiMessage[];
  busy: boolean;
  send: (raw: string) => void;
  reset: () => void;
  clear: () => void;
}

const ChatContext = React.createContext<ChatValue | null>(null);

export function useChat(): ChatValue {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const idRef = React.useRef(0);
  const nextId = React.useCallback(() => `m${(idRef.current += 1)}`, []);

  const [messages, setMessages] = React.useState<UiMessage[]>([
    { id: "onboard", role: "bot", text: "", thinking: true, streaming: true },
  ]);
  const [busy, setBusy] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const typeTimerRef = React.useRef<number | null>(null);
  const sessionRef = React.useRef<string>("");

  // Add a bot message that "types": show a thinking bubble, then reveal the text.
  const typeBotMessage = React.useCallback(
    (text: string, delay = 650) => {
      if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);
      const id = nextId();
      setMessages((prev) => [
        ...prev,
        { id, role: "bot", text: "", thinking: true, streaming: true },
      ]);
      setBusy(true);
      typeTimerRef.current = window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, text, thinking: false, streaming: false } : m,
          ),
        );
        setBusy(false);
        typeTimerRef.current = null;
      }, delay);
    },
    [nextId],
  );

  // Open a fresh chat: just the static greeting; the AI takes over from the first reply.
  const showFresh = React.useCallback(() => {
    setMessages([]);
    typeBotMessage(OPENING);
  }, [typeBotMessage]);

  const streamAnswer = React.useCallback(
    (query: string) => {
      const botId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: query },
        { id: botId, role: "bot", text: "", streaming: true, thinking: true },
      ]);
      setBusy(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const patch = (fn: (m: UiMessage) => UiMessage) =>
        setMessages((prev) => prev.map((m) => (m.id === botId ? fn(m) : m)));

      // The server owns the session: it loads the visitor's profile from the DB
      // and runs the AI intake, so we only send the message + session id.
      void streamChat(
        { message: query, sessionId: sessionRef.current },
        {
          onToken: (t) => patch((m) => ({ ...m, text: m.text + t, thinking: false })),
          onSources: (sources) => patch((m) => ({ ...m, sources })),
          onDone: () => {
            patch((m) => ({ ...m, streaming: false, thinking: false }));
            setBusy(false);
          },
          onError: (error) => {
            patch((m) => ({
              ...m,
              streaming: false,
              thinking: false,
              text: m.text || `Sorry - something went wrong: ${error.message}`,
            }));
            setBusy(false);
          },
        },
        controller.signal,
      );
    },
    [nextId],
  );

  React.useEffect(() => {
    sessionRef.current = getSessionId();
    let cancelled = false;
    void fetchConversation(sessionRef.current).then(({ messages: prior }) => {
      if (cancelled) return;
      if (prior.length > 0) {
        setMessages(
          prior.map((m) => ({
            id: nextId(),
            role: (m.role === "assistant" ? "bot" : "user") as "bot" | "user",
            text: m.content,
            streaming: false,
          })),
        );
      } else {
        showFresh();
      }
    });
    return () => {
      cancelled = true;
      abortRef.current?.abort();
      if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);
    };
  }, [nextId, showFresh]);

  const send = React.useCallback(
    (raw: string) => {
      const query = (raw || "").trim();
      if (!query || busy) return;
      streamAnswer(query);
    },
    [busy, streamAnswer],
  );

  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);
    sessionRef.current = resetSessionId();
    clearUserName();
    setBusy(false);
    showFresh();
  }, [showFresh]);

  const clear = React.useCallback(() => {
    abortRef.current?.abort();
    if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);
    void deleteConversation(sessionRef.current);
    clearUserName();
    setBusy(false);
    showFresh();
  }, [showFresh]);

  return (
    <ChatContext.Provider value={{ messages, busy, send, reset, clear }}>
      {children}
    </ChatContext.Provider>
  );
}
