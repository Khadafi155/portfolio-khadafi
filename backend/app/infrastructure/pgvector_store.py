"""VectorStorePort adapter — pgvector via langchain-postgres.

We store the vectors our EmbedderPort already computed (add_embeddings) and query
by a precomputed vector (…_by_vector), so the embedding step stays in one place
and this adapter never re-embeds.
"""

from __future__ import annotations

from langchain_core.embeddings import Embeddings
from langchain_postgres import PGVector

from app.domain.entities import Chunk, RetrievedChunk, Vector
from app.domain.ports import VectorStorePort


class PgVectorStore(VectorStorePort):
    def __init__(
        self,
        connection: str,
        collection_name: str,
        embeddings: Embeddings,
    ) -> None:
        self._store = PGVector(
            embeddings=embeddings,
            collection_name=collection_name,
            connection=connection,
            use_jsonb=True,
            # Supabase's pooler drops idle connections, which surfaces as
            # "server closed the connection unexpectedly". pool_pre_ping checks a
            # connection is alive before using it (and transparently reconnects);
            # pool_recycle retires connections before the server times them out.
            engine_args={"pool_pre_ping": True, "pool_recycle": 300},
        )

    def add(self, chunks: list[Chunk]) -> None:
        if not chunks:
            return
        self._store.add_embeddings(
            texts=[c.text for c in chunks],
            embeddings=[c.embedding for c in chunks],
            metadatas=[dict(c.metadata) for c in chunks],
        )

    def search(self, query_vector: Vector, k: int) -> list[RetrievedChunk]:
        results = self._store.similarity_search_with_score_by_vector(
            embedding=query_vector, k=k
        )
        return [
            RetrievedChunk(
                text=doc.page_content,
                metadata=dict(doc.metadata or {}),
                score=float(score),
            )
            for doc, score in results
        ]
