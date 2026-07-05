"""Domain ports — abstract interfaces (the contracts).

Use cases depend ONLY on these abstractions, never on concrete tools. The
infrastructure layer provides implementations. No framework imports here.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator, Sequence

from app.domain.entities import (
    Chunk,
    Document,
    IntakeInfo,
    LeadInfo,
    RetrievedChunk,
    Vector,
)

# One conversation turn: (role, content), role in {"user", "assistant"}.
Turn = tuple[str, str]


class LoaderPort(ABC):
    """Load raw documents from a path (a file or a directory)."""

    @abstractmethod
    def load(self, path: str) -> list[Document]: ...


class SplitterPort(ABC):
    """Split documents into retrieval-sized chunks."""

    @abstractmethod
    def split(self, docs: list[Document]) -> list[Chunk]: ...


class EmbedderPort(ABC):
    """Turn text into embedding vectors."""

    @abstractmethod
    def embed_documents(self, texts: list[str]) -> list[Vector]: ...

    @abstractmethod
    def embed_query(self, text: str) -> Vector: ...


class VectorStorePort(ABC):
    """Persist and similarity-search embedded chunks."""

    @abstractmethod
    def add(self, chunks: list[Chunk]) -> None: ...

    @abstractmethod
    def search(self, query_vector: Vector, k: int) -> list[RetrievedChunk]: ...


class LLMPort(ABC):
    """Stream a grounded answer, token by token."""

    @abstractmethod
    def stream_answer(
        self,
        system: str,
        context: str,
        question: str,
        history: Sequence[Turn],
    ) -> AsyncIterator[str]: ...


class ConversationStorePort(ABC):
    """Persist conversation turns per session so context survives page reloads."""

    @abstractmethod
    def load(self, session_id: str, limit: int) -> list[Turn]: ...

    @abstractmethod
    def append(self, session_id: str, role: str, content: str) -> None: ...

    @abstractmethod
    def delete(self, session_id: str) -> None: ...


class SessionStorePort(ABC):
    """Per-session visitor info: name, how they'd like to be addressed, language."""

    @abstractmethod
    def set_name(
        self,
        session_id: str,
        name: str,
        title: str | None = None,
        language: str | None = None,
    ) -> None: ...

    @abstractmethod
    def update_profile(
        self,
        session_id: str,
        name: str | None = None,
        title: str | None = None,
        language: str | None = None,
    ) -> None:
        """Upsert only the fields provided (COALESCE keeps existing values)."""
        ...

    @abstractmethod
    def get_name(self, session_id: str) -> str | None: ...

    @abstractmethod
    def get_title(self, session_id: str) -> str | None: ...

    @abstractmethod
    def get_language(self, session_id: str) -> str | None: ...

    @abstractmethod
    def clear(self, session_id: str) -> None: ...


class RateLimiterPort(ABC):
    """Throttle abusive traffic. `allow(key)` is False when the key is over budget."""

    @abstractmethod
    def allow(self, key: str) -> bool: ...


class LeadExtractorPort(ABC):
    """Pull structured intake details (identity + lead) out of a conversation."""

    @abstractmethod
    async def extract(self, history: Sequence[Turn]) -> IntakeInfo: ...


class LeadStorePort(ABC):
    """Persist a visitor's lead info (accumulating across turns)."""

    @abstractmethod
    def upsert(self, user_id: str, lead: LeadInfo) -> None: ...

    @abstractmethod
    def get(self, user_id: str) -> LeadInfo: ...
