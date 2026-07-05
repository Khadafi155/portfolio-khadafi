/**
 * chatClient - the frontend data layer.
 *
 * This is the ONLY module that knows how the chat answer is produced. The chat
 * UI talks to it exclusively through `streamChat` and the types below.
 *
 * Phase 6 (now): the REAL client. It POSTs to `${NEXT_PUBLIC_API_URL}/chat` and
 * parses the backend's SSE stream (events: token / sources / done / error). The
 * exported types and callback contract are unchanged from the Phase 3 mock, so
 * no UI component changes.
 */

import { type Source } from "@/lib/portfolioData";

export type { Source };

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  /** When set, the server owns & persists this session's history. */
  sessionId?: string;
  /** Visitor's name (from onboarding) for a warmer, personalised reply. */
  userName?: string;
  /** Preferred reply language ("en" | "id"), chosen during onboarding. */
  language?: string;
  /** Prior turns (used only when no sessionId — server owns it otherwise). */
  history?: ChatMessage[];
}

export interface StreamCallbacks {
  /** Called for each streamed token of the answer. */
  onToken: (token: string) => void;
  /** Called once, after the answer, with the grounding sources. */
  onSources: (sources: Source[]) => void;
  /** Called once when the stream finishes successfully. */
  onDone: () => void;
  /** Called if the stream fails. */
  onError: (error: Error) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SESSION_KEY = "kk_chat_session";

/** Stable per-browser conversation id (persisted in localStorage). */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      window.crypto?.randomUUID?.() ??
      `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const NAME_KEY = "kk_user_name";

/** The visitor's name collected during onboarding (empty if not set yet). */
export function getUserName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function setUserName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAME_KEY, name);
}

/** Forget the visitor's name (used by "Delete chat" for a full reset). */
export function clearUserName(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(NAME_KEY);
}

/** Start a fresh conversation (new session id). */
export function resetSessionId(): string {
  if (typeof window === "undefined") return "";
  const id =
    window.crypto?.randomUUID?.() ??
    `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(SESSION_KEY, id);
  return id;
}

/** Load a session's prior turns + saved name/title/language (rehydrate on reload). */
export async function fetchConversation(
  sessionId: string,
): Promise<{
  messages: ChatMessage[];
  name: string;
  title: string;
  language: string;
}> {
  try {
    const res = await fetch(`${API_URL}/conversation/${sessionId}`);
    if (!res.ok) return { messages: [], name: "", title: "", language: "" };
    const data = (await res.json()) as {
      messages?: ChatMessage[];
      name?: string | null;
      title?: string | null;
      language?: string | null;
    };
    return {
      messages: data.messages ?? [],
      name: data.name ?? "",
      title: data.title ?? "",
      language: data.language ?? "",
    };
  } catch {
    return { messages: [], name: "", title: "", language: "" };
  }
}

/** Persist the visitor's name (+ optional Sir/Ms title, + language) to the DB. */
export async function saveName(
  sessionId: string,
  name: string,
  title?: string,
  language?: string,
): Promise<void> {
  try {
    const body: Record<string, string> = { name };
    if (title !== undefined) body.title = title;
    if (language !== undefined) body.language = language;
    await fetch(`${API_URL}/conversation/${sessionId}/name`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    /* best-effort; localStorage still holds the name */
  }
}

export interface LeadFields {
  need?: string;
  contact?: string;
  notes?: string;
}

/** Save intake/registration answers to the lead record (accumulates). */
export async function saveLead(
  sessionId: string,
  fields: LeadFields,
): Promise<void> {
  try {
    await fetch(`${API_URL}/conversation/${sessionId}/lead`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
  } catch {
    /* best-effort */
  }
}

/** Permanently delete a session's stored conversation on the server. */
export async function deleteConversation(sessionId: string): Promise<void> {
  try {
    await fetch(`${API_URL}/conversation/${sessionId}`, { method: "DELETE" });
  } catch {
    /* best-effort — UI clears regardless */
  }
}

/** Parse one SSE block ("event: ...\n data: ...") into its event name + data. */
function parseSSEBlock(block: string): { event: string; data: string } {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).replace(/^ /, ""));
    }
  }
  return { event, data: dataLines.join("\n") };
}

/**
 * Stream a grounded answer for `request`, invoking `callbacks` as tokens and
 * sources arrive. Paragraphs are separated by a blank line ("\n\n") in the
 * token stream - the UI splits on that to render multiple paragraphs.
 */
export async function streamChat(
  request: ChatRequest,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const { onToken, onSources, onDone, onError } = callbacks;
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: request.message,
        session_id: request.sessionId,
        user_name: request.userName,
        language: request.language,
        history: request.history ?? [],
      }),
      signal,
    });

    if (response.status === 429) {
      throw new Error(
        "Whoa, too many messages in a short time — please wait a moment and try again. 🙏",
      );
    }
    if (!response.ok || !response.body) {
      throw new Error(`Chat request failed (HTTP ${response.status})`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finished = false;

    // Read the stream; SSE events are separated by a blank line.
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        if (!block.trim()) continue;

        const { event, data } = parseSSEBlock(block);
        if (!data) continue;

        if (event === "token") {
          const { text } = JSON.parse(data) as { text: string };
          if (text) onToken(text);
        } else if (event === "sources") {
          onSources(JSON.parse(data) as Source[]);
        } else if (event === "done") {
          onDone();
          finished = true;
        } else if (event === "error") {
          const { message } = JSON.parse(data) as { message: string };
          throw new Error(message || "Chat failed");
        }
      }
    }

    // Stream closed without an explicit "done" — still resolve cleanly.
    if (!finished) onDone();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return; // cancellation is not an error for the caller
    }
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}
