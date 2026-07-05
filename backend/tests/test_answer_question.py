"""Unit tests for AnswerQuestionUseCase (fake adapters, no real API/DB)."""

from __future__ import annotations

import pytest

from app.application.answer_question import (
    AnswerQuestionUseCase,
    SourcesChunk,
    TokenChunk,
)
from app.domain.entities import Chunk
from tests.fakes import FakeEmbedder, FakeLLM, FakeVectorStore


def _store_with(chunks: list[Chunk]) -> FakeVectorStore:
    store = FakeVectorStore()
    embedder = FakeEmbedder()
    for c, v in zip(chunks, embedder.embed_documents([c.text for c in chunks]), strict=True):
        store.add([Chunk(text=c.text, metadata=c.metadata, embedding=v)])
    return store


async def _drain(uc: AnswerQuestionUseCase, question: str, history=None):
    tokens: list[str] = []
    sources = None
    async for event in uc.run(question, history):
        if isinstance(event, TokenChunk):
            tokens.append(event.text)
        elif isinstance(event, SourcesChunk):
            sources = event.sources
    return "".join(tokens), sources


@pytest.mark.asyncio
async def test_streams_answer_then_sources() -> None:
    store = _store_with(
        [
            Chunk(text="HOOR is a privacy-first AI agent.", metadata={"source": "projects.md"}),
            Chunk(text="Khadafi has 5 years of experience.", metadata={"source": "CV.pdf"}),
        ]
    )
    llm = FakeLLM(reply="HOOR is a Microsoft-funded AI agent.")
    uc = AnswerQuestionUseCase(embedder=FakeEmbedder(), store=store, llm=llm, k=2)

    answer, sources = await _drain(uc, "What is HOOR?")

    assert answer == "HOOR is a Microsoft-funded AI agent."
    assert sources is not None
    labels = {s.label for s in sources}
    assert labels == {"projects.md", "CV.pdf"}
    # tag is derived from the filename stem.
    tags = {s.label: s.tag for s in sources}
    assert tags["CV.pdf"] == "cv"
    assert tags["projects.md"] == "projects"


@pytest.mark.asyncio
async def test_context_and_question_reach_the_llm() -> None:
    store = _store_with(
        [Chunk(text="Daishil is a villa booking platform in Go.", metadata={"source": "projects.md"})]
    )
    llm = FakeLLM()
    uc = AnswerQuestionUseCase(embedder=FakeEmbedder(), store=store, llm=llm, k=4)

    await _drain(uc, "Tell me about Daishil", history=[("user", "hi"), ("assistant", "hey")])

    assert "Daishil is a villa booking platform" in (llm.last_context or "")
    assert llm.last_question == "Tell me about Daishil"
    assert list(llm.last_history) == [("user", "hi"), ("assistant", "hey")]
    # The grounding system prompt is passed through.
    assert "KK.AI" in (llm.last_system or "")


@pytest.mark.asyncio
async def test_no_documents_still_emits_empty_sources() -> None:
    uc = AnswerQuestionUseCase(
        embedder=FakeEmbedder(), store=FakeVectorStore(), llm=FakeLLM(), k=4
    )

    answer, sources = await _drain(uc, "anything")

    assert sources == []
    assert isinstance(answer, str)
