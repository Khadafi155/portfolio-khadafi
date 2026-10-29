// Asserts every chip label (project stack, skills, experience tags) has a real icon,
// not the generic sparkle. Run: node scripts/check-icons.mjs  (Node >= 23.6 runs .ts natively)
import { projects, skills, experience } from "../lib/portfolioData.ts";
import { techIcon } from "../lib/techIcons.ts";

const GENERIC = techIcon("\u0000no-such-label");
const labels = new Set([
  ...projects.flatMap((p) => p.stack),
  ...skills.flatMap((g) => g.items),
  ...experience.flatMap((e) => e.tags),
]);
const missing = [...labels].filter((l) => techIcon(l) === GENERIC);
console.log(`${labels.size} labels, ${missing.length} missing`, missing);
if (missing.length) process.exit(1);
