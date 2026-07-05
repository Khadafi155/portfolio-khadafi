# CLAUDE.md — AI Portfolio + Document Chatbot (MVP, Clean Architecture)

Build brief for Claude Code. Follow the phases in order. **Finish and verify each phase before the next.** Two non-negotiables: keep scope to the **MVP** defined in §2, and respect the **Clean Architecture dependency rule** in §4.

---

## 1. Project Overview

A personal portfolio website with an embedded AI chatbot that answers questions grounded in the owner's documents (CV, projects) using RAG. Documents are embedded into a vector store; at query time the most relevant chunks are retrieved and passed to an LLM to produce a grounded answer **with source citations**. The chatbot is itself living proof of the owner's RAG/LLM skills.

**Owner: Muh. Khadafi Kasim** — AI & Automation Engineer and Fullstack Developer, based in Makassar, Indonesia. 5 years building digital products remotely for edutech, multinational fintech, and a global mental-health company (US & Hong Kong clients). Expertise: AI & Automation, LLM integration, RAG, embeddings & semantic search, vector databases, n8n, and end-to-end web apps (frontend + backend). "Most Outstanding Student" of his faculty (1 of 3,988) with 50+ national & international awards.

**Persona/voice:** an engineer who ships. Technical, concise, show-don't-tell. The site must NOT use any fashion/COO/"operator" framing — this is a software engineer's portfolio.

---

## 2. MVP Scope

**IN (build this, nothing more):**
- One portfolio page with these sections: hero, about, featured projects, skills/stack, experience timeline, contact.
- A working document chatbot widget: ask a question → grounded streamed answer + sources.
- Ingestion script to load documents into the vector store.
- Runs locally end-to-end, then a basic deploy.

**OUT (post-MVP — do NOT build now, just leave room for it):**
- Framer Motion / heavy animations.
- Vercel AI SDK (MVP uses plain `fetch` + SSE).
- Multiple pages, blog, CMS, auth, analytics.
- Conversation history persistence (history is passed per-request only).
- Reranking, hybrid search, agentic/LangGraph flows.

> When in doubt, choose the smaller option. Ship the loop working first.

---

## 3. Tech Stack (locked)

**Frontend:** Next.js 16 (App Router, TS, React 19) + Tailwind CSS + shadcn/ui
**Backend:** FastAPI + Uvicorn + Pydantic / pydantic-settings (Python 3.12)
**AI/RAG:** LangChain v1 (LCEL) + `langchain-openai` (chat + embeddings) + `langchain-postgres` (pgvector) — **all confined to the infrastructure layer**
**Data:** Supabase (Postgres + pgvector)
**Deploy:** Frontend → Vercel; Backend → Hostinger VPS (Docker + Caddy, alongside n8n); DB → Supabase cloud
**AI provider:** OpenAI only — one key for chat (cheap mini/nano model) + `text-embedding-3-small` embeddings.

---

## 4. Clean Architecture — THE core rule

Backend is split into 4 layers. **Dependencies only ever point inward.** An inner layer must NEVER import from an outer layer.

```
        interface  →  infrastructure
             ↘            ↙
             application
                 ↓
              domain        (innermost, depends on nothing)
```

- **domain** — pure business entities + abstract **ports** (interfaces). No framework imports. No langchain, no fastapi, no openai.
- **application** — use cases that orchestrate the flow, depending ONLY on domain ports (abstractions), never on concrete tools.
- **infrastructure** — adapters that implement the ports using real tools (LangChain, OpenAI, pgvector, file loaders). **This is the ONLY place langchain/openai/psycopg may be imported.**
- **interface** — FastAPI controllers, Pydantic DTOs, and the composition root (`dependencies.py`) that wires concrete adapters into use cases.

**Payoff:** swapping OpenAI for Gemini/Ollama, or pgvector for another store, means writing one new adapter in `infrastructure/` — zero changes to `domain/` or `application/`.

