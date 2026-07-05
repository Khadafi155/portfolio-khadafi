/* ============================================================
   Khadafi Kasim - content + chat knowledge base
   Sourced from CV_MUH. KHADAFI KASIM.pdf.
   Ported from the Claude Design handoff bundle (data.js).
   (social URLs marked TODO need real links)
   ============================================================ */

export interface Profile {
  name: string;
  short: string;
  roles: string[];
  location: string;
  tz: string;
  available: boolean;
  blurb: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedinUrl: string;
  hoorLive: string;
  github: string;
}

export interface ProofStat {
  num: string;
  unit: string;
  label: string;
}

export interface FeatureProject {
  name: string;
  kicker: string;
  funded: boolean;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  metrics: { n: string; l: string }[];
  slotId: string;
  media: string;
  /** Mockup style: a phone (default) or a desktop/browser window (for n8n etc.). */
  frame?: "phone" | "desktop";
  /** Address-bar label shown in the browser mockup (desktop frame only). */
  mediaUrl?: string;
  /** Demo video shown inside the mockup (mp4/webm URL). */
  video?: string;
  /** Static screenshot shown inside the mockup when there's no video. */
  image?: string;
  /** Desktop screenshot; when set alongside a phone `video`, the media area
   *  gets a Desktop/Phone toggle (desktop = MacBook, phone = video demo). */
  desktopImage?: string;
  /** Multiple desktop screenshots — renders a gallery (prev/next + autoplay)
   *  inside the MacBook. Takes precedence over `desktopImage`. */
  desktopImages?: string[];
  /** Multiple mobile screenshots — gallery inside the phone frame. */
  mobileImages?: string[];
  /** Poster image for the video / screen. */
  poster?: string;
  link?: string;
  linkLabel?: string;
}

export interface OtherProject {
  idx: string;
  name: string;
  slotId: string;
  media: string;
  problem: string;
  stack: string[];
  outcome: string;
  link?: string;
  linkLabel?: string;
}

export interface SkillGroupData {
  title: string;
  gn: string;
  items: string[];
}

export interface ExperienceItem {
  when: string;
  role: string;
  company: string;
  loc: string;
  /** One-line company description, shown above the bullets. */
  desc?: string;
  bullets: string[];
  tags: string[];
  logo?: string;
}

export interface EducationItem {
  school: string;
  program: string;
  when: string;
  detail: string;
  tag: string;
  logo?: string;
}

/** Supabase Storage public base (bucket "website asset"). */
const ASSET =
  "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset";

export interface AwardItem {
  title: string;
  org: string;
  year: string;
}

export interface Awards {
  highlight: { title: string; sub: string };
  golds: AwardItem[];
  nationals: AwardItem[];
  summary: string;
  scholarships: string[];
}

export interface OrgItem {
  name: string;
  role: string;
  when: string;
  note: string;
  slotId: string;
  placeholder?: boolean;
  /** Photo / certificate image (webp). */
  img?: string;
}

export interface PublicationItem {
  title: string;
  venue: string;
  when: string;
  slotId: string;
  placeholder?: boolean;
  /** Cover/scan image (webp). */
  img?: string;
  /** Category badge (e.g. Patent / Journal / Media). */
  tag?: string;
}

export interface SpeakingEvent {
  title: string;
  org: string;
  /** Photo (webp). */
  img?: string;
}

export interface Source {
  /** Display label of the cited document (maps to the SSE `title`). */
  label: string;
  tag: string;
}

interface KBEntry {
  id: string;
  triggers: string[];
  a: string[];
  cites: string[];
  generic?: boolean;
}

export const profile: Profile = {
  name: "Muh. Khadafi Kasim",
  short: "Khadafi",
  roles: ["AI & Automation Engineer", "Fullstack Developer"],
  location: "Makassar, Indonesia",
  tz: "GMT+8",
  available: true,
  blurb:
    "A developer with expertise in AI & Automation, full-stack web apps, and digital products. 5 years building remotely for edutech, fintech, and a global mental-health company.",
  email: "khadaficonnect@gmail.com",
  phone: "+62 813-4064-3550",
  linkedin: "linkedin.com/in/muh-khadafi-kasim-1a34891ba",
  linkedinUrl: "https://www.linkedin.com/in/muh-khadafi-kasim-1a34891ba",
  hoorLive: "https://hoor-webapp.azurewebsites.net/",
  github: "github.com/Khadafi15",
};

export const proof: ProofStat[] = [
  { num: "05", unit: "", label: "years building\ndigital products" },
  { num: "50", unit: "+", label: "national & intl\nawards" },
  { num: "01", unit: "", label: "Microsoft-funded\nproduct (HOOR)" },
  { num: "1", unit: "/3,988", label: "Most Outstanding\nStudent, FMIPA" },
  { num: "600", unit: "M+", label: "IDR GMV led at\nScience Hunter" },
];

