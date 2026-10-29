# Projects — Muh. Khadafi Kasim

## 80/20 Engine — Business Diagnostic AI Agent
A business diagnostic AI agent that analyzes 7 dimensions of a DTC brand
($3M–$50M) to identify the 20% of factors driving 80% of profit. Frontend:
Next.JS, React, TypeScript, Tailwind, Radix UI, Framer Motion, Lucide Icons.
Backend: Bun + Elysia.JS, Drizzle ORM, and Claude Sonnet 4.6 (prompt caching &
streaming SSE). Powered by Supabase (Auth, PostgreSQL with RLS, Storage), Redis,
Sentry, and PostHog. Integrated with CRM via webhook. Deployed on a VPS (Ubuntu)
with Docker, Nginx reverse proxy (auto-SSL), UFW firewall, GHCR, and CI/CD.
Live: 80/20 Engine.

## Copy Engine — Copywriting AI Agent
A copywriting AI agent that consults, delivers verdicts, and writes copy. It is
grounded in company context and a RAG-based expert knowledge base built from
proven copywriting books. Built with Next.JS, React, TypeScript, Tailwind,
FastAPI, and LangChain, with Claude Sonnet 4.6 (prompt caching + streaming),
OpenAI embeddings, and GPT-4o Vision. Powered by Supabase (Auth, PostgreSQL +
pgvector, Storage) and Redis. Deployed on a VPS (Ubuntu) with Docker, GitHub
Actions, GHCR, Traefik (auto-SSL), CI/CD, and Cloudflare. Live: Copy Engine.

## Marketing Engine — B2B Automation
An N8N orchestration (webhook + API) for connecting, lead generation, and
personalized outreach. Scrapes companies (Crunchbase, StoreLeads), enriches via
Clay, stores in Google Sheets, then uses the Claude API to personalize
email/LinkedIn outreach through GoHighLevel and HeyReach. Source: N8N Workflow.

## Content Engine — Social Media Automation
An N8N orchestration (webhook + API) for end-to-end video production. It analyzes
viral content, uses the Claude API to auto-generate prompts driving the video
tools (Sandcastles, Remotion, OpusClip, Higgsfield), and auto-schedules uploads
via OmniSocials. Source: N8N Workflow.

## Tarkan Salar Website
The Tarkan Salar website for a DTC/omnichannel consultancy ($3M–$50M+). Built with
Next.JS, React, TypeScript, and Tailwind. Integrated with GoHighLevel (CRM) and
the Stripe payment gateway. Deployed on Vercel. Live: tarkansalar.com.

## HOOR — Privacy-first AI Agent (Microsoft-funded)
HOOR is a project funded by Microsoft: a privacy-first AI agent that provides
anonymous, trauma-informed support for women through a chat-based experience.
Built with HTML, CSS, Vanilla JS, Node.JS, Express.JS, and an LLM (GPT-4.0) with
prompt engineering and RAG. Deployed on Azure App Service, Azure Vector Search,
Azure Blob Storage, and MySQL for secure user data. Live: HOOR.

## Dimple Bindra Website
A digital product platform for women. Built with WordPress (Elementor and
plugins), HTML, CSS, PHP, and JavaScript, integrated with a CRM, N8N, and the
Stripe payment gateway via webhooks. Live: dimplebindra.com.

## Science Hunter Indonesia Website
Science Hunter Indonesia (SHI) is the first platform for scientific education,
research, and academic writing in Indonesia. Built with WordPress (Elementor and
plugins), HTML, CSS, PHP, JavaScript, and the Midtrans payment gateway.
Live: sciencehunter.id.

## Smart Laundry Application
A platform connecting customers and laundry stores. Customers can scan to detect
materials and pay virtually. Developed across machine learning, cloud computing,
and mobile development. Cloud computing with PHP, Laravel, Laravel Passport OAuth,
MySQL, Nginx, Ubuntu, Google Cloud Platform (GCP), and Postman. Source: GitHub.

