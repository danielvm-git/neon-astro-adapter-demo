# Tasks — Neon Auth Astro Demo

Independently-grabbable vertical slices. Status: ✅ done | ⬜ pending.

## Epic 0.1 — Scaffold & Neon Connection (v0.1.0)

| ID | Story | Status | Files | Test |
|----|-------|--------|-------|------|
| 0.1.1 | Initialize Astro SSR project | ✅ | `package.json`, `astro.config.mjs`, `tsconfig.json` | `npx astro build` |
| 0.1.2 | Configure neonAuth integration | ✅ | `astro.config.mjs` (injectRoute) | `npx astro build` |
| 0.1.3 | Environment variable wiring | ✅ | `.env.example`, `src/env.d.ts`, `.gitignore` | `grep NEON_AUTH .env.example` |
| 0.1.4 | Neon DB connection helper | ✅ | `src/db.ts`, `src/db.test.ts` | `npx vitest run src/db.test.ts` |
| 0.1.5 | Home page health check | ✅ | `src/pages/index.astro`, `src/health-check.ts`, `src/pages/api/health.ts` | `curl localhost:4321/api/health` |
| 0.1.6 | CI/CD with semantic-release | ✅ | `.github/workflows/release.yml`, `.releaserc`, `commitlint.config.js` | `test -f .releaserc` |
| 0.1.7 | Playwright E2E scaffold | ✅ | `playwright.config.ts`, `e2e/home.spec.ts` | `npx playwright test e2e/home.spec.ts` |

**Epic 0.1 complete.** All 7 stories done with tests.

---

## Epic 0.2 — Auth UI (v0.2.0)

| ID | Story | Status | Depends On | Files | Test |
|----|-------|--------|------------|-------|------|
| 0.2.1 | Auth client helper | ⬜ | 0.1.2 | `src/auth-client.ts`, `src/auth-client.test.ts` | `npx vitest run src/auth-client.test.ts` |
| 0.2.2 | Login page | ⬜ | 0.2.1 | `src/pages/login.astro` | Playwright: fill form, observe redirect |
| 0.2.3 | Signup page | ⬜ | 0.2.1 | `src/pages/signup.astro` | Playwright: fill form, observe redirect to /login |
| 0.2.4 | Middleware wired (skip auth routes) | ✅ | — | `src/middleware.ts` | `curl -o /dev/null -w '%{http_code}' localhost:4321/login` → 200 |
| 0.2.5 | Playwright E2E — register & login | ⬜ | 0.2.2, 0.2.3 | `e2e/auth.spec.ts` | `npx playwright test e2e/auth.spec.ts` |

**Note on 0.2.4:** Middleware already exists with skip routes configured. This story is verified. No new code needed unless the skip list changes.

---

## Epic 0.3 — Protected SSR + Neon DB (v0.3.0)

| ID | Story | Status | Depends On | Files | Test |
|----|-------|--------|------------|-------|------|
| 0.3.1 | Dashboard page (protected) | ⬜ | 0.2.4, 0.1.4 | `src/pages/dashboard.astro`, `src/pages/dashboard.test.ts` | Playwright: login → visit /dashboard → see films |
| 0.3.2 | Film detail page | ⬜ | 0.3.1, 0.1.4 | `src/pages/films/[id].astro` | `curl localhost:4321/films/1` → contains actor names |
| 0.3.3 | Protected API endpoint | ⬜ | 0.3.1, 0.1.4 | `src/pages/api/films.ts`, `src/pages/api/films.test.ts` | `curl localhost:4321/api/films` → 302 (unauthenticated) |
| 0.3.4 | Session validation on server | ✅ | 0.2.4 | `src/middleware.ts` | Middleware calls `createAstroAuth` which validates upstream |
| 0.3.5 | Playwright E2E — protected routes | ⬜ | 0.3.1, 0.3.2 | `e2e/protected.spec.ts` | `npx playwright test e2e/protected.spec.ts` |

**Note on 0.3.4:** Session validation is handled by the adapter's `createAstroAuth` middleware. The demo's middleware already delegates to it. This story is verified.

---

## Epic 0.4 — Client Auth + Full Flows (v0.4.0)

| ID | Story | Status | Depends On | Files | Test |
|----|-------|--------|------------|-------|------|
| 0.4.1 | Profile page (client auth) | ⬜ | 0.2.1 | `src/pages/profile.astro` | Playwright: login → visit /profile → see email |
| 0.4.2 | Sign-out flow | ⬜ | 0.2.1, 0.4.1 | Updates `src/auth-client.ts`, `src/layouts/Layout.astro` | Playwright: click sign-out → redirected to / |
| 0.4.3 | Navigation with auth state | ⬜ | 0.4.1, 0.2.1 | Updates `src/layouts/Layout.astro` | Playwright: nav shows correct links per auth state |
| 0.4.4 | Error handling pages | ⬜ | 0.1.5 | `src/pages/404.astro`, error states in pages | Vitest: simulate fetch/DB failures |
| 0.4.5 | POST API endpoint | ⬜ | 0.3.3 | `src/pages/api/reviews.ts` | `curl -X POST localhost:4321/api/reviews` → 302 |
| 0.4.6 | Playwright E2E — full user journey | ⬜ | 0.4.1–0.4.5 | `e2e/full-flow.spec.ts` | `npx playwright test e2e/full-flow.spec.ts` |

---

## Epic 0.5 — Deploy & Document (v0.5.0)

| ID | Story | Status | Depends On | Files | Test |
|----|-------|--------|------------|-------|------|
| 0.5.1 | Netlify deployment configuration | ⬜ | 0.4.x | `netlify.toml` (finalize) | `netlify build` succeeds |
| 0.5.2 | Live URL smoke test | ⬜ | 0.5.1 | `playwright.config.ts` (live project) | `npx playwright test --project=live` |
| 0.5.3 | README — developer adoption guide | ⬜ | 0.5.1 | `README.md` | `wc -l README.md` > 30 |
| 0.5.4 | Final README links | ⬜ | 0.5.3 | `README.md` | All links return 200 |

---

## Summary

| Epic | Stories Done | Stories Pending | Total |
|------|-------------|-----------------|-------|
| 0.1 | 7 | 0 | 7 |
| 0.2 | 1 | 4 | 5 |
| 0.3 | 1 | 4 | 5 |
| 0.4 | 0 | 6 | 6 |
| 0.5 | 0 | 4 | 4 |
| **Total** | **9** | **18** | **27** |

**Next story to grab:** 0.2.1 (Auth client helper) — has no pending dependencies, blocked only by 0.1.2 which is done.

## Open Decisions (from CONTEXT.md)

- [ ] Graceful degradation policy — no-op vs. hard error for missing auth vars
- [ ] Reviews table schema for Epic 0.4 Story 0.4.5
