"""SplitterPort adapter — RecursiveCharacterTextSplitter."""

from __future__ import annotations

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.domain.entities import Chunk, Document
from app.domain.ports import SplitterPort


class LcSplitter(SplitterPort):
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 120) -> None:
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )

    def split(self, docs: list[Document]) -> list[Chunk]:
        chunks: list[Chunk] = []
        for doc in docs:
            for index, piece in enumerate(self._splitter.split_text(doc.content)):
                metadata = dict(doc.metadata)
                metadata["chunk"] = str(index)
                chunks.append(Chunk(text=piece, metadata=metadata))
        return chunks