export const projects: FeatureProject[] = [
  {
    name: "80/20 Engine",
    kicker: "Business-diagnostic AI agent for DTC brands ($3M-$50M)",
    funded: false,
    problem:
      "Founders of $3M-$50M DTC brands can't easily see which 20% of factors actually drive 80% of their profit - diagnosis is slow, manual, and subjective.",
    approach:
      "A business-diagnostic **AI agent** that analyzes **7 dimensions** of a DTC brand and surfaces the high-leverage 20%. Built with **Next.js, React, TypeScript, Tailwind & Radix UI** on the frontend and **Bun + Elysia + Drizzle ORM** on the backend, powered by **Claude Sonnet 4.6** (prompt caching + streaming SSE). Data on **Supabase (PostgreSQL + RLS) & Redis**, observability via **Sentry & PostHog**, CRM via webhook.",
    outcome:
      "Deployed on a **VPS (Ubuntu)** with **Docker, Nginx (auto-SSL), GHCR & CI/CD** - a production agent serving US & European founders.",
    stack: ["AI Agent", "Claude Sonnet 4.6", "Next.js", "React", "TypeScript", "Tailwind", "Radix UI", "Framer Motion", "Bun", "Elysia", "Drizzle ORM", "Supabase", "PostgreSQL", "Redis", "Sentry", "PostHog", "Docker", "Nginx", "GHCR", "CI/CD"],
    metrics: [
      { n: "7", l: "Brand dimensions analyzed" },
      { n: "80/20", l: "Profit-driver focus" },
      { n: "$3-50M", l: "DTC brands served" },
    ],
    slotId: "engine-shot",
    media: "80/20 Engine dashboard - drop a screenshot of the agent UI",
    video:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/80-20%20Engine-demo.mp4",
    desktopImage:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/80-20%20Engine%20Desktop%20Version.png",
    link: "https://beunstoppable365.com/",
    linkLabel: "beunstoppable365.com",
  },
  {
    name: "Copy Engine",
    kicker: "RAG copywriting AI agent, grounded in expert knowledge",
    funded: false,
    problem:
      "Copy at scale loses brand voice and expert nuance - generic AI output needs grounding in company context and proven frameworks.",
    approach:
      "A copywriting **AI agent** that consults, delivers verdicts, and writes copy - grounded in company context and a **RAG** knowledge base built from proven copywriting books. Built with **Next.js, FastAPI & LangChain**, **Claude Sonnet 4.6**, **OpenAI embeddings + GPT-4o Vision**, on **Supabase (PostgreSQL + pgvector) & Redis**.",
    outcome:
      "Deployed on a **VPS** with **Docker, GitHub Actions, Traefik (auto-SSL), CI/CD & Cloudflare**.",
    stack: ["AI Agent", "RAG", "LangChain", "Claude Sonnet 4.6", "OpenAI Embeddings", "GPT-4o Vision", "Next.js", "React", "TypeScript", "Tailwind", "FastAPI", "Supabase", "PostgreSQL", "pgvector", "Redis", "Docker", "GitHub Actions", "Traefik", "CI/CD", "Cloudflare"],
    metrics: [
      { n: "RAG", l: "Expert knowledge base" },
      { n: "Claude", l: "Sonnet 4.6" },
      { n: "pgvector", l: "Semantic search" },
    ],
    slotId: "proj-copy",
    media: "Copy Engine agent UI",
    video:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Copy%20Engine-demo.mp4",
    desktopImage:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Copy%20Engine%20Desktop%20Version.png",
    link: "https://copyengine.beunstoppable365.com/",
    linkLabel: "copyengine.beunstoppable365.com",
  },
  {
    name: "HOOR",
    kicker: "Microsoft-funded, privacy-first AI agent",
    funded: true,
    problem:
      "Women need anonymous, always-available, trauma-informed support - generic chatbots aren't safe, private, or grounded in vetted guidance.",
    approach:
      "A chat-based **AI healing companion** for emotional regulation, safety check-ins, and trauma-informed guidance. Built on **GPT-4 with prompt engineering + RAG**, deployed on **Azure App Service, Azure Vector Search, Azure Blob Storage** with **MySQL** for secure user data.",
    outcome:
      "**Funded by Microsoft** - supports women **24/7**, privacy-first by design.",
    stack: ["AI Agent", "GPT-4", "RAG", "Prompt Eng.", "HTML", "CSS", "Vanilla JS", "Node.js", "Express.js", "Azure App Service", "Azure Vector Search", "Azure Blob Storage", "MySQL"],
    metrics: [
      { n: "MS", l: "Funded by Microsoft" },
      { n: "24/7", l: "Always-available" },
      { n: "Privacy", l: "Anonymous & secure" },
    ],
    slotId: "proj-hoor",
    media: "HOOR chatbot UI",
    video:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/HOOR-demo.mp4?v=2",
    desktopImage:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/HOOR%20Desktop%20Version.png",
    link: "https://hoor-webapp.azurewebsites.net/",
    linkLabel: "hoor-webapp.azurewebsites.net",
  },
  {
    name: "Marketing Engine",
    kicker: "n8n B2B outreach & lead-gen automation",
    funded: false,
    problem:
      "B2B outreach is manual and unpersonalized - finding, enriching, and reaching the right leads at scale is slow.",
    approach:
      "**n8n** orchestration (webhook + API) for B2B lead generation and personalized outreach - scrapes companies (**Crunchbase, StoreLeads**), enriches via **Clay**, stores in **Google Sheets**, then uses the **Claude API** to personalize email & LinkedIn campaigns through **GoHighLevel** and **HeyReach**.",
    outcome:
      "An end-to-end automated outreach pipeline - from prospecting to personalized nurture.",
    stack: ["n8n", "Claude API", "Crunchbase", "StoreLeads", "Clay", "Google Sheets", "GoHighLevel", "HeyReach"],
    metrics: [
      { n: "n8n", l: "Orchestration" },
      { n: "B2B", l: "Lead generation" },
      { n: "Auto", l: "Email & LinkedIn" },
    ],
    slotId: "proj-marketing",
    media: "n8n B2B outreach workflow",
    frame: "desktop",
    mediaUrl: "n8n · marketing-engine",
    image:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Marketing%20Engine.png",
    link: "https://drive.google.com/drive/folders/1NdQcstibn586Q-V2f6P93ITEQw7BadJQ",
    linkLabel: "Google Drive",
  },
  {
    name: "Content Engine",
    kicker: "n8n social-media video automation",
    funded: false,
    problem:
      "Producing viral short-form video at scale - analysis, editing, and publishing - is labor-intensive.",
    approach:
      "**n8n** orchestration (webhook + API) for end-to-end video production - analyzes viral content, uses the **Claude API** to auto-generate prompts driving AI video tools (**Sandcastles, Remotion, OpusClip, Higgsfield**), and auto-schedules uploads via **OmniSocials**.",
    outcome:
      "Viral analysis to AI video to auto-publish - hands-free.",
    stack: ["n8n", "Claude API", "Sandcastles", "Remotion", "OpusClip", "Higgsfield", "OmniSocials"],
    metrics: [
      { n: "n8n", l: "Orchestration" },
      { n: "AI", l: "Video generation" },
      { n: "Auto", l: "Scheduled uploads" },
    ],
    slotId: "proj-content",
    media: "n8n video-production workflow",
    frame: "desktop",
    mediaUrl: "n8n · content-engine",
    image:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Content%20Engine.png",
    link: "https://drive.google.com/drive/folders/1NdQcstibn586Q-V2f6P93ITEQw7BadJQ",
    linkLabel: "Google Drive",
  },
  {
    name: "Tarkan Salar",
    kicker: "DTC consultancy site + CRM + payments",
    funded: false,
    problem:
      "A $3M-$50M+ consultancy needed a polished site with lead capture, payments, and a diagnostic quiz.",
    approach:
      "Built with **Next.js, React, TypeScript & Tailwind**, integrated with **GoHighLevel (CRM)** and **Stripe** payments, deployed on **Vercel** - including a profit diagnostic quiz.",
    outcome:
      "Live consultancy platform on **tarkansalar.com**.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "GoHighLevel", "Stripe", "Vercel"],
    metrics: [
      { n: "DTC", l: "$3-50M+ consultancy" },
      { n: "CRM", l: "GoHighLevel" },
      { n: "Stripe", l: "Payments" },
    ],
    slotId: "proj-tarkan",
    media: "tarkansalar.com homepage",
    video:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Tarkan%20Salar%20Website-demo.mp4",
    desktopImage:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Tarkan%20Website%20Desktop%20Version.png",
    link: "https://tarkansalar.com",
    linkLabel: "tarkansalar.com",
  },
  {
    name: "Dimple Bindra",
    kicker: "Digital-product platform for women (US & HK)",
    funded: false,
    problem:
      "A digital-product business needed content, programs, and payments in one site for US & Hong Kong users.",
    approach:
      "Built on **WordPress (Elementor)** with **PHP & JavaScript**, integrated with **CRM, n8n** automation, and **Stripe** payments via webhook.",
    outcome:
      "End-to-end product site + payments, live on **dimplebindra.com**.",
    stack: ["WordPress", "Elementor", "HTML", "CSS", "PHP", "JavaScript", "CRM", "n8n", "Stripe"],
    metrics: [
      { n: "US/HK", l: "Global users" },
      { n: "Stripe", l: "Payments" },
      { n: "n8n", l: "Automation" },
    ],
    slotId: "proj-dimple",
    media: "dimplebindra.com homepage",
    video:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Dimple%20Bindra%20Website-demo.mp4",
    desktopImage:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Dimpl;e%20Website%20Desktop%20Version.png",
    link: "https://dimplebindra.com",
    linkLabel: "dimplebindra.com",
  },
  {
    name: "Science Hunter Indonesia",
    kicker: "Indonesia's first scientific-education platform",
    funded: false,
    problem:
      "Indonesia lacked a platform for scientific education, research, and academic writing at scale.",
    approach:
      "Built and scaled a B2C platform on **WordPress** with **PHP & JavaScript** and **Midtrans** payments - digitizing 56 MOOCs, 200 modules, and 300 videos.",
    outcome:
      "**IDR 600M+ GMV**, 5,865 orders, 9,112 items sold on **sciencehunter.id**.",
    stack: ["WordPress", "Elementor", "HTML", "CSS", "PHP", "JavaScript", "Midtrans"],
    metrics: [
      { n: "600M+", l: "IDR GMV" },
      { n: "5,865", l: "Orders" },
      { n: "56", l: "MOOCs digitized" },
    ],
    slotId: "proj-shi",
    media: "sciencehunter.id MOOC dashboard",
    mediaUrl: "sciencehunter.id",
    image:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/SHI%20Mobile%20Desktop%20Version.png.jpeg",
    desktopImage:
      "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/SHI%20Website%20Desktop%20Version.png",
    link: "https://sciencehunter.id/",
    linkLabel: "sciencehunter.id",
  },
  {
    name: "Smart Laundry",
    kicker: "ML + cloud + mobile laundry platform",
    funded: false,
    problem:
      "Connecting customers with laundry stores - detecting materials and paying virtually - needed an ML + mobile solution.",
    approach:
      "Built on **PHP / Laravel** with **OAuth (Laravel Passport)**, **MySQL** and **Nginx**, deployed on **Google Cloud (GCP) / Ubuntu** - with **machine learning** for material detection. (Bangkit, Google / GoTo / Traveloka.)",
    outcome:
      "An ML + cloud + mobile platform connecting customers and laundry stores.",
    stack: ["ML", "PHP", "Laravel", "Laravel Passport", "OAuth", "MySQL", "Nginx", "Ubuntu", "GCP", "Postman"],
    metrics: [
      { n: "ML", l: "Material detection" },
      { n: "GCP", l: "Cloud" },
      { n: "Mobile", l: "App platform" },
    ],
    slotId: "proj-laundry",
    media: "Smart Laundry app screen",
    mediaUrl: "smart-laundry",
    desktopImages: [
      `${ASSET}/Smart%20Laundry%201%20Website%20Desktop%20Version.webp`,
      `${ASSET}/Smart%20Laundry%202%20Website%20Desktop%20Version.webp`,
      `${ASSET}/Smart%20Laundry%203%20Website%20Desktop%20Version.webp`,
      `${ASSET}/Smart%20Laundry%204%20Website%20Desktop%20Version.webp`,
      `${ASSET}/Smart%20Laundry%205%20Website%20Desktop%20Version.webp`,
      `${ASSET}/Smart%20Laundry%206%20Website%20Desktop%20Version.webp`,
    ],
    mobileImages: [
      `${ASSET}/Smart%20Laundry%201%20Mobile%20Version.webp`,
      `${ASSET}/Smart%20Laundry%202%20Mobile%20Version.webp`,
      `${ASSET}/Smart%20Laundry%203%20Mobile%20Version.webp`,
      `${ASSET}/Smart%20Laundry%204%20Mobile%20Version.webp`,
      `${ASSET}/Smart%20Laundry%205%20Mobile%20Version.webp`,
    ],
    link: "https://github.com/Khadafi15/Smart-Laundry-App-Backend",
    linkLabel: "GitHub",
  },
  {
    name: "Daishil",
    kicker: "Villa rent & booking platform (Go)",
    funded: false,
    problem:
      "Villa hosting and booking needed an end-to-end platform - listings, bookings, and payments.",
    approach:
      "A villa rent-and-booking platform built in **Golang** with **Echo, Gorm & JWT auth**, **MySQL**, **Xendit** payments and **Swagger** docs, deployed on **GCP** with **Docker & CI/CD**.",
    outcome:
      "A production booking + payments REST API.",
    stack: ["Golang", "Echo", "Gorm", "JWT", "MySQL", "Xendit", "Swagger", "GCP", "Docker", "CI/CD", "Postman"],
    metrics: [
      { n: "Go", l: "Echo + Gorm" },
      { n: "Xendit", l: "Payments" },
      { n: "REST", l: "API + Swagger" },
    ],
    slotId: "proj-daishil",
    media: "Booking screen / API docs",
    mediaUrl: "daishil",
    desktopImage: `${ASSET}/DAISHIL%20APPS.webp`,
    link: "https://github.com/Khadafi15/Airbnb-App-Project-Backend",
    linkLabel: "GitHub",
  },
];

