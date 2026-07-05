"""LLMPort adapter — streaming chat completion via langchain-openai.

The stable system prompt is placed first so OpenAI's automatic prompt caching can
reuse it; the changing context + question go in the final user message.
"""

from __future__ import annotations

from collections.abc import AsyncIterator, Sequence

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.domain.ports import LLMPort, Turn


class OpenAILLM(LLMPort):
    def __init__(
        self,
        model: str,
        api_key: str,
        max_tokens: int = 600,
        temperature: float = 0.6,
    ) -> None:
        # temperature ~0.6 keeps replies human and varied, not robotic.
        self._llm = ChatOpenAI(
            model=model,
            api_key=api_key,
            max_tokens=max_tokens,
            temperature=temperature,
            streaming=True,
        )

    async def stream_answer(
        self,
        system: str,
        context: str,
        question: str,
        history: Sequence[Turn],
    ) -> AsyncIterator[str]:
        messages: list[BaseMessage] = [SystemMessage(content=system)]
        for role, content in history:
            messages.append(
                HumanMessage(content=content)
                if role == "user"
                else AIMessage(content=content)
            )
        messages.append(
            HumanMessage(content=f"CONTEXT:\n{context}\n\nQUESTION: {question}")
        )

        async for chunk in self._llm.astream(messages):
            text = chunk.content
            if isinstance(text, str) and text:
                yield text
