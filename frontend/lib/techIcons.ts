/**
 * Maps a stack/skill chip label to a simple-icons slug. The icon is rendered as
 * a CSS-mask (monochrome) so it inherits the chip's text colour - dim by
 * default, tosca on hover. Labels without a known icon stay text-only.
 * Only verified-existing slugs are listed (others 404 on the CDN).
 */
const SLUG: Record<string, string> = {
  "Claude Sonnet 4.6": "claude",
  "Claude API": "claude",
  Claude: "claude",
  "Claude (Chat, Code, Design, Cowork)": "claude",
  "Next.js": "nextdotjs",
  React: "react",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "Vanilla JS": "javascript",
  Tailwind: "tailwindcss",
  "Radix UI": "radixui",
  "shadcn/ui": "shadcnui",
  "Framer Motion": "framer",
  Bun: "bun",
  "Drizzle ORM": "drizzle",
  Supabase: "supabase",
  PostgreSQL: "postgresql",
  Redis: "redis",
  Sentry: "sentry",
  PostHog: "posthog",
  Docker: "docker",
  Nginx: "nginx",
  GHCR: "github",
  "GitHub Actions": "githubactions",
  LangChain: "langchain",
  MCP: "modelcontextprotocol",
  FastAPI: "fastapi",
  Cloudflare: "cloudflare",
  Vercel: "vercel",
  Stripe: "stripe",
  Crunchbase: "crunchbase",
  "Google Sheets": "googlesheets",
  n8n: "n8n",
  WordPress: "wordpress",
  Elementor: "elementor",
  HTML: "html5",
  CSS: "css",
  PHP: "php",
  Laravel: "laravel",
  "Laravel Passport": "laravel",
  MySQL: "mysql",
  Ubuntu: "ubuntu",
  GCP: "googlecloud",
  Postman: "postman",
  Golang: "go",
  JWT: "jsonwebtokens",
  Swagger: "swagger",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  Traefik: "traefikproxy",
  Xendit: "xendit",
  OAuth: "auth0",
  Python: "python",
  "Anthropic API": "anthropic",
  C: "c",
  "C++": "cplusplus",
  Bash: "gnubash",
  "Bash / Cron": "gnubash",
  Groovy: "apachegroovy",
  Jira: "jira",
  Trello: "trello",
  "Supabase Storage": "supabase",
  "Supabase Auth": "supabase",
  pgvector: "postgresql",
  "Git / GitHub": "github",
};

/** Brand icons that aren't on simple-icons — mapped to a full icon URL.
 *  Rendered the same way (CSS mask), so a single-shape silhouette works best. */
/** Infinity / loop glyph (the classic CI/CD symbol) as a stroked data-URI SVG,
 *  so it renders monochrome via the chip mask like the other icons. */
const INFINITY =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></svg>',
  );

const AZURE =
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-plain.svg";
const JAVA =
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg";
const MATLAB =
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-plain.svg";

/** Webhook glyph (lucide) as a stroked data-URI SVG — no simple-icons slug. */
const WEBHOOK =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/></svg>',
  );

/** Robot / bot glyph for AI-agent chips, as a stroked data-URI SVG. */
const ROBOT =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
  );

/** Wraps lucide-style stroked paths into a monochrome data-URI SVG (mask). Used
 *  for tools/frameworks with no maskable brand logo — a representative glyph. */
