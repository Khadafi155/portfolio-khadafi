"""RateLimiterPort adapters — Upstash Redis (serverless) or a no-op fallback.

Used to stop bots from spamming /chat (each call costs an LLM request). The
no-op limiter lets the app run locally without Upstash configured.
"""

from __future__ import annotations

from upstash_ratelimit import FixedWindow, Ratelimit
from upstash_redis import Redis

from app.domain.ports import RateLimiterPort


class NoOpRateLimiter(RateLimiterPort):
    """Allows everything — used when Upstash isn't configured (e.g. local dev)."""

    def allow(self, key: str) -> bool:
        return True


class UpstashRateLimiter(RateLimiterPort):
    def __init__(
        self, url: str, token: str, max_requests: int, window_seconds: int
    ) -> None:
        self._ratelimit = Ratelimit(
            redis=Redis(url=url, token=token),
            limiter=FixedWindow(max_requests=max_requests, window=window_seconds),
        )

    def allow(self, key: str) -> bool:
        try:
            return bool(self._ratelimit.limit(key).allowed)
        except Exception:
            # Fail open: if Upstash is unreachable, don't lock real users out.
            return True
