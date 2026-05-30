# Release Plan — Neon Auth Astro Demo

**Versioning:** `git tag v0.0.0` at repo creation → semantic-release auto-bumps per epic → `v1.0.0` at MVP.

Each epic is a vertical slice: after completing it, the demo has a new set of testable, working pages.

---

## Epic 0.1 — Scaffold & Neon Connection → v0.1.0

**Context:** Bare Astro SSR project with Netlify adapter, wired to Neon Auth and Neon DB. Health-check page proves both connections work. Semantic-release and CI/CD operational from first commit.

### Story 0.1.1: Initialize Astro SSR project

**type:** feat  
**context:** infra

Create the Astro project structure with SSR enabled, Netlify adapter configured, and all dependencies installed.

Steps:
1. Write `package.json` with Astro 5+, `@astrojs/netlify`, `@danielvm/neon-astro-auth`, `@neondatabase/serverless`, Vitest, Playwright → verify: `node -e "require('./package.json').dependencies['astro']"`
2. Write `astro.config.mjs` with `adapter: netlify()` and `output: 'server'` → verify: `node -e "const c = require('./astro.config.mjs'); console.log(c.default.adapter.name)"`
3. Write `tsconfig.json` with strict mode, ESM, Astro base → verify: `npx astro check --no-emit || true`
4. Install dependencies → verify: `test -d node_modules/astro && test -d node_modules/@danielvm/neon-astro-auth`
5. Write `src/pages/index.astro` — minimal "Hello" page → verify: `npx astro build && test -f dist/_astro/index.html`

### Story 0.1.2: Configure neonAuth() integration

**type:** feat  
**context:** infra

Add `neonAuth()` integration to `astro.config.mjs`.

Steps:
1. Import `neonAuth` from `@danielvm/neon-astro-auth` in astro.config.mjs → verify: `grep -q 'neonAuth' astro.config.mjs`
2. Add `neonAuth()` to integrations array → verify: `grep -q 'neonAuth()' astro.config.mjs`
3. Build succeeds with integration → verify: `npx astro build`

### Story 0.1.3: Environment variable wiring

**type:** feat  
**context:** infra

Set up `.env.example` with all required variables and validate them at startup.

Steps:
1. Write `.env.example` with `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `DATABASE_URL` → verify: `grep -c '=' .env.example | grep -q 3`
2. Write `src/env.d.ts` for Astro env types → verify: `grep -q 'NEON_AUTH_BASE_URL' src/env.d.ts`
3. Add `.env` to `.gitignore` → verify: `grep -q '.env' .gitignore`
4. Build fails gracefully when env vars are missing → verify: `(unset NEON_AUTH_BASE_URL && npx astro build 2>&1) | grep -qi 'missing\|required\|env'`

### Story 0.1.4: Neon DB connection helper

**type:** feat  
**context:** domain

Create a server-side DB client using `@neondatabase/serverless`.

Steps:
1. Write `src/db.ts` exporting a `sql` tagged template helper → verify: `grep -q 'export.*sql' src/db.ts`
2. Vitest unit test: `sql` helper returns a function → verify: `npx vitest run src/db.test.ts`
3. Build with DB import works → verify: `npx astro build`

### Story 0.1.5: Home page health check

**type:** feat  
**context:** domain

Home page pings both Neon Auth (adapter wired) and Neon DB (connection alive).

Steps:
1. Update `src/pages/index.astro` to SSR-ping DB (`SELECT 1`) → verify: `curl -s http://localhost:4321/ 2>/dev/null | grep -q 'connected\|healthy\|ok'`
2. Show adapter status (env var presence check) → verify: `curl -s http://localhost:4321/ 2>/dev/null | grep -q 'auth'`
3. Vitest: page renders without error → verify: `npx vitest run src/pages/index.test.ts`

### Story 0.1.6: CI/CD with semantic-release

**type:** feat  
**context:** infra

GitHub Actions workflow for build + test + semantic-release. Runs on push to `main`.

Steps:
1. Write `.github/workflows/release.yml` — checkout, install, build, test, semantic-release → verify: `test -f .github/workflows/release.yml`
2. Write `.releaserc` — commit-analyzer, release-notes-generator, git (tag-only, no npm publish) → verify: `test -f .releaserc && grep -q 'git' .releaserc`
3. Write `commitlint.config.js` extending `@commitlint/config-conventional` → verify: `test -f commitlint.config.js`
4. Write `.husky/commit-msg` hook → verify: `test -f .husky/commit-msg && test -x .husky/commit-msg`
5. Write `netlify.toml` → verify: `test -f netlify.toml && grep -q 'command' netlify.toml`