export const skills: SkillGroupData[] = [
  {
    title: "AI & Automation",
    gn: "// the core",
    items: [
      "AI & Automation", "AI Agent", "LLM Integration", "Anthropic API", "OpenAI API",
      "Azure Foundry", "RAG", "LangChain", "MCP", "n8n", "Webhooks", "GPT-4o Vision",
      "Vector Search", "Embeddings & Semantic Search",
      "Prompt Engineering & Caching",
      "Structured Output (JSON)", "Token Streaming (SSE)",
      "Claude (Chat, Code, Design, Cowork)",
    ],
  },
  {
    title: "Languages",
    gn: "// polyglot",
    items: [
      "Python", "TypeScript", "JavaScript", "Golang", "PHP", "Java",
      "C", "C++", "Assembly", "Groovy", "MATLAB", "Bash",
    ],
  },
  {
    title: "Backend & APIs",
    gn: "// server-side",
    items: [
      "FastAPI", "Uvicorn", "Node.js", "Elysia", "Express.js", "Bun", "Hapi",
      "Laravel", "Echo", "Gorm", "Drizzle ORM", "REST API", "Postman", "Async Programming",
      "Payment Gateway (Xendit, Stripe, Midtrans)",
      "Authentication & Authorization (JWT, Supabase Auth, RLS)", "Clean Architecture",
    ],
  },
  {
    title: "Frontend",
    gn: "// the interface",
    items: [
      "Next.js", "React", "Radix UI", "shadcn/ui", "Framer Motion", "Tailwind",
      "Vanilla JS", "HTML", "CSS", "Responsive Design", "DOM",
    ],
  },
  {
    title: "Data & Storage",
    gn: "// state",
    items: [
      "PostgreSQL", "Supabase", "Supabase Storage", "pgvector", "Azure Vector Search",
      "Azure Blob Storage", "Redis", "MySQL", "PL/SQL", "Oracle",
    ],
  },
  {
    title: "Cloud & DevOps",
    gn: "// ship & operate",
    items: [
      "Docker", "CI/CD", "Git / GitHub", "GHCR", "Ubuntu", "Bash / Cron",
      "Traefik", "Cloudflare", "Vercel", "GCP", "Microsoft Azure", "Sentry", "PostHog",
    ],
  },
  {
    title: "Tools & Growth",
    gn: "// build, grow, ship",
    items: [
      "CRM (GoHighLevel)", "WordPress", "Jira",
      "Trello", "Slack", "Product Knowledge", "Product Development", "Crunchbase",
      "StoreLeads", "Clay", "HeyReach", "Sandcastles", "Remotion", "OpusClip",
      "Higgsfield", "Omnisocials",
    ],
  },
];