---

## 5. Repository Structure (monorepo)

```
portfolio-ai/
├── backend/
│   ├── app/
│   │   ├── domain/
│   │   │   ├── entities.py        # Document, Chunk, RetrievedChunk, Source, Answer
│   │   │   └── ports.py           # LoaderPort, SplitterPort, EmbedderPort,
│   │   │                          #   VectorStorePort, LLMPort  (abstract)
│   │   ├── application/
│   │   │   ├── ingest_documents.py # IngestDocumentsUseCase(loader,splitter,embedder,store)
│   │   │   └── answer_question.py  # AnswerQuestionUseCase(embedder,store,llm)
│   │   ├── infrastructure/
│   │   │   ├── file_loader.py       # implements LoaderPort (PyPDFLoader/TextLoader)
│   │   │   ├── lc_splitter.py       # implements SplitterPort (RecursiveCharacterTextSplitter)
│   │   │   ├── openai_embedder.py   # implements EmbedderPort
│   │   │   ├── openai_llm.py        # implements LLMPort (streaming)
│   │   │   └── pgvector_store.py    # implements VectorStorePort (langchain-postgres)
│   │   ├── interface/
│   │   │   ├── api/
│   │   │   │   ├── chat_router.py   # POST /chat (SSE) -> AnswerQuestionUseCase
│   │   │   │   └── dto.py           # Pydantic ChatRequest / event payloads
│   │   │   ├── dependencies.py      # composition root: build adapters + use cases
│   │   │   └── main.py              # FastAPI app, CORS, health, mount routers
│   │   └── core/
│   │       └── config.py            # pydantic-settings from env
│   ├── scripts/
│   │   └── ingest.py                # CLI -> builds adapters -> IngestDocumentsUseCase
│   ├── docs/                        # source documents (start with dummy)
│   ├── tests/                       # unit tests for use cases (with fake ports)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # portfolio sections
│   │   └── components/Chat.tsx      # chat widget, consumes SSE
│   ├── lib/chatClient.ts            # data layer: talks to backend, isolated from UI
│   ├── package.json
│   └── .env.local.example
├── Caddyfile
└── README.md
```

Frontend stays light (MVP): a thin data layer (`lib/chatClient.ts`) separated from view components. No full Clean Architecture on the frontend — that would be over-engineering for the MVP.

---

## 6. Ports & Use Cases (the contracts)

Define ports as abstract base classes / `typing.Protocol` in `domain/ports.py`:

- `LoaderPort.load(path) -> list[Document]`
- `SplitterPort.split(docs) -> list[Chunk]`
- `EmbedderPort.embed_documents(texts) -> list[Vector]` / `embed_query(text) -> Vector`
- `VectorStorePort.add(chunks) -> None` / `search(query_vector, k) -> list[RetrievedChunk]`
- `LLMPort.stream_answer(system, context, question, history) -> AsyncIterator[str]`

Use cases depend only on these:

- `IngestDocumentsUseCase(loader, splitter, embedder, store).run(docs_dir)`
- `AnswerQuestionUseCase(embedder, store, llm).run(question, history) -> stream tokens + final Source list`

`AnswerQuestionUseCase` enforces the grounding rule via the system prompt: answer ONLY from retrieved context; if not covered, say so; always report which documents the answer drew from.

---

## 7. Environment Variables

**backend/.env.example**
```
OPENAI_API_KEY=sk-...
OPENAI_CHAT_MODEL=gpt-4o-mini        # use the current cheapest capable mini/nano model
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
DATABASE_URL=postgresql://...        # Supabase Postgres connection string
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
RETRIEVAL_K=4
MAX_OUTPUT_TOKENS=600
```

**frontend/.env.local.example**
```
NEXT_PUBLIC_API_URL=http://localhost:8000   # prod: https://api.yourdomain.com
```

---

## 8. Dependencies

