# Deploy — KK.AI portfolio

Two pieces: **backend** (FastAPI + RAG) on the Hostinger VPS behind the existing
Caddy, and **frontend** (Next.js) on Vercel. Supabase (pgvector) is already
provisioned and ingested.

Assumed subdomain for the API: `api.khadafiai.my.id` — change it everywhere
if you use a different one.

---

## 1. DNS (once)

Add an **A record** for the API subdomain pointing at the VPS's public IP:

```
api.khadafiai.my.id   A   <VPS_PUBLIC_IP>
```

(Same IP as copyengine — they share the box. Wait for it to resolve: `ping api.khadafiai.my.id`.)

---

## 2. Backend on the VPS

SSH into the VPS, then:

```bash
# get the code (or git pull if already cloned)
git clone <your-repo-url> kkai && cd kkai/backend

# create the production .env (NOT committed — see backend/.env.example)
cp .env.example .env
nano .env
```

Fill `.env` with the real values:

```
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...                 # embeddings always use OpenAI
DATABASE_URL=postgresql+psycopg://postgres:...@db.xxxx.supabase.co:5432/postgres
COLLECTION_NAME=khadafi_docs
ALLOWED_ORIGINS=https://khadafiai.my.id     # tighten in step 5
RETRIEVAL_K=4
MAX_OUTPUT_TOKENS=600
# optional anti-spam:
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Build & run (loopback-only; Caddy publishes it over HTTPS):

```bash
docker compose up -d --build
docker compose logs -f kkai-backend        # watch it boot; Ctrl-C to stop tailing
curl -s localhost:8000/health              # -> {"status":"ok"}
```

> **Wiring note:** the compose file defaults to **Style B** (Caddy on host →
> `127.0.0.1:8000`). If your Caddy runs in a container on a shared Docker
> network (like the n8n template), switch to **Style A**: comment the `ports:`
> block, uncomment the `networks:` blocks in `docker-compose.yml`, set the
> network name to the one Caddy uses (`docker network ls`), and in the Caddyfile
> use `reverse_proxy kkai-backend:8000`.

---

## 3. Caddy (HTTPS + reverse proxy)

Append the block from this repo's `Caddyfile` to the VPS's **existing** Caddyfile
(don't overwrite the file that already serves n8n/copyengine), then reload:

```bash
# if Caddy runs on the host:
sudo nano /etc/caddy/Caddyfile      # paste the api.khadafiai.my.id block
sudo systemctl reload caddy

# if Caddy runs in a container:
#   edit the mounted Caddyfile, then:
docker exec <caddy_container> caddy reload --config /etc/caddy/Caddyfile
```

Verify HTTPS end-to-end (cert is issued automatically on first hit):

```bash
curl -s https://api.khadafiai.my.id/health          # -> {"status":"ok"}
curl -N -X POST https://api.khadafiai.my.id/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"What is HOOR?","session_id":"test1"}'   # -> streamed answer
```

---

## 4. Frontend on Vercel

1. Import the repo in Vercel; set **Root Directory = `frontend`** (framework
   auto-detected as Next.js).
2. Environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://api.khadafiai.my.id
   ```
3. Deploy. Note the production domain Vercel gives you
   (e.g. `khadafiai.my.id`).

---

## 5. Lock down CORS

Back on the VPS, set `ALLOWED_ORIGINS` in `backend/.env` to the exact Vercel
domain(s) (comma-separated, no trailing slash), then restart:

```
ALLOWED_ORIGINS=https://khadafiai.my.id
```
```bash
docker compose up -d           # picks up the new env
```

Open the Vercel site, ask the chatbot a question → it should stream a grounded,
cited answer. Done. 🚀

---

## Updating later

```bash
cd kkai && git pull
cd backend && docker compose up -d --build     # backend
# frontend redeploys automatically on git push (Vercel)
```
