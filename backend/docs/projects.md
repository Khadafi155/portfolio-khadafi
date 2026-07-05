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