**backend/requirements.txt**
```
fastapi
uvicorn[standard]
pydantic
pydantic-settings
python-dotenv
sse-starlette
langchain
langchain-core
langchain-openai
langchain-postgres
langchain-community
pypdf
psycopg[binary]
pytest
```

**frontend:** `next react react-dom tailwindcss lucide-react` (+ shadcn/ui via CLI).

---

## 9. Build Phases

> **Build order: FRONTEND FIRST, then backend.** Phases 1 & 2 (domain + use cases with fake-adapter tests) are already DONE — do not redo them. The chat UI is built against a mock client first, then wired to the real backend in Phase 6.

### Phase 1 — Domain + ports (no frameworks) — ✅ DONE
`domain/entities.py` + `domain/ports.py`, pure Python, no framework imports.

### Phase 2 — Use cases + tests with fakes — ✅ DONE
Both use cases in `application/` depend only on ports; `pytest` passes with fake adapters, zero real API/DB calls.

### Phase 3 — Frontend (MVP) with MOCK chat client
`create-next-app` (Next.js 16, TS, Tailwind) + shadcn/ui. Build the full portfolio page for **Khadafi (see §12 for all content)** with sections: hero, about, featured projects, skills/stack, experience timeline, contact — plus the `Chat.tsx` widget. All chat calls go through `lib/chatClient.ts` — for now make this a **MOCK** that returns a hardcoded streamed answer plus 1–2 fake sources, so the UI is fully interactive without a backend. The mock must expose the **same interface** the real SSE client will use later, so only the inside of `chatClient.ts` changes in Phase 6. Visual direction: dark, clean, engineer-premium — mono accents for tags/code/numbers. Stay within MVP scope (§2) — no Framer Motion, no Vercel AI SDK. **Verify:** `npm run dev`, the portfolio renders with the correct persona (Khadafi, NOT any COO/operator framing), and asking a question shows a streamed fake answer with sources.

### Phase 4 — Infrastructure adapters
Implement the real adapters in `infrastructure/` (OpenAI embedder/LLM, pgvector store, file loader, splitter). LangChain/OpenAI imports allowed **only here**. Enable pgvector in Supabase first: `create extension if not exists vector;`. **Verify:** a small script embeds a string and writes/reads one row in Supabase.

### Phase 5 — Ingestion + API
Add 2–3 **dummy documents** to `docs/`; wire `scripts/ingest.py` (real adapters + `IngestDocumentsUseCase`) and confirm the vector table is populated. Then `interface/dependencies.py` wires adapters into the use cases; `chat_router.py` exposes `POST /chat` streaming via SSE (Pydantic DTOs), plus `GET /health` and CORS. **Verify:** `curl -N -X POST localhost:8000/chat -d '{"message":"..."}'` streams a grounded answer + sources.

### Phase 6 — Wire frontend to real backend
Replace the mock inside `lib/chatClient.ts` with the real SSE client pointing at `NEXT_PUBLIC_API_URL`. UI components stay untouched. **Verify:** asking a question in the UI returns a real, streamed, grounded answer with citations from the documents.

### Phase 7 — Deploy
Containerize backend (Dockerfile) → run on Hostinger VPS → expose via Caddy at `api.yourdomain.com` (auto-SSL), alongside n8n. Deploy frontend to Vercel; set `NEXT_PUBLIC_API_URL`; add the Vercel domain to `ALLOWED_ORIGINS`.

---

## 10. Deploy References

**Dockerfile**
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.interface.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Caddyfile**
```
api.yourdomain.com {
    reverse_proxy localhost:8000
}
```

---

## 11. Conventions

- Enforce the dependency rule (§4) in every file. If a use case needs langchain, the design is wrong — add a port instead.
- No invented answers; stay grounded in documents and admit gaps.
- Keep costs low: cheap chat model, `MAX_OUTPUT_TOKENS` cap, `RETRIEVAL_K=4`.
- Type hints everywhere (backend) and TypeScript (frontend).
- Citations are a required feature.
- Commit after each verified phase. Don't expand beyond MVP scope (§2).