export const experience: ExperienceItem[] = [
  {
    when: "Mar 2026 - Now",
    role: "AI & Automation Engineer",
    company: "Be Unstoppable 365 (Smart Concept GmbH)",
    loc: "Remote · Germany",
    desc:
      "Be Unstoppable 365 (Smart Concept GmbH) is a Business Consulting & Services company. Its owner, Tarkan Salar, has operated at every layer of a product business for 30 years - Louis Vuitton, Adidas, Zara, H&M, his own factory, and his own brand (€0 to €40M in two years).",
    logo: `${ASSET}/LOGO%20BE365.png`,
    bullets: [
      "Built 2 production AI agents - 80/20 Engine (business-diagnostic agent analyzing 7 dimensions of DTC brands $3M-$50M to find the 20% of factors driving 80% of profit) for US & European founders, and Copy Engine (RAG-based copywriting agent grounded in company & expert knowledge).",
      "Developed 2 n8n AI automations - Marketing Engine for B2B lead generation (scraping & enrichment), cold outreach, scheduling and email & LinkedIn nurture, and Content Engine for viral-content analysis, scripting, long-form editing & clipping, AI short-form generation and auto-scheduled uploads.",
      "Built an end-to-end website on tarkansalar.com integrated with CRM - workflow automation, payment integration, email campaigns, funnels & pipelines, booking & calendar scheduling, and a profit diagnostic quiz.",
    ],
    tags: ["AI Agent", "RAG", "n8n", "GPT-4", "CRM"],
  },
  {
    when: "Jul 2025 - Jul 2026",
    role: "Digital Product Specialist & Tech Ops Assistant",
    company: "Dimple Bindra Ltd",
    loc: "Remote · USA / Hongkong",
    desc:
      "Dimple Bindra Global Ltd is a global mental-health company based in the United States and Hong Kong. I contributed to digital products, web development & AI automation, and business development - including supporting the company in securing funding from Microsoft and Hong Kong Science & Technology Parks Corporation (HKSTP).",
    logo: `${ASSET}/LOGO%20DIMPLE%20BINDRA.png`,
    bullets: [
      "Developed and maintained an end-to-end website on dimplebindra.com - workflow automations, payment integrations, email campaigns, contact management, funnels & pipelines, form builders, calendar scheduling, SEO and UI/UX improvements.",
      "Built and maintained the company's digital product development for US & Hong Kong users, including a free program, 8 paid programs, and the Why-You-Betrayal Quiz.",
      "Developed and maintained HOOR, a Microsoft-funded, privacy-first AI agent supporting women 24/7 - an AI-powered healing companion for emotional regulation, safety check-ins, and trauma-informed guided assistance.",
    ],
    tags: ["AI Agent", "GPT-4", "n8n", "Stripe", "CRM"],
  },
  {
    when: "Oct 2023 - Oct 2024",
    role: "Associate Implementation Consultant",
    company: "OpenWay",
    loc: "Hybrid · Jakarta",
    desc:
      "OpenWay is a digital-payment software vendor from Belgium, expanding into Indonesia - #1 rated in digital banking & payments for both on-premise and cloud deployment.",
    logo: `${ASSET}/LOGO%20OPENWAY.png`,
    bullets: [
      "Prepared and customized the WAY4 application to project-specific requirements - gathering client requirements, writing custom & standard program requests, system & business-parameter setup, and testing.",
      "Performed installation and configuration of the OpenWay software (Groovy & PL/SQL), troubleshooting, and bug fixing.",
      "Developed and maintained knowledge of product, integration, applications and financial services across the company.",
    ],
    tags: ["WAY4", "Groovy", "PL/SQL", "Fintech"],
  },
  {
    when: "Mar 2021 - Mar 2023",
    role: "Manager of Digital Product (Website)",
    company: "Science Hunter Indonesia",
    loc: "Remote · Jakarta",
    desc:
      "Science Hunter Indonesia is the first research-education technology startup based on e-learning, guiding Indonesian students and youth to create scientific papers and earn achievements.",
    logo: `${ASSET}/LOGO%20SHI.png`,
    bullets: [
      "Led the website division to build and develop company websites.",
      "Facilitated 55 professional mentors to digitize 56 Massive Open Online Research Courses (MOOCs), 200 modules, and 300 learning videos on sciencehunter.id.",
      "Collaborated with the digital product division to sustain the B2C model - IDR 600M+ GMV, 5,865 orders, and 9,112 product items sold.",
    ],
    tags: ["Leadership", "WordPress", "B2C", "PHP"],
  },
];

