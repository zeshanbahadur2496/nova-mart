import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const logsDir = join(repoRoot, ".agent-logs");
const sessionsDir = join(logsDir, "sessions");

const transcriptPath =
  process.env.AGENT_TRANSCRIPT ??
  join(
    process.env.USERPROFILE ?? "",
    ".cursor",
    "projects",
    "c-Users-DevOasis-Desktop-Amazon-Clone-amazon-clone-nextjs",
    "agent-transcripts",
    "597f4701-e26d-46e2-a867-3b6933ece700",
    "597f4701-e26d-46e2-a867-3b6933ece700.jsonl"
  );

function redact(text) {
  return text
    .replace(/ghp_[A-Za-z0-9]+/g, "[REDACTED_GITHUB_PAT]")
    .replace(/mongodb\+srv:\/\/[^@\s"]+@/g, "mongodb+srv://[REDACTED]@")
    .replace(/sk_(live|test)_[A-Za-z0-9]+/g, "[REDACTED_STRIPE_KEY]")
    .replace(/pk_(live|test)_[A-Za-z0-9]+/g, "[REDACTED_STRIPE_KEY]");
}

mkdirSync(sessionsDir, { recursive: true });

const sessionId = "597f4701-e26d-46e2-a867-3b6933ece700";
const raw = readFileSync(transcriptPath, "utf8");
const sanitized = redact(raw);
writeFileSync(join(sessionsDir, `${sessionId}.jsonl`), sanitized, "utf8");

const lines = sanitized.split(/\r?\n/).filter(Boolean);
const entries = lines.map((line) => {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}).filter(Boolean);

const userTurns = entries.filter((e) => e.role === "user");
const assistantSummaries = entries
  .filter((e) => e.role === "assistant")
  .map((e) => {
    const text = e.message?.content?.find((c) => c.type === "text")?.text ?? "";
    const cleaned = text.replace(/\[REDACTED\]/g, "").trim();
    return cleaned.split("\n").find((line) => line.trim() && !line.startsWith("[")) ?? "";
  })
  .filter(Boolean);

const markdown = `# Coding Agent Session — Amazon Clone

- **Session ID:** \`${sessionId}\`
- **Agent:** Cursor (Composer)
- **Repository:** amazon-clone-nextjs
- **GitHub:** https://github.com/zeshanbahadur2496/amazon-clone
- **Author:** zeshanbahadur2496
- **Started:** 2026-09-14
- **Raw log:** \`sessions/${sessionId}.jsonl\`

## Summary

This session used a coding agent to build, debug, deploy, and harden a full-stack Amazon-style e-commerce app with Next.js 15, Prisma, MongoDB Atlas, NextAuth, and Stripe.

## User requests

${userTurns
  .map((turn, i) => {
    const text = turn.message?.content?.find((c) => c.type === "text")?.text ?? "";
    const query = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    return `${i + 1}. ${query.slice(0, 500)}${query.length > 500 ? "..." : ""}`;
  })
  .join("\n")}

## Major outcomes

- Fixed Prisma seed upsert error and started dev server successfully
- Implemented global market system (pricing, delivery, country selector)
- Rebuilt home page with Amazon-style grid and product strips
- Implemented checkout, auth, admin, search, Prime, and order tracking features
- Pushed project to GitHub under \`zeshanbahadur2496/amazon-clone\`
- Fixed Vercel build issues (TypeScript, Suspense, auth, DB timeouts)
- Diagnosed production login failures as MongoDB Atlas network access from Vercel

## Key files touched

- \`scripts/seed.ts\` — seed fix
- \`lib/markets.ts\`, \`lib/pricing.ts\`, \`lib/db-query.ts\` — global markets + performance
- \`components/home/*\`, \`app/page.tsx\` — Amazon-style home
- \`app/api/checkout/route.ts\`, \`components/cart/checkout-form.tsx\` — checkout fixes
- \`app/reset-password/page.tsx\`, \`app/verify-email/page.tsx\` — Suspense fixes
- \`lib/auth.ts\` — production auth hardening

## Commits referenced

- \`first commit\` — initial repository push
- \`fix/vercel-checkout-build\` branch — deployment fixes

## Notes

Secrets (PAT, database passwords, API keys) are redacted in exported logs.
`;

writeFileSync(join(sessionsDir, "amazon-clone-build-session.md"), markdown, "utf8");

const index = `# Agent Logs Index

| Session | Date | Summary | Files |
| --- | --- | --- | --- |
| [amazon-clone-build-session](sessions/amazon-clone-build-session.md) | 2026-09-14 → 2026-09-16 | Full Amazon clone build, deploy, and Vercel fixes | \`${sessionId}.jsonl\`, markdown summary |

Total user turns: ${userTurns.length}
Total assistant turns: ${entries.filter((e) => e.role === "assistant").length}
`;

writeFileSync(join(logsDir, "index.md"), index, "utf8");

console.log(`Exported ${lines.length} log lines to .agent-logs/`);
