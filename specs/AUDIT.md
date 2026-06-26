# Plan Quality Audit — RELEASE-PLAN.md

Audited 2026-05-31 against actual codebase, adapter API surface, and CONVENTIONS.md.

## Critical Issues

### C1. Auth client wiring gap — Stories 0.2.1, 0.2.2, 0.2.3, 0.4.1, 0.4.3

`createAuthClient(url)` requires the Neon Auth base URL. The plan never addresses how the browser gets this URL:
- It's an env var (`NEON_AUTH_BASE_URL`) only available server-side
- The client-side `<script>` can't read `import.meta.env`
- Needs a server→client injection mechanism (data attribute, inline script, or public endpoint)

**Impact:** Story 0.2.1 can't be implemented as written. The `url` parameter source must be specified.

### C2. Story 0.2.5 cross-epic dependency

The E2E test flow is: "register → redirected to login → login → cookies set → **redirect to /dashboard**"

`/dashboard` doesn't exist until Epic 0.3. The redirect will 404 (or 302-loop). Either:
- Make `/dashboard` a stub page in Epic 0.2
- Change the redirect target for Epic 0.2 E2E to a page that exists (e.g., `/`)
- Mark the dependency explicitly

### C3. Story 0.1.2 plan/implementation divergence

Plan says: `neonAuth()` integration function from `@danielvm/neon-astro-auth/integration`
Code does: Manual `injectRoute` integration object with name `"neon-auth-route-handler"`

The verify command `grep -q 'neonAuth' astro.config.mjs` **fails** on current code because the string doesn't appear as a function call. This is an intentional divergence (per CONTEXT.md), but the plan wasn't updated to match.

### C4. Untestable verify commands — Stories 0.3.1, 0.3.3, 0.3.4

These verifies require real Neon Auth credentials:
- `curl localhost:4321/dashboard` → 302 (needs middleware with real auth server)
- `curl localhost:4321/api/films | jq '.[0].title'` → needs auth cookie
- Vitest "mock shows upstream call" — can't mock adapter internals per CONVENTIONS.md

**Impact:** CI can't verify these stories without a seeded Neon Auth project.

### C5. Story 0.1.3 step 4 verify is wrong for current behavior

Verify: `(unset NEON_AUTH_BASE_URL && npx astro build 2>&1) | grep -qi 'missing\|required\|env'`

The current middleware returns a **no-op** when env vars are missing (per BUG-2026-05-30T211620 fix). The build succeeds without error. This verify command expects a failure that doesn't happen.

---

## High Issues

### H1. Missing stories for implemented code

Three modules exist with tests but no corresponding story:

| Module | Test | Missing Story |
|--------|------|---------------|
| `src/health-check.ts` | Via `index.test.ts` and `health.test.ts` | No story covers health check logic |
| `src/pages/api/health.ts` | `src/__tests__/pages/api/health.test.ts` | No story covers health API endpoint |
| `src/lib/logger.ts` | `src/lib/logger.test.ts` | No story covers structured logging |

**Recommendation:** Either add stories or document them as "infrastructure, implicitly covered by Epic 0.1."

### H2. Story 0.2.2/0.2.3 assume SSR-renderable forms

Verify for 0.2.2 step 1: `curl localhost:4321/login | grep -q '<form'`

But login/signup pages use client-side `signIn.email()` / `signUp.email()` — the form may be in a `<script>` client island, not in SSR HTML. The verify may fail depending on implementation approach.

### H3. Story 0.1.5 step 1 verify doesn't match output

Verify: `grep -q 'connected\|healthy\|ok'`

Actual page output: `"Neon Auth: online"` and `"Neon DB: online"` — uses "online" not "connected" or "healthy". The verify command **fails** on the current page.

### H4. Story 0.3.3 confuses protection mechanism

Story says "Protected via route handler." The protection comes from **middleware**, not the API route handler. The route handler (`APIRoute`) just executes the query — middleware blocks unauthenticated requests before the handler runs.

---

## Medium Issues

### M1. Story 0.4.5 writes are underspecified

Story says: "inserts a review into DB (or simulates write)." The "or simulates" ambiguity + missing schema definition means:
- What columns does the `reviews` table have?
- What request body shape is expected?
- What validation rules apply?

This is captured as an open decision in CONTEXT.md but needs resolution before Epic 0.4.

### M2. No edge case coverage across all stories

Missing edge cases not addressed in any story:
- DB connection timeout mid-request (defensive code requirement per CONVENTIONS.md)
- Auth server returns 500 during session validation
- Concurrent requests (race condition on lazy DB client init)
- Input validation (email format, password length, film ID type)
- CSRF protection on login/signup forms
- CORS headers on API endpoints

### M3. Story 0.2.4 wording implies new file

Story says "Write `src/middleware.ts`" but the file already exists with skip routes configured. Should say "Verify existing middleware skip routes" or be marked as done.

### M4. Story 0.1.7 step 3 CI verify FAILS — confirmed

Verify: `grep -q 'playwright' .github/workflows/release.yml`

**Confirmed failing.** The CI workflow (`.github/workflows/release.yml`) has no Playwright step. It runs: checkout → install → typecheck → build → unit tests → semantic-release. No E2E tests.

### M5. No story for auth route handler injection

`astro.config.mjs` injects `/api/auth/[...slug]` route. No story explicitly covers this — it's lumped into 0.1.2 (neonAuth integration) but implemented differently.

---

## Low Issues

### L1. Verification scripts require human interaction

All epic verification scripts say "open http://localhost:4321" — not automatable. Playwright E2E tests cover these flows, but the manual steps are redundant.

### L2. Story 0.5.1 verify requires Netlify CLI

Verify: `netlify build` — but `netlify-cli` is not in `devDependencies`. No setup instructions for Netlify CLI.

### L3. Story 0.4.6 E2E is monolithic

The "full user journey" test covers 7 operations in one test. If any step fails, the entire test fails without indicating which step. Should be split or use `test.step()`.

### L4. Story count mismatch

Plan says "26 stories" total. TASKS.md counts 27 (including the pre-completed ones). Clarify which count is authoritative.

---

## Summary

| Severity | Count | Must-fix before implementation |
|----------|-------|-------------------------------|
| Critical | 5 | C1 (auth client URL wiring), C2 (cross-epic dep), C3 (plan/code divergence) |
| High | 4 | H1 (missing stories), H3 (wrong verify) |
| Medium | 5 | M1 (underspecified writes), M2 (missing edge cases) |
| Low | 4 | Nice-to-have polish |

## Recommended Actions

1. **Fix C1 immediately** — Define the client URL injection mechanism (e.g., `data-auth-url` attribute on `<body>`, or `window.__AUTH_URL__` global set via SSR). Update stories 0.2.1, 0.2.2, 0.2.3, 0.4.1, 0.4.3.

2. **Fix C2** — Add `/dashboard` as a stub page in Epic 0.2 (just shows "Welcome" without DB), or change the 0.2.5 E2E redirect target to `/`.

3. **Fix C3** — Update Story 0.1.2 to match the actual implementation (manual injectRoute), or update the code to use the `neonAuth()` integration. Mark the decision in RELEASE-PLAN.md.

4. **Fix H1** — Add stories for `health-check.ts`, `/api/health`, and `logger.ts` (or document them as infrastructure implicitly covered).

5. **Fix H3** — Update Story 0.1.5 verify to match actual output: `grep -q 'online'`

6. **Resolve open decisions** before Epic 0.4: graceful degradation policy, reviews table schema.
