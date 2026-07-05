"""CLI: ingest documents from a directory into the vector store.

    python -m scripts.ingest            # ingests ./docs
    python -m scripts.ingest ../mydocs  # ingests a custom dir

Requires OPENAI_API_KEY and DATABASE_URL in the environment / .env, and pgvector
enabled in the DB: `create extension if not exists vector;`
"""

from __future__ import annotations

import sys
from pathlib import Path

from app.interface.dependencies import build_ingest_use_case


def main() -> None:
    docs_dir = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).parent.parent / "docs")
    print(f"Ingesting documents from: {docs_dir}")

    use_case = build_ingest_use_case()
    result = use_case.run(docs_dir)

    print(
        f"Done - {result.documents} document(s) -> {result.chunks} chunk(s) stored."
    )


if __name__ == "__main__":
    main()
