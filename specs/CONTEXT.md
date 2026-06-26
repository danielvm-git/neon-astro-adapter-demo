# Context — Neon Auth Astro Demo

Reference demo site showcasing `@danielvm/neon-astro-auth` (the adapter) with Astro 5+ and Neon DB. Live on Netlify.

## Architecture Overview

```
Browser                          Netlify SSR Function                 Neon Cloud
┌──────────┐                    ┌─────────────────────┐             ┌──────────────┐
│          │  HTTP request      │  Astro SSR           │             │              │
│  Client  │ ─────────────────> │  ┌───────────────┐   │             │  Neon Auth   │
│  (JS)    │                    │  │  middleware.ts │───┼── session ──>│  Server      │
│          │                    │  │  (createAstro  │   │   validation │  (Better     │
│  create  │                    │  │   Auth)        │<──┼─────────────│   Auth)      │
│  Auth    │                    │  └───────────────┘   │             │              │
│  Client()│                    │         │            │             └──────────────┘
│          │                    │         v            │
│    │     │                    │  ┌───────────────┐   │             ┌──────────────┐
│    │     │  direct HTTP call  │  │  pages/*.astro │   │             │              │
│    └─────┼───────────────────>│  │  api/*.ts      │───┼── query ───>│  Neon DB     │
│          │  to auth server    │  │  (sql tagged   │   │             │  (Postgres)  │
│          │                    │  │   template)    │<──┼─────────────│              │
└──────────┘                    │  └───────────────┘   │             └──────────────┘
                                └─────────────────────┘
```

**Two auth paths, one auth server:**
- **Server-side**: Middleware (`createAstroAuth`) validates session tokens with Neon Auth on every protected request
- **Client-side**: `createAuthClient()` from the adapter makes independent HTTP calls to Neon Auth from the browser
- Both paths talk to the same Neon Auth (Better Auth) server — the adapter proxies server calls, the client calls directly

## Module Map

| Module | Path | Purpose | Status |
|--------|------|---------|--------|
| Middleware | `src/middleware.ts` | Request logging + auth guard + session validation | ✅ Done |
| Health Check | `src/health-check.ts` | DB ping + auth config check, returns `HealthStatus` | ✅ Done |
| DB Client | `src/db.ts` | Lazy-initialized `neon()` tagged template helper | ✅ Done |
| Logger | `src/lib/logger.ts` | Pino logger with request ID child loggers | ✅ Done |
| Layout | `src/layouts/Layout.astro` | Base HTML shell with nav (static links only) | ✅ Done |
| Home Page | `src/pages/index.astro` | SSR health status display | ✅ Done |
| Health API | `src/pages/api/health.ts` | `GET /api/health` — JSON health status | ✅ Done |
| Auth Client | `src/auth-client.ts` | Browser-side `createAuthClient` wrapper | ❌ Not built |
| Login Page | `src/pages/login.astro` | Email/password sign-in form | ❌ Not built |
| Signup Page | `src/pages/signup.astro` | Registration form | ❌ Not built |
| Dashboard | `src/pages/dashboard.astro` | Protected SSR page with film catalog | ❌ Not built |
| Film Detail | `src/pages/films/[id].astro` | Protected SSR film + actor detail | ❌ Not built |
| Films API | `src/pages/api/films.ts` | Protected `GET /api/films` JSON endpoint | ❌ Not built |
| Profile | `src/pages/profile.astro` | Client-side `getSession()` page | ❌ Not built |
| Reviews API | `src/pages/api/reviews.ts` | Protected `POST /api/reviews` endpoint | ❌ Not built |

## Request Lifecycle

```
1. Request arrives at Netlify SSR function
2. Astro boots, middleware.ts onRequest() fires
3. Request ID generated (crypto.randomUUID)
4. Logger created with requestId child
5. getAuthMiddleware() checks NEON_AUTH_BASE_URL + NEON_AUTH_COOKIE_SECRET
   ├── Missing → no-op middleware (passes through)
   └── Present → createAstroAuth() middleware validates session
       ├── Public route (/login, /signup, /api/health) → passes through
       └── Protected route → validates token with Neon Auth
           ├── Invalid → redirect to /login
           └── Valid → proceed to page handler
6. Page/API handler executes (SSR, DB queries)
7. Response logged with status + duration
```

