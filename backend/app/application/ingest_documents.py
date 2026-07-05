"""IngestDocumentsUseCase — load → split → embed → store.

Depends only on domain ports, never on concrete tools.
"""

from __future__ import annotations

from dataclasses import dataclass, replace

from app.domain.entities import Chunk
from app.domain.ports import EmbedderPort, LoaderPort, SplitterPort, VectorStorePort


@dataclass
class IngestResult:
    documents: int
    chunks: int


@dataclass
class IngestDocumentsUseCase:
    loader: LoaderPort
    splitter: SplitterPort
    embedder: EmbedderPort
    store: VectorStorePort

    def run(self, docs_dir: str) -> IngestResult:
        documents = self.loader.load(docs_dir)
        chunks = self.splitter.split(documents)
        if not chunks:
            return IngestResult(documents=len(documents), chunks=0)

        vectors = self.embedder.embed_documents([c.text for c in chunks])
        embedded: list[Chunk] = [
            replace(chunk, embedding=vector)
            for chunk, vector in zip(chunks, vectors, strict=True)
        ]
        self.store.add(embedded)
        return IngestResult(documents=len(documents), chunks=len(embedded))
