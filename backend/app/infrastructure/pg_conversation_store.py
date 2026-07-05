"""ConversationStorePort + SessionStorePort adapter, backed by Postgres (Supabase).

Relational schema:
    users          (id PK, name, ...)          <- one row per visitor/session
    conversations  (id PK, user_id FK -> users, role, content, ...)

A conversation row always references a real user; deleting a user cascades to
their messages. Swapping to Redis later means one new adapter; domain and
application don't change.
"""

from __future__ import annotations

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection, Engine

from app.domain.entities import LeadInfo
from app.domain.ports import (
    ConversationStorePort,
    LeadStorePort,
    SessionStorePort,
    Turn,
)

_CREATE_USERS = text(
    """
    CREATE TABLE IF NOT EXISTS users (
        id          TEXT PRIMARY KEY,
        name        TEXT,
        title       TEXT,
        language    TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    """
)
# Add newer columns to pre-existing users tables (idempotent).
_ALTER_USERS_TITLE = text("ALTER TABLE users ADD COLUMN IF NOT EXISTS title TEXT")
_ALTER_USERS_LANGUAGE = text(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT"
)
_CREATE_CONVERSATIONS = text(
    """
    CREATE TABLE IF NOT EXISTS conversations (
        id          BIGSERIAL PRIMARY KEY,
        user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        role        TEXT NOT NULL,
        content     TEXT NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    """
)
_CREATE_INDEX = text(
    "CREATE INDEX IF NOT EXISTS conversations_user_idx "
    "ON conversations (user_id, id);"
)
_CREATE_LEADS = text(
    """
    CREATE TABLE IF NOT EXISTS leads (
        id          BIGSERIAL PRIMARY KEY,
        user_id     TEXT NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
        need        TEXT,
        contact     TEXT,
        notes       TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    """
)
# `timeline` was dropped from the intake flow; remove it from pre-existing tables.
_DROP_LEADS_TIMELINE = text("ALTER TABLE leads DROP COLUMN IF EXISTS timeline")
_ENSURE_USER = text(
    "INSERT INTO users (id) VALUES (:sid) ON CONFLICT (id) DO NOTHING"
)