---

## 12. Site Content (source of truth for all frontend copy)

Use this content. Do not invent a different persona. Numbers and shipped products over adjectives.

**Identity**
- Name: Muh. Khadafi Kasim
- Role: AI & Automation Engineer · Fullstack Developer
- Location: Makassar, Indonesia (works remotely; US & Hong Kong clients)
- Contact: khadaficonnect@gmail.com · phone 081340643550 · LinkedIn · GitHub

**Hero**
- Headline: name + role.
- Subline: builds AI agents, automation, and end-to-end web apps — LLM integration, RAG, embeddings, vector search.
- Primary CTA is the live chat input: "Ask my AI anything about my work."
- Secondary CTA: "See projects."

**Proof bar (mono tags, no adjectives)**
5 yrs experience · 50+ national & international awards · Microsoft-funded project · Remote (US & HK) · Most Outstanding Student (1 of 3,988)

**About**
A developer specializing in AI & Automation, fullstack web apps, and digital products. 5 years across an edutech startup, a multinational fintech, and a global mental-health company. Academically decorated; ships production products end to end.

**Featured projects** (lead with HOOR)
1. **HOOR — Privacy-first AI Agent** (Microsoft-funded). Anonymous, trauma-informed support for women via chat. Stack: GPT-4 + prompt engineering + RAG, Node.js/Express, Vanilla JS, Azure App Service, Azure Vector Search, Azure Blob Storage, MySQL.
2. **Dimple Bindra — Digital Product Platform** (US & HK users). WordPress/Elementor, PHP, JS, integrated with CRM (GoHighLevel), n8n, Stripe via webhooks. Free + 8 paid programs.
3. **Why-You-Betrayal Quiz** — interactive archetype quiz. Node/Express, MySQL, Azure, CRM + n8n via webhook.
4. **Science Hunter Indonesia** — first Indonesian platform for scientific education/research. Led the website division; digitized 56 MOOCs, 200 modules, 300 videos. B2C GMV ~IDR 600M+, 5,865 orders, 9,112 items sold. WordPress, PHP, JS, Midtrans.
5. **Daishil** — villa rental & booking platform. Golang, Echo, Gorm, JWT, MySQL, Xendit, GCP, Docker, CI/CD.
6. **Smart Laundry** — ML + cloud + mobile. PHP/Laravel, OAuth, MySQL, GCP.

**Skills (grouped, render as mono tags)**
- AI & Automation: LLM integration (Azure OpenAI/Foundry, GPT-4), RAG, embeddings & semantic search, vector DB (Azure Vector Search), prompt engineering, n8n, CRM (GoHighLevel)
- Languages: Python, Go, Node.js, PHP, Java, JavaScript, C/C++, Assembly, Matlab
- Frameworks: Express, Hapi, Laravel, Echo, Gorm
- Cloud & DevOps: Microsoft Azure, GCP, Docker, CI/CD, Git/GitHub
- Data: MySQL, PL/SQL, Oracle, REST APIs, Payment Gateways

**Experience timeline**
- Digital Product Specialist & Technology Operations Assistant — Dimple Bindra Ltd (Remote), Jul 2025–Now
- Associate Implementation Consultant — OpenWay, Oct 2023–Oct 2024 (WAY4, Groovy, PL/SQL)
- Manager of Digital Product (Website) — Science Hunter Indonesia, Mar 2021–Mar 2023

**Education**
University of Brawijaya — Instrumentation, 2018–2023. GPA 3.18. 1st Most Outstanding Student of Faculty (MIPA) 2021; multiple international innovation gold medals.

**Mock chat answers (Phase 3):** make the hardcoded answers about Khadafi's work (e.g. "What's HOOR?", "What AI experience does he have?") with fake sources like "CV.pdf" and "projects.md".