## Daishil Application
A platform for renting and booking villas. Users register as hosts or reservants,
post villas, make bookings, and process payments. Built with Golang, Echo, JWT
Auth, Gorm, MySQL, SwaggerHub, the Xendit payment gateway, Google Cloud Platform
(GCP), Docker, CI/CD, and Postman. Source: GitHub.

## WillScale Video Ads — AI Video Ads Automation
An AI video ads automation system Khadafi built at WillScale (AI Automation
Engineer, Jul 2026 – now, remote · Jakarta). WillScale is an AI video & image ads
agency for global DTC brands. The system serves 3 global brands: Vera's Copper,
Shiny Smile Veneers, and PawFence. Claude LLMs + MCP orchestrate Higgsfield,
HeyGen, Magnific, ByteDance, ElevenLabs, Freepik AI, Suno Music AI, and lip-sync
tools to mass-produce videos, images, and voiceovers in 3 styles: Movie
Cinematic, 3D Pixar Animation, and UGC Talking Head. Integrated with GitHub and
Notion. Problem solved: global DTC brands need 100+ fresh video ads every week
across several styles, and producing them by hand is slow, costly, and hard to
keep on-brand. Outcome: 100+ finished short-form video ads that pass agency QA
and ship to clients every week. Khadafi also writes and refines prompts for
consistent, on-brand visuals, uses Claude and other LLMs to speed up scripting,
asset sourcing, and batch production, and scouts and tests new generative AI
tools (adopt or drop). Brands: veralouisiana.com (Vera's Copper),
shoppawfence.com (PawFence), shinysmileveneers.com (Shiny Smile Veneers). Demo videos are on the portfolio
(khadafiai.my.id, Projects > WillScale Video Ads): Vera's Copper in 3 styles
(3D Pixar, Movie Cinematic, UGC Talking Head), plus a PawFence demo and a Shiny
Smile Veneers demo. Video links:
https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Copper%203D%20Animation%20Style.mp4
https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Copper%20Movie%20Cinematic%20Style.mp4.mp4
https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Copper%20UGC%20Talking%20Head%20Style.mp4
https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Pawfence%20Demo.mp4
https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/SSV%20Demo.mp4

## AIDA Office — Multi-Agent Virtual Office
AIDA Office is Khadafi's own multi-agent virtual office: 30+ AI agents running a
3D virtual office with a Kanban workflow, approvals, Telegram, and live chat.
AIDA Office is two companies run by one AI team in one villa: AIDA Upwork Office
finds Upwork jobs, drafts proposals and delivers client projects, while AIDA
Capital Office researches and tests DeFi strategies in dry-run mode (no live
trading).
Problem solved: running a one-person Upwork business means juggling job
hunting, proposals, delivery, finance, and IT, and a pile of AI agents is hard
to coordinate and impossible to see at a glance. Every staff member (CEO, PM,
copywriting, finance, IT, QA, ...) is a Hermes Agent profile running 24/7 on
Claude (Opus / Sonnet / Haiku), coordinated through a shared Kanban board and
Telegram. A Python Hermes plugin streams agent events to a Bun + Elysia server,
which drives a realtime 3D villa (Next.js, React Three Fiber, VRM) over
WebSocket; each character walks, works, and joins meetings based on what her
agent is actually doing. Includes chat and 1-on-1 meetings with any agent,
faster-whisper voice notes, and a Supabase pgvector knowledge base. Outcome: an
always-on AI team where every agent's work is visible live, with the owner
approving anything client-facing. Stack: Hermes Agent, Multi-Agent, Claude API,
Python, Bun, Elysia, TypeScript, Next.js, React, React Three Fiber, Three.js,
VRM, WebSocket, SQLite, Supabase, pgvector, faster-whisper, Telegram Bot API,
Notion API, Google Workspace API, Docker, VPS. Live demo (Visitor mode):
https://office.khadafiai.my.id. Demo video:
https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/AIDA%20Office-demo.mp4
