"""ChatSessionUseCase — server-side memory + AI-driven onboarding/lead capture.

Wraps AnswerQuestionUseCase. The whole intake (name, how to address, language,
what they need, contact) is handled by the LLM in conversation, not a scripted
form. For speed, while the intake is still going the reply is produced by a fast
model with NO document retrieval (there's nothing to ground yet); once intake is
complete, questions go through the full RAG + main-model path. The structured
extractor that persists identity/lead details runs fire-and-forget so it never
delays the visible reply. Depends only on ports.
"""

from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator
from dataclasses import dataclass

from app.application.answer_question import (
    AnswerEvent,
    AnswerQuestionUseCase,
    TokenChunk,
)
from app.application.prompts import SYSTEM_PROMPT
from app.domain.ports import (
    ConversationStorePort,
    LeadExtractorPort,
    LeadStorePort,
    LLMPort,
    SessionStorePort,
    Turn,
)

# Keep a strong reference to fire-and-forget capture tasks so they aren't GC'd.
_BG_TASKS: set[asyncio.Task] = set()

# Only run the (paid) extractor after onboarding when the exchange smells lead-ish.
_LEAD_HINTS = (
    "hire", "hiring", "recruit", "project", "build", "develop", "work with",
    "collaborat", "freelance", "available", "contact",
    "email", "whatsapp", "reach", "quote", "need help", "looking for",
    "butuh", "kerja", "proyek", "bikin", "kontak", "hubungi", "rekrut", "jasa",
)

_LANGUAGES = {"id": "Indonesian", "en": "English"}
_TITLE_TO_DB = {"Sir": "Sir", "Ms": "Ms", "name": ""}

# The opening line shown client-side (frontend `OPENING`). We seed it into the
# server history on the first turn so the model knows it already asked the
# visitor's name and won't greet / ask it again. Keep in sync with the frontend.
_OPENING_GREETING = (
    "Hey there! 👋 I'm **KK.AI**, Khadafi's AI assistant, ready to show you "
    "around his work. Let's get you set up in a few seconds first!\n\n"
    "To kick things off, what should I call you? 😊"
)


def _looks_like_lead(text: str) -> bool:
    low = text.lower()
    return any(hint in low for hint in _LEAD_HINTS)


# Honorific localized by language: Sir/Ms in English, Pak/Bu in Indonesian.
_TITLE_LOCALIZED = {
    ("Sir", "id"): "Pak",
    ("Ms", "id"): "Bu",
    ("Sir", "en"): "Sir",
    ("Ms", "en"): "Ms",
}


def _address(
    name: str | None, title: str | None, language: str | None = None
) -> str | None:
    """How the AI should address the visitor, e.g. 'Pak Kasim' / 'Ms Tumming' / 'Kasim'."""
    if name and title in ("Sir", "Ms"):
        prefix = _TITLE_LOCALIZED.get((title, language or "en"), title)
        return f"{prefix} {name}"
    return name


def _intake_note(
    name: str | None,
    title: str | None,
    language: str | None,
    need: str | None,
    contact: str | None,
) -> str:
    """List what we know + what's still missing, and enforce finishing intake first."""
    known: list[str] = []
    todo: list[str] = []
    if name:
        known.append(f"name={name}")
    else:
        todo.append("their name")
    if title == "":
        known.append("address=by name only")
    elif title:
        known.append(f"address={_TITLE_LOCALIZED.get((title, language or 'en'), title)}")
    else:
        todo.append("how they'd like to be addressed (Sir, Ms, or just their name)")
    if language:
        known.append(f"language={_LANGUAGES.get(language, language)}")
    else:
        todo.append("their preferred language (English or Indonesian)")
    if need:
        known.append(f"need={need}")
    else:
        todo.append("what brings them here (hiring, a project, or just exploring)")
    # `contact` here stores which channel they prefer to reach Khadafi ("email" /
    # "whatsapp"), NOT the visitor's own address - we never ask for that.
    if contact:
        known.append(f"reach preference={contact}")
    else:
        todo.append("whether they'd prefer to reach Khadafi by email or WhatsApp")
    known_str = ", ".join(known) if known else "nothing yet"
    todo_str = "; ".join(todo)
    return (
        "INTAKE MODE - you MUST finish this short intro before anything else.\n"
        f"Known so far: {known_str}.\n"
        f"Still to ask: {todo_str}.\n"
        "Rules:\n"
        "- Keep each message SHORT and light (1-2 sentences), do not over-explain.\n"
        "- Ask for the missing items ONE or TWO at a time, warm and human, never a "
        "rigid form.\n"
        "- For the reach step, ask which channel they'd prefer to reach Khadafi - "
        "email or WhatsApp. When they pick one, GIVE them Khadafi's matching contact "
        "(Email: khadaficonnect@gmail.com, or WhatsApp: wa.me/6281340643550) and add "
        "a Contact CTA. NEVER ask for the visitor's own email or phone number.\n"
        "- If the visitor asks something else (about his projects, skills, awards, "
        "etc.) BEFORE the intake is finished, do NOT answer it yet. Warmly say you'd "
        "love to get into that right after this quick intro, then continue with the "
        "next missing item.\n"
        "- If they just gave you something in their latest message, acknowledge it "
        "and NEVER re-ask it.\n"
        "- Do NOT show the portfolio menu yet while items are still missing.\n"
        "- Only once ALL items above are known (including anything they just provided "
        "in their latest message) is the intake complete: THEN greet them by name, "
        "show the portfolio menu as clickable [[cta:...]] buttons (one per line, NEVER "
        "a plain numbered text list), and warmly invite them to ask anything about "
        "Khadafi."
    )


