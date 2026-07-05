"""LoaderPort adapter — reads PDFs / text files from disk via LangChain loaders."""

from __future__ import annotations

from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader, TextLoader

from app.domain.entities import Document
from app.domain.ports import LoaderPort


class FileLoader(LoaderPort):
    SUPPORTED = {".pdf", ".txt", ".md"}

    def load(self, path: str) -> list[Document]:
        target = Path(path)
        if target.is_file():
            files = [target]
        else:
            files = sorted(
                f
                for f in target.rglob("*")
                if f.is_file() and f.suffix.lower() in self.SUPPORTED
            )

        documents: list[Document] = []
        for file in files:
            if file.suffix.lower() == ".pdf":
                pages = PyPDFLoader(str(file)).load()
            else:
                pages = TextLoader(str(file), encoding="utf-8").load()
            for page in pages:
                documents.append(
                    Document(content=page.page_content, metadata={"source": file.name})
                )
        return documents
