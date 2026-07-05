"""Composition root — wire concrete adapters into the use cases.

This is the ONLY place that knows which concrete implementations exist. Swapping
OpenAI for another provider, or pgvector for another store, means editing here
(and adding one adapter) — domain and application stay untouched.
"""

from __future__ import annotations

from functools import lru_cache

from app.application.answer_question import AnswerQuestionUseCase
from app.application.chat_session import ChatSessionUseCase
from app.application.ingest_documents import IngestDocumentsUseCase
from app.core.config import Settings, get_settings
from app.domain.ports import (
    ConversationStorePort,
    LeadExtractorPort,
    LeadStorePort,
    LLMPort,
    RateLimiterPort,
    SessionStorePort,
)
from app.infrastructure.anthropic_lead_extractor import AnthropicLeadExtractor
from app.infrastructure.anthropic_llm import AnthropicLLM
from app.infrastructure.file_loader import FileLoader
from app.infrastructure.lc_splitter import LcSplitter
from app.infrastructure.openai_embedder import OpenAIEmbedder
from app.infrastructure.openai_llm import OpenAILLM
from app.infrastructure.pg_conversation_store import PgConversationStore
from app.infrastructure.pgvector_store import PgVectorStore
from app.infrastructure.upstash_rate_limiter import (
    NoOpRateLimiter,
    UpstashRateLimiter,
)


def build_embedder(settings: Settings) -> OpenAIEmbedder:
    return OpenAIEmbedder(
        model=settings.openai_embedding_model, api_key=settings.openai_api_key
    )


def build_store(settings: Settings, embedder: OpenAIEmbedder) -> PgVectorStore:
    return PgVectorStore(
        connection=settings.database_url,
        collection_name=settings.collection_name,
        embeddings=embedder.lc_embeddings,
    )


def build_llm(settings: Settings) -> LLMPort:
    """Pick the chat model provider. Swapping providers is a one-line config
    change (LLM_PROVIDER) — domain and application never change."""
    if settings.llm_provider.lower() == "openai":
        return OpenAILLM(
            model=settings.openai_chat_model,
            api_key=settings.openai_api_key,
            max_tokens=settings.max_output_tokens,
        )
    return AnthropicLLM(
        model=settings.anthropic_chat_model,
        api_key=settings.anthropic_api_key,
        max_tokens=settings.max_output_tokens,
    )


def build_ingest_use_case(settings: Settings | None = None) -> IngestDocumentsUseCase:
    settings = settings or get_settings()
    embedder = build_embedder(settings)
    return IngestDocumentsUseCase(
        loader=FileLoader(),
        splitter=LcSplitter(),
        embedder=embedder,
        store=build_store(settings, embedder),
    )


@lru_cache
def get_answer_use_case() -> AnswerQuestionUseCase:
    settings = get_settings()
    embedder = build_embedder(settings)
    return AnswerQuestionUseCase(
        embedder=embedder,
        store=build_store(settings, embedder),
        llm=build_llm(settings),
        k=settings.retrieval_k,
    )


@lru_cache
def get_store() -> PgConversationStore:
    """Single Postgres store instance (conversations + session names)."""
    return PgConversationStore(connection=get_settings().database_url)


def get_conversation_store() -> ConversationStorePort:
    return get_store()


def get_session_store() -> SessionStorePort:
    return get_store()


def get_lead_store() -> LeadStorePort:
    return get_store()


@lru_cache
def get_lead_extractor() -> LeadExtractorPort | None:
    settings = get_settings()
    if not (settings.enable_lead_capture and settings.anthropic_api_key):
        return None
    return AnthropicLeadExtractor(
        model=settings.lead_model, api_key=settings.anthropic_api_key
    )


@lru_cache
def get_intake_llm() -> LLMPort | None:
    """A fast, cheap model for the (retrieval-free) onboarding conversation."""
    settings = get_settings()
    if not settings.anthropic_api_key:
        return None
    return AnthropicLLM(
        model=settings.lead_model,
        api_key=settings.anthropic_api_key,
        max_tokens=settings.max_output_tokens,
    )


@lru_cache
def get_rate_limiter() -> RateLimiterPort:
    settings = get_settings()
    if settings.upstash_redis_rest_url and settings.upstash_redis_rest_token:
        return UpstashRateLimiter(
            url=settings.upstash_redis_rest_url,
            token=settings.upstash_redis_rest_token,
            max_requests=settings.rate_limit_requests,
            window_seconds=settings.rate_limit_window_seconds,
        )
    return NoOpRateLimiter()


@lru_cache
def get_chat_session_use_case() -> ChatSessionUseCase:
    settings = get_settings()
    return ChatSessionUseCase(
        answer=get_answer_use_case(),
        sessions=get_session_store(),
        store=get_conversation_store(),
        history_limit=settings.conversation_history_limit,
        lead_extractor=get_lead_extractor(),
        lead_store=get_lead_store(),
        intake_llm=get_intake_llm(),
    )
