"""EmbedderPort adapter — OpenAI embeddings via langchain-openai."""

from __future__ import annotations

from langchain_openai import OpenAIEmbeddings

from app.domain.entities import Vector
from app.domain.ports import EmbedderPort


class OpenAIEmbedder(EmbedderPort):
    def __init__(self, model: str, api_key: str) -> None:
        self._embeddings = OpenAIEmbeddings(model=model, api_key=api_key)

    @property
    def lc_embeddings(self) -> OpenAIEmbeddings:
        """The underlying LangChain object (needed by the pgvector store)."""
        return self._embeddings

    def embed_documents(self, texts: list[str]) -> list[Vector]:
        return self._embeddings.embed_documents(texts)

    def embed_query(self, text: str) -> Vector:
        return self._embeddings.embed_query(text)
