"""Application settings, loaded from environment / .env via pydantic-settings."""

from __future__ import annotations

import re
from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_SAFE_IDENTIFIER = re.compile(r"^[A-Za-z0-9_]+$")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # Which provider generates the chat answer: "anthropic" (Claude) or "openai".
    # Embeddings always use OpenAI (Anthropic has no embeddings API).
    llm_provider: str = "anthropic"

    # OpenAI (embeddings always; chat only if llm_provider == "openai")
    openai_api_key: str = ""
    openai_chat_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"

    # Anthropic (chat when llm_provider == "anthropic")
    anthropic_api_key: str = ""
    anthropic_chat_model: str = "claude-haiku-4-5-20251001"

    # Lead capture: extract hiring/project details with a cheap model (Haiku).
    enable_lead_capture: bool = True
    lead_model: str = "claude-haiku-4-5-20251001"

    # Supabase / Postgres (pgvector)
    database_url: str = ""
    collection_name: str = "khadafi_docs"

    # CORS — comma-separated list of allowed origins
    allowed_origins: str = "http://localhost:3000"

    # RAG knobs
    retrieval_k: int = 4
    max_output_tokens: int = 600

    # Server-side conversation memory: how many prior turns to load per session.
    conversation_history_limit: int = 20

    # Rate limiting (Upstash Redis) — anti-spam for /chat. If URL/token are empty,
    # rate limiting is disabled (no-op).
    upstash_redis_rest_url: str = ""
    upstash_redis_rest_token: str = ""
    rate_limit_requests: int = 20
    rate_limit_window_seconds: int = 60

    @field_validator("collection_name")
    @classmethod
    def _safe_collection_name(cls, value: str) -> str:
        # Defence-in-depth: the collection name reaches the DB layer, so keep it a
        # plain identifier (letters, digits, underscore) — never anything exotic.
        if not _SAFE_IDENTIFIER.match(value):
            raise ValueError(
                "COLLECTION_NAME must contain only letters, digits, and underscores"
            )
        return value

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
