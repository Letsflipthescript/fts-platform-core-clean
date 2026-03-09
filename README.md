# Flip The Script (FTS) — Platform v0.2

Next.js 14 App Router + TypeScript + Supabase. FTS-001 platform core + FTS-002 tokenized onboarding.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Set FTS_TOKEN_SECRET in .env.local
npm run dev
```

## Generate a test onboarding token

```bash
FTS_TOKEN_SECRET=my-dev-secret node scripts/gen-test-token.mjs
FTS_TOKEN_SECRET=my-dev-secret node scripts/gen-test-token.mjs pro
FTS_TOKEN_SECRET=my-dev-secret node scripts/gen-test-token.mjs elite
```

## Routes

| Route | Description |
|---|---|
| `GET /api/health` | Health check |
| `POST /api/onboarding/event` | Log onboarding event |
| `/onboarding/welcome?token=...` | Step 1 of 3 |
| `/onboarding/setup?token=...` | Step 2 of 3 |
| `/onboarding/menu?token=...` | Step 3 of 3 |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | For Supabase | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For Supabase | Anon key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | For Supabase writes | Service role key (server only) |
| `FTS_TOKEN_SECRET` | Yes | HMAC secret for token signing |
| `GHL_API_KEY` | For GHL features | GoHighLevel API key |

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

## Branch

`feat/FTS-002-onboarding`