export const educationList: EducationItem[] = [
  {
    school: "University of Brawijaya",
    program: "Instrumentation · B.Sc.",
    when: "2018 - 2023",
    detail:
      "GPA 3.18 / 4.00. Studied Hardware & Software. Being Most Outstanding Student of the Faculty of Mathematics & Natural Sciences (1 of 3,988).",
    tag: "Degree",
    logo: `${ASSET}/logo%20ub.png`,
  },
  {
    school: "ASEAN Data Science Explorers",
    program: "Data Scientist",
    when: "2023",
    detail:
      "Selective data-science program designed by SAP Southeast Asia in collaboration with the ASEAN Foundation.",
    tag: "Program",
    logo: `${ASSET}/logo%20asean%20data%20scientist.png`,
  },
  {
    school: "Alterra Academy",
    program: "Backend Path",
    when: "2023",
    detail:
      "Intensive backend engineering bootcamp - Building Backend Production.",
    tag: "Academy",
    logo: `${ASSET}/logo%20alterra.png`,
  },
  {
    school: "Bangkit Academy",
    program: "Cloud Computing path",
    when: "2022",
    detail:
      "Google-led tech academy with GoTo & Traveloka - Graduated on the Cloud Computing path.",
    tag: "Academy",
    logo: `${ASSET}/logo%20bangkit.png`,
  },
];

/** Graduation cut-out figures (Supabase Storage) shown over the campus bg. */
export const eduPhotos: { src: string; caption: string }[] = [
  { src: `${ASSET}/wisuda_1.png`, caption: "Graduation - University of Brawijaya" },
  { src: `${ASSET}/wisuda_2.png`, caption: "Graduation - University of Brawijaya" },
  { src: `${ASSET}/wisuda_3.png`, caption: "Graduation - University of Brawijaya" },
  { src: `${ASSET}/wisuda_4.png`, caption: "Graduation - University of Brawijaya" },
];