class PgConversationStore(ConversationStorePort, SessionStorePort, LeadStorePort):
    """Postgres store for conversation turns, visitor (user) info, and leads."""

    def __init__(self, connection: str) -> None:
        # pool_pre_ping revives stale connections (Supabase's pooler drops idle
        # ones); pool_recycle retires them before the server times them out.
        self._engine: Engine = create_engine(
            connection, pool_pre_ping=True, pool_recycle=300
        )
        with self._engine.begin() as conn:
            conn.execute(_CREATE_USERS)  # parent first (FK target)
            conn.execute(_ALTER_USERS_TITLE)
            conn.execute(_ALTER_USERS_LANGUAGE)
            conn.execute(_CREATE_CONVERSATIONS)
            conn.execute(_CREATE_INDEX)
            conn.execute(_CREATE_LEADS)
            conn.execute(_DROP_LEADS_TIMELINE)

    @staticmethod
    def _ensure_user(conn: Connection, session_id: str) -> None:
        conn.execute(_ENSURE_USER, {"sid": session_id})

    # --- ConversationStorePort -------------------------------------------
    def load(self, session_id: str, limit: int) -> list[Turn]:
        sql = text(
            """
            SELECT role, content FROM (
                SELECT id, role, content FROM conversations
                WHERE user_id = :sid
                ORDER BY id DESC
                LIMIT :lim
            ) recent
            ORDER BY id ASC
            """
        )
        with self._engine.connect() as conn:
            rows = conn.execute(sql, {"sid": session_id, "lim": limit}).all()
        return [(row.role, row.content) for row in rows]

    def append(self, session_id: str, role: str, content: str) -> None:
        with self._engine.begin() as conn:
            self._ensure_user(conn, session_id)  # keep the FK satisfied
            conn.execute(
                text(
                    "INSERT INTO conversations (user_id, role, content) "
                    "VALUES (:sid, :role, :content)"
                ),
                {"sid": session_id, "role": role, "content": content},
            )

    def delete(self, session_id: str) -> None:
        # Clears the chat history but keeps the user (and their name).
        with self._engine.begin() as conn:
            conn.execute(
                text("DELETE FROM conversations WHERE user_id = :sid"),
                {"sid": session_id},
            )

    # --- SessionStorePort (visitor name + title + language) --------------
    def set_name(
        self,
        session_id: str,
        name: str,
        title: str | None = None,
        language: str | None = None,
    ) -> None:
        # COALESCE keeps a previously-saved title/language when this call omits it
        # (each registration step saves only the field it just captured).
        sql = text(
            """
            INSERT INTO users (id, name, title, language)
            VALUES (:sid, :name, :title, :language)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                title = COALESCE(EXCLUDED.title, users.title),
                language = COALESCE(EXCLUDED.language, users.language),
                updated_at = now()
            """
        )
        with self._engine.begin() as conn:
            conn.execute(
                sql,
                {
                    "sid": session_id,
                    "name": name,
                    "title": title,
                    "language": language,
                },
            )

    def update_profile(
        self,
        session_id: str,
        name: str | None = None,
        title: str | None = None,
        language: str | None = None,
    ) -> None:
        # Same COALESCE upsert as set_name, but name is optional too (the AI intake
        # may learn title/language before or without a name).
        sql = text(
            """
            INSERT INTO users (id, name, title, language)
            VALUES (:sid, :name, :title, :language)
            ON CONFLICT (id) DO UPDATE SET
                name = COALESCE(EXCLUDED.name, users.name),
                title = COALESCE(EXCLUDED.title, users.title),
                language = COALESCE(EXCLUDED.language, users.language),
                updated_at = now()
            """
        )
        with self._engine.begin() as conn:
            conn.execute(
                sql,
                {
                    "sid": session_id,
                    "name": name,
                    "title": title,
                    "language": language,
                },
            )

    def get_name(self, session_id: str) -> str | None:
        with self._engine.connect() as conn:
            return conn.execute(
                text("SELECT name FROM users WHERE id = :sid"),
                {"sid": session_id},
            ).scalar()

    def get_title(self, session_id: str) -> str | None:
        with self._engine.connect() as conn:
            return conn.execute(
                text("SELECT title FROM users WHERE id = :sid"),
                {"sid": session_id},
            ).scalar()

    def get_language(self, session_id: str) -> str | None:
        with self._engine.connect() as conn:
            return conn.execute(
                text("SELECT language FROM users WHERE id = :sid"),
                {"sid": session_id},
            ).scalar()

    def clear(self, session_id: str) -> None:
        # Deleting the user cascades to their conversations + lead (full reset).
        with self._engine.begin() as conn:
            conn.execute(
                text("DELETE FROM users WHERE id = :sid"),
                {"sid": session_id},
            )

    # --- LeadStorePort ---------------------------------------------------
    def upsert(self, user_id: str, lead: LeadInfo) -> None:
        # Accumulate: only overwrite a field when the new value is non-null.
        sql = text(
            """
            INSERT INTO leads (user_id, need, contact, notes)
            VALUES (:uid, :need, :contact, :notes)
            ON CONFLICT (user_id) DO UPDATE SET
                need     = COALESCE(EXCLUDED.need, leads.need),
                contact  = COALESCE(EXCLUDED.contact, leads.contact),
                notes    = COALESCE(EXCLUDED.notes, leads.notes),
                updated_at = now()
            """
        )
        with self._engine.begin() as conn:
            self._ensure_user(conn, user_id)  # FK safety
            conn.execute(
                sql,
                {
                    "uid": user_id,
                    "need": lead.need,
                    "contact": lead.contact,
                    "notes": lead.notes,
                },
            )

    def get(self, user_id: str) -> LeadInfo:
        with self._engine.connect() as conn:
            row = conn.execute(
                text("SELECT need, contact, notes FROM leads WHERE user_id = :uid"),
                {"uid": user_id},
            ).one_or_none()
        if row is None:
            return LeadInfo()
        return LeadInfo(need=row.need, contact=row.contact, notes=row.notes)