### Story 0.1.7: Playwright E2E scaffold

**type:** feat  
**context:** infra

Set up Playwright and write the first smoke test.

Steps:
1. Write `playwright.config.ts` → verify: `test -f playwright.config.ts`
2. Write `e2e/home.spec.ts` — page loads, status 200 → verify: `npx playwright test e2e/home.spec.ts`
3. CI workflow runs Playwright → verify: `grep -q 'playwright' .github/workflows/release.yml`

### Verification Script (Epic 0.1)

1. `cp .env.example .env` and fill in real Neon project values
2. `npm install` (or `pnpm install`)
3. `npx astro dev` → open http://localhost:4321 → see "Adapter online + DB connected"
4. `npx vitest run` → all tests pass
5. `npx playwright test` → home page E2E passes
6. `npx astro build` → builds without error

### Out of Scope (Epic 0.1)

- Auth pages (login, signup) — Epic 0.2
- Protected routes — Epic 0.3
- Styling beyond functional layout

### Risks

- Neon project must be pre-created with Auth enabled and DVD Rental DB loaded
- `@danielvm/neon-astro-auth` must be published to npm (v1.0.1+)
- Netlify adapter config must match deployment target

---

## Epic 0.2 — Auth UI → v0.2.0

**Context:** Public auth pages for login and signup using the Better Auth client. User can register and log in. Session cookies are set and validated.

### Story 0.2.1: Auth client helper

**type:** feat  
**context:** domain

Create a shared auth client for browser-side use.

Steps:
1. Write `src/auth-client.ts` using `createAuthClient` from `@danielvm/neon-astro-auth` → verify: `grep -q 'createAuthClient' src/auth-client.ts`
2. Vitest: exports `signIn`, `signUp`, `signOut`, `getSession` shape → verify: `npx vitest run src/auth-client.test.ts`

### Story 0.2.2: Login page

**type:** feat  
**context:** domain

`/login` — email/password form. Submits via `signIn.email()`. Redirects to `/dashboard` on success.

Steps:
1. Write `src/pages/login.astro` with form → verify: `curl -s http://localhost:4321/login | grep -q '<form'`
2. Form submits to client-side handler using `signIn.email()` → verify: Playwright fills form, observes redirect
3. Error message shown on invalid credentials → verify: Playwright submits bad creds, sees error text

### Story 0.2.3: Signup page

**type:** feat  
**context:** domain

`/signup` — email/password/name form. Submits via `signUp.email()`. Redirects to `/login` on success.

Steps:
1. Write `src/pages/signup.astro` with form → verify: `curl -s http://localhost:4321/signup | grep -q '<form'`
2. Form submits to client-side handler using `signUp.email()` → verify: Playwright fills form, observes redirect to `/login`
3. Error message shown on duplicate email → verify: Playwright submits existing email, sees error text

### Story 0.2.4: Middleware wired (skip auth routes)

**type:** feat  
**context:** infra

Middleware configured to skip `/login`, `/signup`, and API auth routes.

Steps:
1. Write `src/middleware.ts` using `createAstroAuth` from `@danielvm/neon-astro-auth` → verify: `grep -q 'createAstroAuth' src/middleware.ts`
2. Login page accessible without auth → verify: `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/login` returns 200

### Story 0.2.5: Playwright E2E — register & login

**type:** feat  
**context:** infra

Full E2E test: register new user → redirected to login → login → cookies set → redirect to `/dashboard`.

Steps:
1. Write `e2e/auth.spec.ts` covering register + login flow → verify: `npx playwright test e2e/auth.spec.ts`

### Verification Script (Epic 0.2)

1. `npx astro dev`
2. Visit `/signup` → fill form → submit → redirected to `/login`
3. Visit `/login` → fill credentials → submit → redirected to `/dashboard`
4. Check browser cookies: `__Secure-neon-auth.session_token` is set
5. `npx playwright test e2e/auth.spec.ts` → passes

### Out of Scope (Epic 0.2)

- Dashboard content — Epic 0.3
- Password reset flow
- Email verification

### Risks

- Requires real Neon Auth project with email/password provider enabled
- Session token cookie name must match adapter config

---

## Epic 0.3 — Protected SSR + Neon DB → v0.3.0

**Context:** Protected pages behind middleware. Dashboard shows film catalog from Neon DB. Film detail page joins actor data. API endpoint returns film JSON.

### Story 0.3.1: Dashboard page (protected)

**type:** feat  
**context:** domain

`/dashboard` — SSR page. Middleware-protected, redirects to `/login` if no valid session. Shows "Welcome, [email]" and film catalog.

