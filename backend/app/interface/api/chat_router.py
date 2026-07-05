"""POST /chat — streams a grounded answer over Server-Sent Events.

If the request carries a `session_id`, the server owns the conversation history
(persisted in Postgres) so context survives page reloads. Otherwise the client
supplies `history` per request. GET /conversation/{session_id} rehydrates the UI.

SSE event contract (consumed by the frontend chatClient):
  event: token    data: {"text": "<piece>"}
  event: sources  data: [{"label": "...", "tag": "..."}]
  event: done     data: {}
  event: error    data: {"message": "..."}
"""

from __future__ import annotations

import json
from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException, Request
from sse_starlette.sse import EventSourceResponse

from app.application.answer_question import (
    AnswerEvent,
    AnswerQuestionUseCase,
    SourcesChunk,
    TokenChunk,
)
from app.application.chat_session import ChatSessionUseCase
from app.domain.entities import LeadInfo
from app.domain.ports import (
    ConversationStorePort,
    LeadStorePort,
    RateLimiterPort,
    SessionStorePort,
)
from app.interface.api.dto import (
    ChatMessage,
    ChatRequest,
    ConversationResponse,
    LeadUpdate,
    SetNameRequest,
)
from app.interface.dependencies import (
    get_answer_use_case,
    get_chat_session_use_case,
    get_conversation_store,
    get_lead_store,
    get_rate_limiter,
    get_session_store,
)

router = APIRouter()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(
    request: Request,
    limiter: RateLimiterPort = Depends(get_rate_limiter),
) -> None:
    """Per-IP anti-spam guard for /chat (each call costs an LLM request)."""
    if not limiter.allow(f"chat:{_client_ip(request)}"):
        raise HTTPException(
            status_code=429,
            detail="Too many requests — please slow down a moment. 🙏",
        )


async def _sse(events: AsyncIterator[AnswerEvent]) -> AsyncIterator[dict]:
    try:
        async for event in events:
            if isinstance(event, TokenChunk):
                yield {"event": "token", "data": json.dumps({"text": event.text})}
            elif isinstance(event, SourcesChunk):
                payload = [{"label": s.label, "tag": s.tag} for s in event.sources]
                yield {"event": "sources", "data": json.dumps(payload)}
        yield {"event": "done", "data": "{}"}
    except Exception as exc:  # noqa: BLE001 — surface any failure to the client
        yield {"event": "error", "data": json.dumps({"message": str(exc)})}


@router.post("/chat", dependencies=[Depends(rate_limit)])
async def chat(
    request: ChatRequest,
    answer: AnswerQuestionUseCase = Depends(get_answer_use_case),
    session: ChatSessionUseCase = Depends(get_chat_session_use_case),
) -> EventSourceResponse:
    if request.session_id:
        # Server owns the session: it loads the visitor's profile from the DB and
        # runs the AI intake, so the client doesn't pass name/language.
        events = session.run(request.session_id, request.message)
    else:
        history = [(m.role, m.content) for m in request.history]
        events = answer.run(
            request.message, history, request.user_name, request.language
        )
    return EventSourceResponse(_sse(events))


@router.get("/conversation/{session_id}")
def conversation(
    session_id: str,
    store: ConversationStorePort = Depends(get_conversation_store),
    sessions: SessionStorePort = Depends(get_session_store),
) -> ConversationResponse:
    turns = store.load(session_id, 50)
    return ConversationResponse(
        messages=[ChatMessage(role=role, content=content) for role, content in turns],
        name=sessions.get_name(session_id),
        title=sessions.get_title(session_id),
        language=sessions.get_language(session_id),
    )


@router.put("/conversation/{session_id}/name", status_code=204)
def set_session_name(
    session_id: str,
    request: SetNameRequest,
    sessions: SessionStorePort = Depends(get_session_store),
) -> None:
    sessions.set_name(session_id, request.name, request.title, request.language)


@router.put("/conversation/{session_id}/lead", status_code=204)
def update_lead(
    session_id: str,
    request: LeadUpdate,
    leads: LeadStorePort = Depends(get_lead_store),
) -> None:
    leads.upsert(
        session_id,
        LeadInfo(
            need=request.need,
            contact=request.contact,
            notes=request.notes,
        ),
    )


@router.delete("/conversation/{session_id}", status_code=204)
def delete_conversation(
    session_id: str,
    store: ConversationStorePort = Depends(get_conversation_store),
    sessions: SessionStorePort = Depends(get_session_store),
) -> None:
    store.delete(session_id)
    sessions.clear(session_id)
