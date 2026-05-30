# Scope — Neon Auth Astro Demo

## Vision

A reference Astro 5+ demo site showing developers exactly how to integrate **Neon Auth** and **Neon DB** into their Astro projects. The demo is a living, deployed site on Netlify that follows the same steps a real developer would take. Every page demonstrates a different integration pattern: SSR middleware protection, server-side DB queries, client-side session management, API route handlers, and full auth flows.

## In Scope

### Epics (6 vertical slices, each producing testable pages)

| Epic   | Version | What                                |
|--------|---------|-------------------------------------|
| 0.1    | v0.1.0  | Astro scaffold + Neon connection    |
| 0.2    | v0.2.0  | Auth UI (login, signup)             |
| 0.3    | v0.3.0  | Protected SSR + Neon DB film catalog|
| 0.4    | v0.4.0  | Client auth + full navigation flows |
| 0.5    | v0.5.0  | Netlify deploy + README guide       |
| 1.0    | v1.0.0  | MVP release                         |

### Pages

| Route           | Auth Required | Pattern Demonstrated         |
|-----------------|---------------|------------------------------|
| `/`             | No            | Home + health check + film catalog |
| `/login`        | No            | Email/password sign-in form  |
| `/signup`       | No            | Registration form            |
| `/dashboard`    | Yes (SSR)     | Protected page + DB query    |
| `/films/[id]`   | Yes (SSR)     | Film detail with actor joins |
| `/profile`      | Yes (client)  | Client-side getSession()     |
| `/api/films`    | Yes (handler) | API endpoint + DB query      |

### Tech Stack

- Astro 5+ (SSR mode) with `@astrojs/netlify`
- `@danielvm/neon-astro-auth` for auth (adapter + middleware + client)
- `@neondatabase/serverless` for DB queries
- Neon PostgreSQL with DVD Rental sample database (`film`, `actor`, `film_actor` tables)
- Vitest for unit tests, Playwright for E2E
- Netlify for hosting
- Semantic-release for version bumps, tag format `v${version}`

### Testing

- Playwright E2E tests for every epic (full user flows)
- Vitest unit tests for DB helpers and middleware logic
- CI runs typecheck → unit tests → build → E2E

### Documentation

- README.md following "kickass" template: prerequisites → install → config → pages → deploy
- Code is self-documenting (no inline comments, per CONVENTIONS.md)
- Live demo URL linked in README

## Out of Scope

- Multi-tenancy or organization-level auth
- Social login (GitHub, Google, etc.) — email/password only
- Admin dashboard or user management
- Billing, payments, or subscription tiers
- Non-Astro frameworks (Next.js, Nuxt, etc.)
- CSS framework (no Tailwind, Bootstrap — minimal vanilla CSS)
- Mobile app or PWA features
- Real-time features (WebSockets, SSE)
- All 15 DVD Rental tables — only `film`, `actor`, `film_actor`
- Database migrations or schema evolution
- Production monitoring or observability (beyond Netlify defaults)

## Constraints

- Astro 5+ only (no v4 backwards compat)
- ESM-only (no CommonJS)
- Deployed to Netlify (not Vercel, Cloudflare, or Neon direct)
- `@danielvm/neon-astro-auth` from npm registry (not local `file:` link)
- Node 22+ runtime
- All env vars via Netlify dashboard, NEVER committed
- Conventional Commits enforced by commitlint + Husky

## Success Criteria

1. Live demo accessible at a public Netlify URL
2. User can register → login → browse films → view profile → sign out
3. Unauthenticated requests to `/dashboard` redirect to `/login`
4. `GET /api/films` returns JSON only when authenticated
5. All Playwright E2E tests pass in CI
6. README explains the exact steps a developer follows to adopt `@danielvm/neon-astro-auth`
7. Version tag `v1.0.0` created when MVP is complete