/** Campus backdrop behind the graduation figures. */
export const eduBackground = `${ASSET}/ub.png`;

/** Certificate images (Supabase Storage) for the Certification 3D gallery. */
export const certImages: { src: string; caption: string }[] = [
  { src: `${ASSET}/sertifikat%20mawapres.png`, caption: "Most Outstanding Student" },
  { src: `${ASSET}/sertifikat%20data%20scientist.png`, caption: "ASEAN Data Scientist" },
  { src: `${ASSET}/sertifikat%20bangkit.jpeg`, caption: "Bangkit Academy - Cloud Computing" },
];

export const awards: Awards = {
  highlight: {
    title: "Most Outstanding Student",
    sub: "Faculty of Mathematics & Natural Sciences, 2021 - 1 of 3,988",
  },
  golds: [
    { title: "Africa Invention & Innovation Expo (AIIE)", org: "OCIIP, Nigeria", year: "2022" },
    { title: "7th International Avicenna Youth Science Fair (IAYSF)", org: "IARC, Iran", year: "2022" },
    { title: "1 IDEA 1 WORLD Turkey Challenge", org: "Turkey Innovation Design Startup", year: "2021" },
    { title: "9th International Innovation, Invention & Design Competition (INDES)", org: "Universiti Teknologi MARA, Perak, Malaysia", year: "2020" },
  ],
  nationals: [
    { title: "1st · National Essay Competition MICROFEST", org: "University of Gadjah Mada", year: "2020" },
    { title: "1st · National Essay Competition MASTERPIECE", org: "University of Diponegoro", year: "2021" },
    { title: "2nd · National Project Competition Insight Challenge", org: "Institute of Technology Bandung", year: "2019" },
    { title: "3rd · Ideanation Energy Innovation", org: "PT. Inovasi Indonesia Berkarya", year: "2021" },
    { title: "Research Funding · Tanoto Student Research Awards (TSRA)", org: "Tanoto Foundation", year: "2020" },
    { title: "Research Funding · Tanoto Student Research Awards (TSRA)", org: "Tanoto Foundation", year: "2020" },
    { title: "Research Funding · PIMNAS 34", org: "Ministry of Education, Culture, Research & Technology", year: "2021" },
  ],
  summary:
    "50+ awards at national & international level - writing, ideanation, hackathon, business plan, invention & product development.",
  scholarships: [
    "Teladan Tanoto Foundation Scholarship · 2019 - 2022",
    "BRI Syariah Scholarship · 2019 - 2020",
  ],
};

// PLACEHOLDER - real entries pending
export const organizations: OrgItem[] = [
  { name: "", role: "", when: "", note: "", img: `${ASSET}/org.webp`, slotId: "org-1" },
  { name: "", role: "", when: "", note: "", img: `${ASSET}/org2.webp`, slotId: "org-2" },
  { name: "", role: "", when: "", note: "", img: `${ASSET}/org3.webp`, slotId: "org-3" },
  { name: "", role: "", when: "", note: "", img: `${ASSET}/org4.webp`, slotId: "org-4" },
  { name: "", role: "", when: "", note: "", img: `${ASSET}/org5.webp`, slotId: "org-5" },
  { name: "", role: "", when: "", note: "", img: `${ASSET}/org6.webp`, slotId: "org-6" },
  { name: "", role: "", when: "", note: "", img: `${ASSET}/org7.webp`, slotId: "org-7" },
];

// PLACEHOLDER - titles / venues pending
export const publications: PublicationItem[] = [
  { title: "Registered Patent", venue: "Intellectual Property (HKI)", when: "", tag: "Patent", img: `${ASSET}/Paten.webp`, slotId: "pub-paten" },
  { title: "Journal Publication", venue: "Scientific Journal", when: "", tag: "Journal", img: `${ASSET}/journal%201.webp`, slotId: "pub-j1" },
  { title: "Journal Publication", venue: "Scientific Journal", when: "", tag: "Journal", img: `${ASSET}/journal%202.webp`, slotId: "pub-j2" },
  { title: "Media Coverage", venue: "Press / Media", when: "", tag: "Media", img: `${ASSET}/media%201.webp`, slotId: "pub-m1" },
  { title: "Media Coverage", venue: "Press / Media", when: "", tag: "Media", img: `${ASSET}/media%202.webp`, slotId: "pub-m2" },
  { title: "Media Coverage", venue: "Press / Media", when: "", tag: "Media", img: `${ASSET}/media%203.webp`, slotId: "pub-m3" },
  { title: "Media Coverage", venue: "Press / Media", when: "", tag: "Media", img: `${ASSET}/media%204.webp`, slotId: "pub-m4" },
];

export const softSkills: string[] = [
  "Algorithms", "Computational Complexity", "Advanced Problem Solving", "Public Speaking",
  "Time Management", "Project Management", "Communication", "Teamwork", "Leadership",
  "Analytical Thinking", "Critical Thinking",
];