## Adapter API Surface

The demo consumes `@danielvm/neon-astro-auth` v1.0.1+ via two entry points:

### Server-side (`@danielvm/neon-astro-auth/server`)
```ts
import { createAstroAuth } from "@danielvm/neon-astro-auth/server";

const auth = createAstroAuth({
  baseUrl: "...",        // Neon Auth server URL
  cookies: {
    secret: "...",       // Cookie signing secret (min 32 chars)
    sessionDataTtl: 600, // optional
    domain: "...",       // optional
    sameSite: "lax",     // optional
  },
  skipRoutes: ["/", "/login", "/signup", "/api/health"],
});

auth.middleware()  // → (ctx, next) => Promise<Response>
auth.handler()    // → { GET, POST, PUT, DELETE, PATCH } API route handlers
```

### Client-side (`@danielvm/neon-astro-auth`)
```ts
import { createAuthClient } from "@danielvm/neon-astro-auth";

const client = createAuthClient(url);
// → { signIn, signUp, signOut, getSession, ... } (Better Auth public API)
```

The client wraps `@neondatabase/auth`'s `createAuthClient`. It makes direct HTTP calls to the Neon Auth server from the browser.

### Integration (`@danielvm/neon-astro-auth/integration`)
```ts
import neonAuth from "@danielvm/neon-astro-auth/integration";

// In astro.config.mjs:
integrations: [neonAuth({ baseUrl: "...", cookies: { secret: "..." } })]
```

**Note:** The demo currently uses a manual route injection in `astro.config.mjs` rather than the `neonAuth()` integration function. This divergence is intentional — the demo shows the underlying pattern.

## Environment Variables

| Variable | Required | Used By |
|----------|----------|---------|
| `NEON_AUTH_BASE_URL` | For auth features | middleware.ts, health-check.ts, auth-client.ts |
| `NEON_AUTH_COOKIE_SECRET` | For auth features | middleware.ts (via createAstroAuth) |
| `DATABASE_URL` | For DB features | db.ts, health-check.ts |
| `LOG_LEVEL` | No (defaults to `info`) | lib/logger.ts |
| `NODE_ENV` | No | lib/logger.ts (pretty-print in non-prod) |

Variables are validated at startup by `getAuthMiddleware()` (auth) and the `sql` helper (DB). Missing auth vars result in graceful degradation (no-op middleware). Missing `DATABASE_URL` throws on first query.

## Database

Neon PostgreSQL with DVD Rental sample dataset pre-loaded. The demo queries three tables:

| Table | Access | Used In |
|-------|--------|---------|
| `film` | Read-only | Dashboard, film detail, films API |
| `actor` | Read-only | Film detail (joined via film_actor) |
| `film_actor` | Read-only | Film detail (join table) |
| `reviews` | Write | POST /api/reviews (Epic 0.4) — schema TBD |

Connection via `@neondatabase/serverless` HTTP driver. Lazy initialization on first query.

## Key Decisions

| Decision | Status | Notes |
|----------|--------|-------|
| Astro 5 SSR with Netlify adapter | Decided | Required for Neon Auth server-side validation |
| ESM-only, Node 22+ | Decided | Matches adapter and Astro requirements |
| Email/password auth only | Decided | No social login (Google, GitHub) in demo scope |
| DVD Rental dataset (film, actor, film_actor only) | Decided | Pre-loaded, read-only from demo perspective |
| Manual route injection over neonAuth() integration | Decided | Shows underlying mechanism to developers |
| Graceful degradation for missing auth vars | **Open** | Currently no-op middleware. Should it hard-error in production? |
| Reviews table schema | **Open** | Needs definition before Epic 0.4 Story 0.4.5 |
| Cookie sameSite policy | Decided | `lax` (adapter default) |

## Test Infrastructure

| Layer | Tool | Location | Files |
|-------|------|----------|-------|
| Unit/Vitest | Vitest 4 | `src/__tests__/`, `src/*.test.ts` | 5 files, 9 tests |
| E2E | Playwright 1.52 | `e2e/` | 1 file (home.spec.ts) |
| Typecheck | `astro check` | — | CI + preflight |
| CI | GitHub Actions | `.github/workflows/release.yml` | Build + test + semantic-release |
