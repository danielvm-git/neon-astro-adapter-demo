# Ubiquitous Language — Neon Auth Astro Demo

Canonical terms for this project. Use these consistently in specs, code, and conversations.

## Core Concepts

| Term | Definition |
|------|------------|
| **Adapter** | The `@danielvm/neon-astro-auth` npm package. Bridges Astro's runtime to Neon Auth's Better Auth server. NOT a database adapter — it adapts auth. |
| **Neon Auth** | Neon's managed authentication service built on Better Auth. Provides the auth server that both the adapter and client talk to. |
| **Better Auth** | The open-source authentication framework that Neon Auth is built on. The adapter wraps Better Auth's server and client SDKs. |
| **Neon DB** | Neon's serverless PostgreSQL. The demo queries it for film data and writes reviews. |
| **Neon platform** | The umbrella for Neon Auth + Neon DB + Neon console. The demo uses both Neon services. |

## Adapter API

| Term | Definition |
|------|------------|
| **createAstroAuth** | Server-side factory from `@danielvm/neon-astro-auth/server`. Returns `{ middleware(), handler(), auth }`. Used in `src/middleware.ts`. |
| **createAuthClient** | Browser-side factory from `@danielvm/neon-astro-auth`. Wraps Better Auth's client SDK. Used in client-side `<script>` tags. |
| **neonAuth()** | Astro integration function from `@danielvm/neon-astro-auth/integration`. Auto-wires routes and middleware in `astro.config.mjs`. |
| **Route handler** | The adapter's API proxy — forwards `/api/auth/[...slug]` requests to Neon Auth. Injected via `injectRoute` in `astro.config.mjs`. |
| **skipRoutes** | Array of URL patterns that bypass middleware auth checks. Currently: `["/", "/login", "/signup", "/api/health"]`. |

## Auth Domain

| Term | Definition |
|------|------------|
| **Session token** | A JWT stored in an HTTP-only cookie (`__Secure-neon-auth.session_token`). Set by Neon Auth after successful login. Validated by middleware on every protected request. |
| **Session validation** | The process of sending the session token to Neon Auth's `/get-session` endpoint and receiving user data (or an error). |
| **Auth guard** | The `getAuthMiddleware()` function in `src/middleware.ts`. Checks for required env vars before initializing the auth middleware. Returns a no-op if vars are missing. |
| **No-op middleware** | A pass-through middleware returned when auth env vars are missing. Calls `next()` without any auth check. |
| **Protected route** | Any page or API endpoint that requires a valid session. Unauthenticated requests receive a 302 redirect to `/login`. |
| **Public route** | Any page accessible without authentication. Currently: `/`, `/login`, `/signup`, `/api/health`. |

## Demo Pages

| Term | Definition |
|------|------------|
| **Home page** | `/` — SSR page showing health status of Neon Auth (configured/missing) and Neon DB (connected/unavailable). |
| **Login page** | `/login` — Email/password sign-in form. Submits via `signIn.email()` from the auth client. Redirects to `/dashboard` on success. |
| **Signup page** | `/signup` — Registration form (email, password, name). Submits via `signUp.email()`. Redirects to `/login` on success. |
| **Dashboard** | `/dashboard` — SSR-protected page. Shows "Welcome, [email]" and a film catalog queried from Neon DB. |
| **Film detail** | `/films/[id]` — SSR-protected page. Shows a single film with its actors (joined from film_actor + actor tables). |
| **Profile** | `/profile` — Client-side auth page. Uses `getSession()` in a browser `<script>` to display user info. |
| **Health API** | `GET /api/health` — Public JSON endpoint returning `{ db, auth }` status. Used for monitoring. |
| **Films API** | `GET /api/films` — Protected JSON endpoint returning film array. |
| **Reviews API** | `POST /api/reviews` — Protected endpoint for submitting film reviews. Schema TBD. |

## Infrastructure

| Term | Definition |
|------|------------|
| **SSR function** | A Netlify serverless function that runs Astro's SSR runtime. Every page request invokes this function. |
| **DVD Rental** | PostgreSQL sample dataset from the official PG docs. Pre-loaded into Neon DB. The demo uses `film`, `actor`, and `film_actor` tables. |
| **Health check** | The `getHealthStatus()` function in `src/health-check.ts`. Pings Neon DB with `SELECT 1` and checks auth env var presence. Returns `HealthStatus` object. |
| **Graceful degradation** | The app's ability to serve pages when a dependency (Neon Auth, Neon DB) is unavailable. The home page and health API show status without crashing. |
| **Preflight** | The `npm run preflight` command — runs typecheck → unit tests → build → E2E in sequence. Used as a quality gate before commits. |

## Release Management

| Term | Definition |
|------|------------|
| **Epic** | A vertical slice producing testable pages. Numbered 0.1–0.5. Each epic has its own version tag (v0.1.0–v0.5.0). |
| **Story** | A single testable unit of work within an epic. Numbered like 0.2.3. Each follows TDD: RED → GREEN → REFACTOR. |
| **Vertical slice** | A complete, testable piece of functionality that spans all layers (page → middleware → adapter → Neon). No "horizontal" layers built in isolation. |
