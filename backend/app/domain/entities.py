"""Domain entities — pure business objects.

No framework imports here (no langchain, fastapi, openai, pydantic). Just plain
Python. These types are the vocabulary every other layer speaks.
"""

from __future__ import annotations

from dataclasses import dataclass, field

# A dense embedding vector. Kept as a plain list so the domain stays framework-free.
Vector = list[float]


@dataclass(frozen=True)
class Document:
    """A raw source document loaded from disk (a CV, a projects file, ...)."""

    content: str
    metadata: dict[str, str] = field(default_factory=dict)

    @property
    def source(self) -> str:
        return self.metadata.get("source", "unknown")


@dataclass(frozen=True)
class Chunk:
    """A slice of a document, small enough to embed and retrieve."""

    text: str
    metadata: dict[str, str] = field(default_factory=dict)
    embedding: Vector | None = None

    @property
    def source(self) -> str:
        return self.metadata.get("source", "unknown")


@dataclass(frozen=True)
class RetrievedChunk:
    """A chunk returned by a similarity search, with its relevance score."""

    text: str
    metadata: dict[str, str] = field(default_factory=dict)
    score: float = 0.0

    @property
    def source(self) -> str:
        return self.metadata.get("source", "unknown")


@dataclass(frozen=True)
class Source:
    """A citation shown to the user. Maps 1:1 to the frontend `Source` DTO
    ({ label, tag }) so the UI can render it without translation."""

    label: str
    tag: str


@dataclass(frozen=True)
class Answer:
    """A grounded answer plus the documents it drew from."""

    text: str
    sources: list[Source] = field(default_factory=list)


@dataclass(frozen=True)
class LeadInfo:
    """What a visitor (potential client) wants, captured from the conversation."""

    need: str | None = None  # what they need Khadafi for (hire / project / explore)
    contact: str | None = None  # email / phone / whatsapp
    notes: str | None = None  # any extra detail the visitor shared

    @property
    def has_data(self) -> bool:
        return any((self.need, self.contact, self.notes))


@dataclass(frozen=True)
class IntakeInfo:
    """Everything the AI intake pulls from the conversation: who the visitor is
    (name / how to address / language) plus their lead details. Any field the
    visitor hasn't stated stays None (title "name" = they want to be called by
    their name only)."""

    name: str | None = None
    title: str | None = None  # "Sir" / "Ms" / "name" (name-only) / None
    language: str | None = None  # "en" / "id" / None
    need: str | None = None
    contact: str | None = None
    notes: str | None = None

    @property
    def lead(self) -> LeadInfo:
        return LeadInfo(need=self.need, contact=self.contact, notes=self.notes)
