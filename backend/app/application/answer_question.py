"""AnswerQuestionUseCase — embed → search → stream a grounded answer.

Emits a stream of events: TokenChunk(...) for each answer token, then one final
SourcesChunk(...) with the documents the answer drew from. Depends only on
domain ports.
"""

from __future__ import annotations

from collections.abc import AsyncIterator, Sequence
from dataclasses import dataclass, field
from pathlib import PurePath

from app.application.prompts import SYSTEM_PROMPT, format_context
from app.domain.entities import RetrievedChunk, Source
from app.domain.ports import EmbedderPort, LLMPort, Turn, VectorStorePort


@dataclass(frozen=True)
class TokenChunk:
    """One streamed token of the answer."""

    text: str


@dataclass(frozen=True)
class SourcesChunk:
    """The citations, emitted once after the answer finishes."""

    sources: list[Source]


AnswerEvent = TokenChunk | SourcesChunk

# Language codes the visitor can pick during onboarding -> their display name.
_LANGUAGES = {"id": "Indonesian", "en": "English"}


def _tag_for(label: str) -> str:
    """Derive a short tag ('CV.pdf' -> 'cv') for the citation chip."""
    stem = PurePath(label).stem.strip().lower()
    return stem.split()[0] if stem else label.lower()


@dataclass
class AnswerQuestionUseCase:
    embedder: EmbedderPort
    store: VectorStorePort
    llm: LLMPort
    k: int = 4

    async def run(
        self,
        question: str,
        history: Sequence[Turn] | None = None,
        user_name: str | None = None,
        language: str | None = None,
        extra_facts: str | None = None,
    ) -> AsyncIterator[AnswerEvent]:
        history = history or []

        query_vector = self.embedder.embed_query(question)
        retrieved = self.store.search(query_vector, self.k)

        context = format_context([(c.source, c.text) for c in retrieved])
        # Prepend session facts; the system prompt decides how to use them.
        facts: list[str] = []
        if extra_facts:
            facts.append(extra_facts)
        if user_name:
            facts.append(f"(Visitor's name: {user_name})")
        if language:
            lang_name = _LANGUAGES.get(language, language)
            facts.append(
                f"(Always reply in {lang_name}, whatever language the question uses.)"
            )
        if facts:
            context = "\n".join(facts) + "\n\n" + context
        sources = self._sources(retrieved)

        async for token in self.llm.stream_answer(
            SYSTEM_PROMPT, context, question, history
        ):
            yield TokenChunk(token)

        yield SourcesChunk(sources)

    @staticmethod
    def _sources(retrieved: list[RetrievedChunk]) -> list[Source]:
        """Unique cited documents, in first-seen order."""
        seen: set[str] = set()
        sources: list[Source] = []
        for chunk in retrieved:
            label = chunk.source
            if label in seen:
                continue
            seen.add(label)
            sources.append(Source(label=label, tag=_tag_for(label)))
        return sources