const lucide = (inner: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`,
  );
const CPU = lucide('<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>');
const ROCKET = lucide('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>');
const SERVER = lucide('<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>');
const ZAP = lucide('<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>');
const DATABASE = lucide('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>');
const WAYPOINTS = lucide('<circle cx="12" cy="4.5" r="2.5"/><path d="m10.2 6.3-3.9 3.9"/><circle cx="4.5" cy="12" r="2.5"/><path d="M7 12h10"/><circle cx="19.5" cy="12" r="2.5"/><path d="m13.8 17.7 3.9-3.9"/><circle cx="12" cy="19.5" r="2.5"/>');
const SHIELD = lucide('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>');
const BRAIN = lucide('<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/>');
const EYE = lucide('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>');
const TRENDING_UP = lucide('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>');
const STORE = lucide('<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20"/><path d="M12 12v6"/>');
const LAYERS = lucide('<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>');
const SEND = lucide('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>');
const IMAGE = lucide('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>');
const PLAY = lucide('<polygon points="6 3 20 12 6 21 6 3"/>');
const SCISSORS = lucide('<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>');
const FILM = lucide('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>');
const MEGAPHONE = lucide('<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>');
const SLACK = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-plain.svg";
const WORKFLOW = lucide('<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>');
const FILE_SEARCH = lucide('<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="m9 18-1.5-1.5"/><circle cx="5" cy="14" r="3"/>');
const SEARCH = lucide('<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>');
const BINARY = lucide('<rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2v6"/><path d="M14 4h2v6"/>');
const TERMINAL = lucide('<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>');
const BRACES = lucide('<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>');
const ACTIVITY = lucide('<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>');
const REPEAT = lucide('<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>');
const LAYOUT_GRID = lucide('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>');
const MONITOR_PHONE = lucide('<path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"/><path d="M7 19h5"/><rect width="6" height="10" x="16" y="12" rx="2"/>');
const TREE = lucide('<path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/>');
const CREDIT_CARD = lucide('<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>');
const BOOK = lucide('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>');
const PACKAGE = lucide('<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>');
// Soft-skill glyphs (lucide).
const SIGMA = lucide('<path d="M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2"/>');
const PUZZLE = lucide('<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>');
const MIC = lucide('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>');
const CLOCK = lucide('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>');
const KANBAN = lucide('<path d="M6 5v11"/><path d="M12 5v6"/><path d="M18 5v14"/>');
const MESSAGE = lucide('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>');
const USERS = lucide('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>');
const FLAG = lucide('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>');
const CHART_LINE = lucide('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>');
const LIGHTBULB = lucide('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>');
/** OpenAI blossom logomark (filled) as a data-URI SVG. */
const OPENAI =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7462-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>',
  );

const CUSTOM: Record<string, string> = {
  Elysia: "https://elysiajs.com/assets/elysia.svg",
  "CI/CD": INFINITY,
  Assembly: CPU,
  Uvicorn: ROCKET,
  Hapi: SERVER,
  Echo: ZAP,
  Gorm: DATABASE,
  "REST API": WAYPOINTS,
  "Authentication & Authorization (JWT, Supabase Auth, RLS)": SHIELD,
  "LLM Integration": BRAIN,
  "OpenAI API": OPENAI,
  "GPT-4o Vision": EYE,
  Slack: SLACK,
  "CRM (GoHighLevel)": TRENDING_UP,
  StoreLeads: STORE,
  Clay: LAYERS,
  HeyReach: SEND,
  Sandcastles: IMAGE,
  Remotion: PLAY,
  OpusClip: SCISSORS,
  Higgsfield: FILM,
  Omnisocials: MEGAPHONE,
  "AI & Automation": WORKFLOW,
  RAG: FILE_SEARCH,
  "Vector Search": SEARCH,
  "Embeddings & Semantic Search": BINARY,
  "Prompt Engineering & Caching": TERMINAL,
  "Structured Output (JSON)": BRACES,
  "Token Streaming (SSE)": ACTIVITY,
  "Async Programming": REPEAT,
  "Clean Architecture": LAYOUT_GRID,
  "Responsive Design": MONITOR_PHONE,
  DOM: TREE,
  "PL/SQL": DATABASE,
  Oracle: DATABASE,
  "Payment Gateway": CREDIT_CARD,
  "Payment Gateway (Xendit, Stripe, Midtrans)": CREDIT_CARD,
  "Product Knowledge": BOOK,
  "Product Development": PACKAGE,
  "AI Agent": ROBOT,
  Webhooks: WEBHOOK,
  Java: JAVA,
  MATLAB: MATLAB,
  "Azure App Service": AZURE,
  "Azure Vector Search": AZURE,
  "Azure Blob Storage": AZURE,
  "Azure OpenAI": AZURE,
  "Azure Foundry": AZURE,
  "Microsoft Azure": AZURE,
  Azure: AZURE,
  // Soft skills
  Algorithms: BINARY,
  "Computational Complexity": SIGMA,
  "Advanced Problem Solving": PUZZLE,
  "Public Speaking": MIC,
  "Time Management": CLOCK,
  "Project Management": KANBAN,
  Communication: MESSAGE,
  Teamwork: USERS,
  Leadership: FLAG,
  "Analytical Thinking": CHART_LINE,
  "Critical Thinking": LIGHTBULB,
  // Project-stack labels not covered above
  "OpenAI Embeddings": OPENAI,
  "GPT-4": OPENAI,
  "Prompt Eng.": TERMINAL,
  GoHighLevel: TRENDING_UP,
  CRM: TRENDING_UP,
  OmniSocials: MEGAPHONE,
  Midtrans: CREDIT_CARD,
  ML: BRAIN,
};

/** Labels whose logo must render as a full-colour image, NOT a monochrome mask
 *  (e.g. the Elysia fox sits inside a filled circle, so a mask collapses to a
 *  blob). Rendered as <img> by TagIcon instead. */
const FULL_COLOR = new Set<string>(["Elysia"]);

/** True if the label's icon should render as a full-colour <img> (not a mask). */
export function isColorIcon(label: string): boolean {
  return FULL_COLOR.has(label);
}

/** Generic fallback glyph (4-point sparkle) for labels without a brand logo. */
const GENERIC =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>',
  );

/** Returns a mask-image URL for a label: the brand logo if known, else a
 *  generic sparkle so every chip carries an icon. */
export function techIcon(label: string): string {
  if (CUSTOM[label]) return CUSTOM[label];
  const slug = SLUG[label];
  return slug ? `https://cdn.simpleicons.org/${slug}` : GENERIC;
}