export const speaking: { note: string; events: SpeakingEvent[] } = {
  note: "Speaker & facilitator at 10+ research and academic events, 2021 - 2022",
  events: [
    { title: "FEBYS Workshop Program", org: "USA Surabaya Consulate General × SHI", img: `${ASSET}/speak.webp` },
    { title: "Speaking Engagement", org: "Research & academic event", img: `${ASSET}/speak%2011.webp` },
    { title: "MAWAPRES School Event", org: "Universitas Sebelas Maret", img: `${ASSET}/Speak1.webp` },
    { title: "Research Writing School", org: "Universitas Lampung", img: `${ASSET}/speak%202.webp` },
    { title: "Brawijaya Outstanding Forum", org: "EM, Universitas Brawijaya", img: `${ASSET}/speak%203.webp` },
    { title: "PRISMA Course Event", org: "FP, Universitas Brawijaya", img: `${ASSET}/speak%204.webp` },
    { title: "Brainstorming Idea Event", org: "RITMA, FMIPA-UB", img: `${ASSET}/speak%205.webp` },
    { title: "Sciencesaurus Webinar", org: "FMIPA, Universitas Brawijaya", img: `${ASSET}/speak%206.webp` },
    { title: "The Generation of Statistician", org: "Studio Statistika, FMIPA-UB", img: `${ASSET}/speak%207.webp` },
    { title: "Student Achievement Movement", org: "KIM, FAPET-UB", img: `${ASSET}/speak%208.webp` },
    { title: "Chem E-Car X Webinar", org: "HMTK, FT-UB", img: `${ASSET}/speak%209.webp` },
    { title: "Speaking Engagement", org: "Research & academic event", img: `${ASSET}/speak%2010.webp` },
  ],
};

export interface CertItem {
  title: string;
  issuer: string;
  img: string;
}

export const certs: CertItem[] = [
  { title: "ASEAN Data Scientist Explorers", issuer: "SAP Southeast Asia × ASEAN Foundation · 2023", img: `${ASSET}/data%20scientist.webp` },
  { title: "Bangkit Specializing in Cloud Computing", issuer: "Google, Tokopedia, Gojek & Traveloka · 2022", img: `${ASSET}/Bangkit%20Specializing%20in%20Cloud%20Computing%20-%20MUH.%20KHADAFI%20KASIM.webp` },
  { title: "Architecting with Google Compute Engine Specialization", issuer: "Coursera · 2022", img: `${ASSET}/Cloud%20computing.webp` },
  { title: "Learn Backend Applications for Beginners with Google Cloud", issuer: "Dicoding · 2022", img: `${ASSET}/backend.webp` },
  { title: "Learn Basic JavaScript Programming", issuer: "Dicoding · 2022", img: `${ASSET}/javascript.webp` },
  { title: "Learn Basic Web Programming", issuer: "Dicoding · 2022", img: `${ASSET}/web.webp` },
  { title: "Microsoft Office Desktop Application Certification (90,75)", issuer: "Microsoft Trust Training Partner · 2021", img: `${ASSET}/Microsoft%20Office%20Desktop%20Application%20Certification%20-%20MUH.%20KHADAFI%20KASIM.webp` },
  { title: "TOEFL (523)", issuer: "Kingdom English Course · 2021", img: `${ASSET}/toefl.webp` },
];

/* ===========================================================
   CHAT KNOWLEDGE BASE
   =========================================================== */
const SOURCES: Record<string, Source> = {
  cv: { label: "CV - Khadafi_Kasim.pdf", tag: "cv" },
  hoor: { label: "projects/HOOR.md", tag: "doc" },
  proj: { label: "projects/portfolio.md", tag: "doc" },
  awards: { label: "education/awards.pdf", tag: "doc" },
  edu: { label: "education/transcript.pdf", tag: "doc" },
  stack: { label: "skills-matrix.md", tag: "doc" },
  work: { label: "work-experience.md", tag: "doc" },
  certs: { label: "certifications.pdf", tag: "doc" },
};