Steps:
1. Write `src/pages/dashboard.astro` — SSR, queries DB for film list → verify: `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/dashboard` returns 302 (redirect to login)
2. Authenticated request shows film list → verify: Playwright: login, then visit `/dashboard`, sees film titles
3. Vitest: dashboard fetches film data → verify: `npx vitest run src/pages/dashboard.test.ts`

### Story 0.3.2: Film detail page

**type:** feat  
**context:** domain

`/films/[id]` — SSR page. Joins `film` + `film_actor` + `actor` tables. Protected by middleware.

Steps:
1. Write `src/pages/films/[id].astro` — queries single film with actors → verify: `curl -s http://localhost:4321/films/1 | grep -q 'actor'`
2. 404 for invalid film ID → verify: `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/films/99999` returns 404
3. Vitest: film data shape correct → verify: `npx vitest run src/pages/films/`

### Story 0.3.3: Protected API endpoint

**type:** feat  
**context:** domain

`GET /api/films` — returns JSON array of films. Protected via route handler.

Steps:
1. Write `src/pages/api/films.ts` — queries DB, returns JSON → verify: `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/api/films` returns 302 (redirect if unauthenticated)
2. Authenticated request returns JSON → verify: `curl -s http://localhost:4321/api/films | jq '.[0].title'` returns film title
3. Vitest: API returns correct shape → verify: `npx vitest run src/pages/api/films.test.ts`

### Story 0.3.4: Session validation on server

**type:** feat  
**context:** infra

Middleware validates session token with upstream Neon Auth before allowing access.

Steps:
1. Middleware calls `GET /get-session` on upstream → verify: Vitest mock shows upstream call
2. Invalid/expired token → redirect to `/login` → verify: Playwright: manipulate cookie, visit `/dashboard`, sees redirect
3. Valid token → proceeds to page → verify: Playwright: login, visit `/dashboard`, status 200

### Story 0.3.5: Playwright E2E — protected routes

**type:** feat  
**context:** infra

Steps:
1. Write `e2e/protected.spec.ts` — unauthenticated redirect, authenticated access, film detail → verify: `npx playwright test e2e/protected.spec.ts`

### Verification Script (Epic 0.3)

1. `npx astro dev`
2. Visit `/dashboard` unauthenticated → redirects to `/login`
3. Login → visit `/dashboard` → see film catalog (titles)
4. Click a film → `/films/1` → see title + actors
5. Visit `/api/films` unauthenticated → redirect
6. Authenticated → `curl -H "Cookie: ..." http://localhost:4321/api/films | jq length` > 0
7. `npx playwright test e2e/protected.spec.ts` → passes

### Out of Scope (Epic 0.3)

- Pagination or search for films
- Write operations (POST to API) — Epic 0.4
- Client-side auth checks — Epic 0.4

---

## Epic 0.4 — Client Auth + Full Flows → v0.4.0

**Context:** Client-side session access, profile page, sign-out, navigation with auth state, and write API endpoint.

### Story 0.4.1: Profile page (client auth)

**type:** feat  
**context:** domain

`/profile` — uses `getSession()` in a client-side `<script>` to show user info.

Steps:
1. Write `src/pages/profile.astro` with client island → verify: `curl -s http://localhost:4321/profile | grep -q 'script'`
2. Client island calls `getSession()` and renders email → verify: Playwright: login, visit `/profile`, sees email
3. Unauthenticated shows "Not logged in" → verify: Playwright: visit `/profile` without login, sees not-logged-in state

### Story 0.4.2: Sign-out flow

**type:** feat  
**context:** domain

Sign-out button clears session and redirects.

Steps:
1. Add sign-out button (calls `signOut()`) → verify: Playwright: click sign-out, redirected to `/`
2. After sign-out, `/dashboard` redirects to `/login` → verify: Playwright: sign out, visit `/dashboard`, sees login redirect
3. Vitest: signOut clears client state → verify: `npx vitest run src/auth-client.test.ts`

### Story 0.4.3: Navigation with auth state

**type:** feat  
**context:** domain

Layout nav shows different links based on auth state: "Log in" / "Sign up" when logged out, "Dashboard" / "Profile" / "Sign out" when logged in.

Steps:
1. Write `src/layouts/Layout.astro` with conditional nav → verify: `grep -q 'getSession' src/layouts/Layout.astro`
2. Logged-out state shows "Login" link → verify: Playwright: visit `/`, see "Login" link
3. Logged-in state shows "Dashboard" and "Sign out" → verify: Playwright: login, visit `/`, see dashboard link

### Story 0.4.4: Error handling pages

**type:** feat  
**context:** domain

