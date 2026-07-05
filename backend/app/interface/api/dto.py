"""Pydantic DTOs for the chat API (the wire format)."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    # `role` is constrained to the two valid values, so a client cannot inject a
    # fake "system" turn into the conversation.
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    # Bounded length caps the prompt-injection surface and runaway token cost.
    message: str = Field(min_length=1, max_length=2000)
    # When set, the server owns the conversation history for this session and
    # `history` is ignored. When absent, the client supplies `history` per request.
    session_id: str | None = Field(default=None, max_length=64)
    # Optional visitor name (collected during onboarding) for a warmer reply.
    user_name: str | None = Field(default=None, max_length=60)
    # Preferred reply language: "en" or "id" (chosen during onboarding).
    language: str | None = Field(default=None, max_length=5)
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)


class ConversationResponse(BaseModel):
    """Prior turns + saved name/title/language, to rehydrate the chat UI."""

    messages: list[ChatMessage] = Field(default_factory=list)
    name: str | None = None
    title: str | None = None
    language: str | None = None


class SetNameRequest(BaseModel):
    name: str = Field(min_length=1, max_length=60)
    # How they'd like to be addressed: "Sir", "Ms", or "" / null for name only.
    title: str | None = Field(default=None, max_length=10)
    # Preferred reply language: "en" or "id" (or null when not being set here).
    language: str | None = Field(default=None, max_length=5)


class LeadUpdate(BaseModel):
    """Partial lead fields captured during the registration/intake flow."""

    need: str | None = Field(default=None, max_length=500)
    contact: str | None = Field(default=None, max_length=200)
    notes: str | None = Field(default=None, max_length=1000)


class SourceDTO(BaseModel):
    """Matches the frontend `Source` type ({ label, tag })."""

    label: str
    tag: str