const KB: KBEntry[] = [
  {
    id: "hoor",
    triggers: ["hoor", "microsoft", "trauma", "mental health", "healing", "privacy", "azure agent", "funded", "women"],
    a: [
      "**HOOR** is a privacy-first AI agent that gives women anonymous, trauma-informed support through chat - and the project I'm proudest of.",
      "It's an **AI healing companion** for emotional regulation, safety check-ins, and guided support, built on **GPT-4 with prompt engineering + RAG** and deployed on **Azure App Service, Azure Vector Search, Azure Blob Storage** with MySQL for secure data.",
      "It's **funded by Microsoft**, runs 24/7, and is live at **hoor-webapp.azurewebsites.net**.",
    ],
    cites: ["hoor", "cv"],
  },
  {
    id: "projects",
    triggers: ["project", "built", "shipped", "products", "portfolio", "quiz", "dimple", "science hunter", "laundry", "daishil", "what has he made", "what did he build"],
    a: [
      "Beyond **HOOR**, Khadafi has shipped a range of products: the **Why-You-Betrayal Quiz** (CRM + n8n automation), the **Dimple Bindra** digital-product site (WordPress + Stripe + CRM), and **Science Hunter Indonesia** - Indonesia's first scientific-education platform, which he scaled to **IDR 600M+ GMV**.",
      "He's also built **Smart Laundry** (ML + GCP) and **Daishil**, a villa booking API in **Go**.",
    ],
    cites: ["proj", "cv"],
  },
  {
    id: "stack",
    triggers: ["stack", "tech", "skill", "tools", "languages", "rag", "llm", "embedding", "vector", "what can you", "technologies", "n8n", "frameworks"],
    a: [
      "Core is **AI & Automation**: LLM integration (Azure OpenAI/Foundry), RAG, embeddings & semantic search (Azure Vector Search), prompt engineering, and n8n.",
      "Languages span **Python, Go, Node.js, PHP, Java, JavaScript, C/C++** with Express, Laravel, Echo and more - shipped on **Azure, GCP, Docker, and CI/CD**.",
      "Short version: I can take an AI product from retrieval pipeline to deployed full-stack app, solo.",
    ],
    cites: ["stack", "cv"],
  },
  {
    id: "awards",
    triggers: ["award", "outstanding", "achievement", "recognition", "gold", "medal", "decorated", "competition", "scholarship"],
    a: [
      "Khadafi holds **50+ national and international awards** - including **four international innovation gold medals** (Nigeria, Iran, Turkey, Malaysia).",
      "He was named **Most Outstanding Student of FMIPA, University of Brawijaya - 1 of 3,988**, and earned the Tanoto Teladan and BRI Syariah scholarships.",
    ],
    cites: ["awards", "cv"],
  },
  {
    id: "education",
    triggers: ["education", "study", "degree", "university", "brawijaya", "gpa", "graduate", "college", "school", "major"],
    a: [
      "He studied **Instrumentation at the University of Brawijaya** (GPA 3.18/4.00, 2018-2023), and was named the faculty's **Most Outstanding Student**.",
    ],
    cites: ["edu", "cv"],
  },
  {
    id: "experience",
    triggers: ["experience", "years", "work history", "background", "career", "where has he worked", "roles", "job", "openway", "current", "now"],
    a: [
      "**5 years** building digital products. Currently **Digital Product Specialist & Tech Ops Assistant at Dimple Bindra Ltd** (remote, US/HK) - running the site, automations, and HOOR.",
      "Before that: **Associate Implementation Consultant at OpenWay** (WAY4 payments platform, Groovy & PL/SQL), and **Manager of Digital Product at Science Hunter Indonesia**, where he led the website division.",
    ],
    cites: ["work", "cv"],
  },
  {
    id: "certs",
    triggers: ["certification", "certificate", "course", "toefl", "english", "bangkit", "google cloud", "sap", "trained"],
    a: [
      "He's certified through **ASEAN Data Scientist Explorers** (SAP × ASEAN Foundation), **Bangkit by Google/Tokopedia/Gojek/Traveloka** (Cloud Computing), and **Google Compute Engine** (Coursera).",
      "English: **TOEFL 523**.",
    ],
    cites: ["certs", "cv"],
  },
  {
    id: "speaking",
    triggers: ["speak", "speaker", "talk", "workshop", "webinar", "presentation", "mentor", "facilitat", "event"],
    a: [
      "Khadafi has spoken and facilitated at **10+ research and academic events** (2021-2022) - including the **FEBYS Workshop** (USA Surabaya Consulate General), **MAWAPRES School** (Universitas Sebelas Maret), and webinars across Universitas Brawijaya.",
    ],
    cites: ["cv"],
  },
  {
    id: "softskills",
    triggers: ["soft skill", "softskill", "leadership", "public speaking", "communication", "teamwork", "management skill", "personal skill"],
    a: [
      "Beyond the technical stack, his strengths are **public speaking, leadership, project management, research, and analytical thinking** - sharpened across 50+ competitions and speaking events.",
    ],
    cites: ["cv"],
  },
  {
    id: "availability",
    triggers: ["hire", "available", "remote", "contact", "reach", "email", "freelance", "timezone", "open to", "get in touch"],
    a: [
      "Yes - he's **open to work** and used to remote collaboration across timezones (US & Hong Kong clients from Makassar, GMT+8).",
      "Reach him at **khadaficonnect@gmail.com**, or keep asking me here.",
    ],
    cites: ["cv"],
  },
  {
    id: "who",
    generic: true,
    triggers: ["who is", "who's", "about him", "yourself", "introduce", "tell me about him", "summary", "overview", "bio"],
    a: [
      "**Muh. Khadafi Kasim** - an AI & Automation Engineer and fullstack developer based in **Makassar, Indonesia**.",
      "Five years shipping digital products remotely for edutech, fintech, and a global mental-health company, with deep work in **RAG, LLMs, and end-to-end web apps**. Academically decorated - a builder who ships.",
    ],
    cites: ["cv"],
  },
];

const fallback = {
  a: [
    "I'm trained on Khadafi's CV and project docs - ask me about his **AI/RAG work**, **HOOR**, his **projects**, **stack**, **awards**, **education**, **experience**, or **availability**.",
    "Try a suggestion below 👇",
  ],
  cites: ["cv"],
};

export const greeting = {
  a: [
    "Hi - I'm **KK.AI**, trained on Khadafi's **CV and project docs**. Ask me anything about his work and I'll answer with sources.",
  ],
  cites: [] as string[],
};

// Ordered to mirror the navbar: Background (Education → Skills → Experience →
// Projects) → Activities (Awards → Speaking) → Certification & Course.
export const suggestions: string[] = [
  "Tell me about his education",
  "What are his skills?",
  "What's his work experience?",
  "What projects has he built?",
  "What awards has he won?",
  "Has he spoken at events?",
  "What certifications does he have?",
];

export interface MatchResult {
  a: string[];
  cites: string[];
}

/** Score KB entries by trigger overlap; specific topics beat the generic bio. */
export function match(query: string): MatchResult {
  const q = (query || "").toLowerCase();
  const score = (entry: KBEntry) => {
    let s = 0;
    for (const t of entry.triggers) if (q.includes(t)) s += t.length;
    return s;
  };
  let best: KBEntry | null = null;
  let bestScore = 0;
  for (const entry of KB) {
    if (entry.generic) continue;
    const s = score(entry);
    if (s > bestScore) { bestScore = s; best = entry; }
  }
  if (best) return { a: best.a, cites: best.cites };
  let gBest: KBEntry | null = null;
  let gScore = 0;
  for (const entry of KB) {
    if (!entry.generic) continue;
    const s = score(entry);
    if (s > gScore) { gScore = s; gBest = entry; }
  }
  return gBest ? { a: gBest.a, cites: gBest.cites } : fallback;
}

/** Resolve cite ids to Source objects. */
export function sourcesFor(ids: string[]): Source[] {
  return (ids || []).map((id) => SOURCES[id]).filter(Boolean);
}
