"""In-memory fake adapters implementing the domain ports.

Used by the use-case tests so they run with zero real API/DB calls.
"""

from __future__ import annotations

from collections.abc import AsyncIterator, Sequence

from app.domain.entities import Chunk, Document, RetrievedChunk, Vector
from app.domain.ports import (
    EmbedderPort,
    LLMPort,
    LoaderPort,
    SplitterPort,
    Turn,
    VectorStorePort,
)


class FakeLoader(LoaderPort):
    def __init__(self, docs: list[Document]) -> None:
        self._docs = docs

    def load(self, path: str) -> list[Document]:
        return list(self._docs)


class FakeSplitter(SplitterPort):
    """One chunk per document (enough for tests)."""

    def split(self, docs: list[Document]) -> list[Chunk]:
        return [Chunk(text=d.content, metadata=dict(d.metadata)) for d in docs]


class FakeEmbedder(EmbedderPort):
    """Deterministic toy embedding: [len(text), #words, #vowels]."""

    def __init__(self) -> None:
        self.doc_calls = 0
        self.query_calls = 0

    def _vec(self, text: str) -> Vector:
        return [
            float(len(text)),
            float(len(text.split())),
            float(sum(text.lower().count(v) for v in "aeiou")),
        ]

    def embed_documents(self, texts: list[str]) -> list[Vector]:
        self.doc_calls += 1
        return [self._vec(t) for t in texts]

    def embed_query(self, text: str) -> Vector:
        self.query_calls += 1
        return self._vec(text)


class FakeVectorStore(VectorStorePort):
    """Stores chunks in a list; search returns the top-k by nearest vector."""

    def __init__(self) -> None:
        self.chunks: list[Chunk] = []

    def add(self, chunks: list[Chunk]) -> None:
        self.chunks.extend(chunks)

    def search(self, query_vector: Vector, k: int) -> list[RetrievedChunk]:
        def dist(chunk: Chunk) -> float:
            emb = chunk.embedding or []
            return sum((a - b) ** 2 for a, b in zip(emb, query_vector, strict=False))

        ranked = sorted(self.chunks, key=dist)
        return [
            RetrievedChunk(text=c.text, metadata=dict(c.metadata), score=1.0 / (1.0 + dist(c)))
            for c in ranked[:k]
        ]


class FakeLLM(LLMPort):
    """Echoes a canned answer word-by-word and records what it was given."""

    def __init__(self, reply: str = "Sure — here is what I found.") -> None:
        self.reply = reply
        self.last_system: str | None = None
        self.last_context: str | None = None
        self.last_question: str | None = None
        self.last_history: Sequence[Turn] = []

    async def stream_answer(
        self,
        system: str,
        context: str,
        question: str,
        history: Sequence[Turn],
    ) -> AsyncIterator[str]:
        self.last_system = system
        self.last_context = context
        self.last_question = question
        self.last_history = list(history)
        for i, word in enumerate(self.reply.split()):
            yield word if i == 0 else f" {word}"
