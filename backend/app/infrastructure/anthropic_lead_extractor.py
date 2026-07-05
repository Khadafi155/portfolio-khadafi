"""LeadExtractorPort adapter — pulls intake details via Claude structured output.

Uses a cheap model (Haiku) with a JSON schema so the main chat model (Sonnet)
stays focused on answering. Only fields the visitor actually stated are filled.
Captures both identity (name / how to address / language) and lead details.
"""

from __future__ import annotations

from collections.abc import Sequence

from langchain_anthropic import ChatAnthropic
from pydantic import BaseModel, Field

from app.domain.entities import IntakeInfo
from app.domain.ports import LeadExtractorPort, Turn


class _IntakeSchema(BaseModel):
    name: str | None = Field(
        None,
        description="The visitor's own name / what they want to be called, cleaned "
        "up (e.g. from 'hi im nurliah' -> 'Nurliah'). Null if not stated yet.",
    )
    title: str | None = Field(
        None,
        description="How they want to be addressed: 'Sir', 'Ms', or 'name' if they "
        "prefer just their name. Null if they haven't said.",
    )
    language: str | None = Field(
        None,
        description="Preferred chat language: 'en' for English or 'id' for "
        "Indonesian. Null if not stated.",
    )
    need: str | None = Field(
        None,
        description="What they need Khadafi for / why they're here "
        "(e.g. hiring, a project, or exploring). Null if not stated.",
    )
    contact: str | None = Field(
        None,
        description="Which channel the visitor prefers to reach Khadafi: return "
        "'email' or 'whatsapp'. If they instead volunteered their own email/phone, "
        "put that verbatim. Null if not stated.",
    )
    notes: str | None = Field(None, description="Any other useful detail they shared.")


_SYSTEM = (
    "You extract a website visitor's details from their chat with Khadafi's "
    "assistant. Fill a field ONLY if the visitor themselves stated it; otherwise "
    "leave it null. Never invent or infer beyond what was said. The visitor is the "
    "'user' role; ignore the assistant's own words. For 'title' map any masculine "
    "cue to 'Sir', feminine to 'Ms', and 'call me by my name' to 'name'. For "
    "'language' use 'id' for Indonesian/Bahasa and 'en' for English."
)


class AnthropicLeadExtractor(LeadExtractorPort):
    def __init__(self, model: str, api_key: str) -> None:
        self._llm = ChatAnthropic(
            model=model, api_key=api_key, max_tokens=400
        ).with_structured_output(_IntakeSchema)

    async def extract(self, history: Sequence[Turn]) -> IntakeInfo:
        conversation = "\n".join(f"{role}: {content}" for role, content in history)
        result: _IntakeSchema = await self._llm.ainvoke(
            [("system", _SYSTEM), ("user", conversation)]
        )
        return IntakeInfo(
            name=result.name,
            title=result.title,
            language=result.language,
            need=result.need,
            contact=result.contact,
            notes=result.notes,
        )
