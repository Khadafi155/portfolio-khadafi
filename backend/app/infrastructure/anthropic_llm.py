"""LLMPort adapter — streaming chat completion via Claude (langchain-anthropic).

Prompt caching is EXPLICIT with Claude. We set two cache breakpoints:
  1. the stable system prompt, and
  2. the last prior conversation turn,
so across turns of the same session the whole system+history prefix is read from
cache and only the new turn is billed at full price. The changing context +
question go in the FINAL user message (after the breakpoints) and stay uncached.
"""

from __future__ import annotations

from collections.abc import AsyncIterator, Sequence

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage

from app.domain.ports import LLMPort, Turn


class AnthropicLLM(LLMPort):
    def __init__(
        self,
        model: str,
        api_key: str,
        max_tokens: int = 600,
    ) -> None:
        # Note: newer Claude models (e.g. Sonnet 5) deprecate `temperature`, so we
        # don't send it — the model's default sampling is used.
        self._llm = ChatAnthropic(
            model=model,
            api_key=api_key,
            max_tokens=max_tokens,
            streaming=True,
        )

    async def stream_answer(
        self,
        system: str,
        context: str,
        question: str,
        history: Sequence[Turn],
    ) -> AsyncIterator[str]:
        # Breakpoint 1: the (stable) system prompt.
        messages: list[BaseMessage] = [
            SystemMessage(
                content=[
                    {
                        "type": "text",
                        "text": system,
                        "cache_control": {"type": "ephemeral"},
                    }
                ]
            )
        ]
        hist = list(history)
        for i, (role, content) in enumerate(hist):
            # Breakpoint 2: mark the LAST prior turn cacheable, so system + history
            # is reused next turn (history is otherwise re-billed in full every time).
            if i == len(hist) - 1:
                payload: object = [
                    {
                        "type": "text",
                        "text": content,
                        "cache_control": {"type": "ephemeral"},
                    }
                ]
            else:
                payload = content
            messages.append(
                HumanMessage(content=payload)
                if role == "user"
                else AIMessage(content=payload)
            )
        # Volatile context + question go last, after both cache breakpoints.
        messages.append(
            HumanMessage(content=f"CONTEXT:\n{context}\n\nQUESTION: {question}")
        )

        async for chunk in self._llm.astream(messages):
            text = chunk.content
            if isinstance(text, str) and text:
                yield text
            elif isinstance(text, list):
                # Anthropic may stream content blocks; keep only text deltas.
                for block in text:
                    if isinstance(block, dict) and block.get("type") == "text":
                        piece = block.get("text", "")
                        if piece:
                            yield piece
