"""Unit tests for IngestDocumentsUseCase (fake adapters, no real API/DB)."""

from __future__ import annotations

from app.application.ingest_documents import IngestDocumentsUseCase
from app.domain.entities import Document
from tests.fakes import FakeEmbedder, FakeLoader, FakeSplitter, FakeVectorStore


def _use_case(docs: list[Document]):
    embedder = FakeEmbedder()
    store = FakeVectorStore()
    uc = IngestDocumentsUseCase(
        loader=FakeLoader(docs),
        splitter=FakeSplitter(),
        embedder=embedder,
        store=store,
    )
    return uc, embedder, store


def test_ingest_embeds_and_stores_every_chunk() -> None:
    docs = [
        Document(content="Khadafi built HOOR.", metadata={"source": "projects.md"}),
        Document(content="5 years of experience.", metadata={"source": "CV.pdf"}),
    ]
    uc, embedder, store = _use_case(docs)

    result = uc.run("docs/")

    assert result.documents == 2
    assert result.chunks == 2
    assert embedder.doc_calls == 1
    assert len(store.chunks) == 2
    # Every stored chunk carries an embedding.
    assert all(c.embedding is not None for c in store.chunks)


def test_ingest_empty_dir_stores_nothing() -> None:
    uc, embedder, store = _use_case([])

    result = uc.run("docs/")

    assert result.documents == 0
    assert result.chunks == 0
    assert embedder.doc_calls == 0
    assert store.chunks == []