@dataclass
class ChatSessionUseCase:
    answer: AnswerQuestionUseCase
    sessions: SessionStorePort
    store: ConversationStorePort
    history_limit: int = 20
    lead_extractor: LeadExtractorPort | None = None
    lead_store: LeadStorePort | None = None
    # Fast, retrieval-free model used only for the intake conversation.
    intake_llm: LLMPort | None = None

    async def run(
        self, session_id: str, message: str
    ) -> AsyncIterator[AnswerEvent]:
        history = self.store.load(session_id, self.history_limit)
        if not history:
            # First turn: record the opening greeting (already shown client-side) so
            # the model sees the name was asked and treats this message as the answer.
            self.store.append(session_id, "assistant", _OPENING_GREETING)
            history = [("assistant", _OPENING_GREETING)]

        # What we already know (server is the source of truth, not the client).
        name = self.sessions.get_name(session_id)
        title = self.sessions.get_title(session_id)
        language = self.sessions.get_language(session_id)
        lead = self.lead_store.get(session_id) if self.lead_store else None
        need = lead.need if lead else None
        contact = lead.contact if lead else None

        # Intake to finish before normal Q&A: name, language, what brings them here,
        # and which channel they'd use to reach Khadafi (stored in `contact`). We ask
        # their PREFERENCE (email or WhatsApp) and hand back Khadafi's own contact -
        # we never ask for the visitor's own email/phone.
        intake_active = not (name and language and need and contact)
        addr = _address(name, title, language)

        answer_parts: list[str] = []
        if intake_active and self.intake_llm is not None:
            # Fast path: conversational intake, no RAG, cheap/fast model.
            async for token in self._stream_intake(
                message, history, name, title, language, need, contact, addr
            ):
                answer_parts.append(token)
                yield TokenChunk(token)
        else:
            extra_facts = (
                _intake_note(name, title, language, need, contact)
                if intake_active
                else None
            )
            async for event in self.answer.run(
                message,
                history,
                user_name=addr,
                language=language,
                extra_facts=extra_facts,
            ):
                if isinstance(event, TokenChunk):
                    answer_parts.append(event.text)
                yield event

        answer_text = "".join(answer_parts).strip()
        self.store.append(session_id, "user", message)
        if answer_text:
            self.store.append(session_id, "assistant", answer_text)

        # Persist identity/lead. Only the last couple of turns go to the extractor:
        # new details live in the latest message and fields accumulate via COALESCE,
        # so re-sending the whole conversation to a second model would burn tokens.
        if self.lead_extractor and self.lead_store and (
            intake_active or _looks_like_lead(message + " " + answer_text)
        ):
            recent: list[Turn] = [
                *history[-2:],
                ("user", message),
                ("assistant", answer_text),
            ]
            if intake_active:
                # During onboarding, persist SYNCHRONOUSLY so the next turn sees the
                # fresh name/title/language - otherwise addressing lags (e.g. "Ms"
                # instead of "Bu" right after the visitor picks Indonesian).
                await self._persist(session_id, recent)
            else:
                # After onboarding, fire-and-forget so lead capture never delays a reply.
                task = asyncio.create_task(self._persist(session_id, recent))
                _BG_TASKS.add(task)
                task.add_done_callback(_BG_TASKS.discard)

    async def _stream_intake(
        self,
        message: str,
        history: list[Turn],
        name: str | None,
        title: str | None,
        language: str | None,
        need: str | None,
        contact: str | None,
        addr: str | None,
    ) -> AsyncIterator[str]:
        facts = [_intake_note(name, title, language, need, contact)]
        if addr:
            facts.append(f"(Visitor's name: {addr})")
        if language:
            lang_name = _LANGUAGES.get(language, language)
            facts.append(
                f"(Always reply in {lang_name}, whatever language the question uses.)"
            )
        context = "\n".join(facts)
        assert self.intake_llm is not None
        async for token in self.intake_llm.stream_answer(
            SYSTEM_PROMPT, context, message, history
        ):
            yield token

    async def _persist(self, session_id: str, full: list[Turn]) -> None:
        try:
            info = await self.lead_extractor.extract(full)  # type: ignore[union-attr]
            db_title = _TITLE_TO_DB.get(info.title) if info.title else None
            if info.name or db_title is not None or info.language:
                self.sessions.update_profile(
                    session_id,
                    name=info.name,
                    title=db_title,
                    language=info.language,
                )
            if info.lead.has_data:
                self.lead_store.upsert(session_id, info.lead)  # type: ignore[union-attr]
        except Exception:
            # Capture is a bonus; never let it break the chat.
            pass