Graceful error states for common failures.

Steps:
1. Auth upstream unreachable → show "Service temporarily unavailable" → verify: Vitest simulates fetch failure
2. DB connection failure → show "Database error" page → verify: Vitest simulates DB timeout
3. Invalid film ID → 404 page → verify: Playwright: visit `/films/99999`, sees custom 404

### Story 0.4.5: POST API endpoint

**type:** feat  
**context:** domain

`POST /api/reviews` — protected endpoint that inserts a review into DB (or simulates write).

Steps:
1. Write `src/pages/api/reviews.ts` — POST handler behind auth → verify: `curl -s -o /dev/null -w '%{http_code}' -X POST http://localhost:4321/api/reviews` returns 302
2. Authenticated POST succeeds → verify: Playwright sends POST with session cookie, status 200

### Story 0.4.6: Playwright E2E — full user journey

**type:** feat  
**context:** infra

Steps:
1. Write `e2e/full-flow.spec.ts` — register → login → browse dashboard → view film → profile → POST review → sign out → login redirect → verify: `npx playwright test e2e/full-flow.spec.ts`

### Verification Script (Epic 0.4)

1. Navigate full flow: `/signup` → `/login` → `/dashboard` (sees films) → `/films/1` (sees actors) → `/profile` (sees email) → sign out → `/login` redirect
2. Nav shows correct links at each step
3. `POST /api/reviews` works when authenticated
4. `npx playwright test` → all tests pass

### Out of Scope (Epic 0.4)

- Production deployment — Epic 0.5
- README polish — Epic 0.5

---

## Epic 0.5 — Deploy & Document → v0.5.0

**Context:** Deploy to Netlify, configure all env vars, write developer adoption guide in README, final Playwright run against live URL.

### Story 0.5.1: Netlify deployment configuration

**type:** feat  
**context:** infra

Finalize `netlify.toml` and ensure SSR build works on Netlify.

Steps:
1. Write production-ready `netlify.toml` (build command, functions dir, redirects) → verify: `netlify build` succeeds
2. Deploy to Netlify → verify: `curl -s https://[site].netlify.app/` returns 200
3. Env vars configured on Netlify dashboard → verify: home page shows "connected" status

### Story 0.5.2: Live URL smoke test

**type:** feat  
**context:** infra

Full Playwright suite against deployed URL.

Steps:
1. Write `playwright.config.ts` with live URL project → verify: `grep -q 'netlify.app\|baseURL' playwright.config.ts`
2. Run E2E against live URL → verify: `npx playwright test --project=live` passes

### Story 0.5.3: README — developer adoption guide

**type:** docs  
**context:** infra

README follows "kickass" template: logo → description → demo link → features → prerequisites → getting started → project structure → deployment → built with → license.

Steps:
1. Write README.md with all sections → verify: `wc -l README.md` > 30
2. Check all links are valid → verify: `grep -oP 'https?://[^\s)]+' README.md | while read url; do curl -sI "$url" | head -1 | grep -q 200 || echo "BROKEN: $url"; done`

### Story 0.5.4: Final README links

**type:** docs  
**context:** infra

Link adapter repo and live demo in README.

Steps:
1. Add "Built with" section linking `@danielvm/neon-astro-auth` GitHub repo → verify: `grep -q 'neon-astro-adapter\|neon-astro-auth' README.md`
2. Add live demo URL badge → verify: `grep -q 'netlify' README.md`
3. Link to this demo's own GitHub repo → verify: `grep -q 'neon-astro-adapter-demo' README.md`

### Verification Script (Epic 0.5)

1. README is complete with all sections
2. Live Netlify URL works: health check, auth, DB queries all functional
3. `npx playwright test --project=live` passes against deployed URL
4. README links are valid

### Out of Scope (Epic 0.5)

- Custom domain (demo uses Netlify subdomain)
- Analytics or monitoring

---

## v1.0.0 — MVP Release

Tag `v1.0.0` manually after all epics pass verification.

- All 26 stories complete and verified
- Live demo at public Netlify URL
- Full Playwright suite passes (locally and against live)
- README adoption guide ready
- Semantic-release configured for future automated bumps

---

## Risks (All Epics)

| Risk | Mitigation |
|------|------------|
| Neon project not pre-configured | Document prerequisites clearly in README |
| `@danielvm/neon-astro-auth` API changes | Pin exact version in package.json |
| DVD Rental DB not loaded in Neon | Document SQL load steps in README |
| Playwright + Astro SSR timing issues | Use `waitForURL` / `waitForSelector` patterns |
| Netlify function timeout on DB queries | Use Neon serverless HTTP driver (fast cold start) |
