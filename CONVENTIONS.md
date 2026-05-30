# Conventions

> Shared rules for all AI agents contributing to the Neon Auth Astro Demo.

## General

- All planning output goes in `specs/`. Read `specs/` before starting work.
- Every non-trivial change goes through **TDD** (RED → GREEN → REFACTOR).
- Write the minimum code that solves the stated problem. Nothing extra.
- Never refactor, rename, or reorganize code outside the task scope.
- Run `npx vitest run` and `npx playwright test` after every change. Show evidence before declaring done.
- One clarifying question beats a wrong assumption baked into 200 lines.

## Code Style

- TypeScript strict mode. `strict: true` in `tsconfig.json`.
- Functional style preferred. No classes unless the framework requires it.
- NO `I` prefix on interface names.
- NO JSDoc or inline comments. Code should be self-explanatory.
- ESM-only. No CommonJS.

## Commits

- Conventional Commits (Angular convention).
- `feat:` → minor version bump. `fix:` → patch. `docs:`, `chore:`, `refactor:` → no release.
- One `feat:` commit per completed epic on merge to `main`.
- commitlint + husky enforces the convention.

## Architecture

| Module        | Path                    | Purpose                         |
|---------------|-------------------------|---------------------------------|
| Middleware    | `src/middleware.ts`     | Auth proxy + session validation |
| Pages         | `src/pages/`            | Route-level Astro components    |
| Layouts       | `src/layouts/`          | Shared page layouts             |
| DB            | `src/db.ts`             | Neon serverless DB client       |
| Auth Client   | `src/auth-client.ts`    | Browser-side auth helper        |

## Build & Dependencies

- `npx astro dev` to run. `npx astro build` to build.
- `npx vitest run` for unit tests. `npx playwright test` for E2E.
- Dependencies from npm registry. No `workspace:*` protocol.
- `@danielvm/neon-astro-auth` from npm (not file: link).
- `@neondatabase/auth` is used indirectly through the adapter.

## Defensive Code

- **Timeout:** DB queries and auth proxy calls may hang. Always wrap with timeout.
- **Graceful degradation:** If Neon DB or Auth is unreachable, show informative error page, do not crash.
- **Environment validation:** Validate env vars at startup. Fail fast if missing.

## Never Do

- ✗ Modify `@neondatabase/auth` or `@danielvm/neon-astro-auth` internals
- ✗ Use `workspace:*` protocol
- ✗ Commit secrets, tokens, or `.env` files
- ✗ Generate CJS output
- ✗ Add UI framework (React/Vue/Svelte) — keep it Astro-only
