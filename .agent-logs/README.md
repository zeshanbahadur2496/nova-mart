# Agent Logs

This directory contains **coding-agent session logs** for the Amazon Clone project, exported from Cursor for assignment submission and review.

## Contents

- `index.md` — session index
- `sessions/amazon-clone-build-session.md` — human-readable session summary
- `sessions/597f4701-e26d-46e2-a867-3b6933ece700.jsonl` — raw agent transcript (secrets redacted)

## Agent

- **Tool:** Cursor IDE coding agent (Composer)
- **User:** zeshanbahadur2496
- **Repository:** https://github.com/zeshanbahadur2496/amazon-clone

## Privacy

Passwords, tokens, and API keys are redacted in exported logs. Do not commit `.env` or `.env.local`.

## Regenerate

```bash
node scripts/export-agent-logs.mjs
```
