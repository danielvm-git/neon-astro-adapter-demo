# Neon Auth Astro Demo — Claude Code

Read CONVENTIONS.md before any GitHub or git operation.

## Project
Reference demo site showcasing Neon Auth + Neon DB with Astro 5+. Live on Netlify.
Stack: TypeScript / Astro 5+ / Node 22 / Netlify

## Commands
| Action    | Command                       |
|-----------|-------------------------------|
| Dev       | `npx astro dev`               |
| Build     | `npx astro build`             |
| Preview   | `npx astro preview`           |
| Test      | `npx vitest run`              |
| E2E       | `npx playwright test`         |
| Typecheck | `npx astro check`             |

## Architecture
Standard Astro SSR site. Middleware (`src/middleware.ts`) proxies auth via `@danielvm/neon-astro-auth`. Pages: `/` (home), `/login`, `/signup`, `/dashboard` (protected), `/profile` (client auth). Neon DB accessed via `@neondatabase/serverless` on server routes.

## Conventions
- TDD: every story starts RED (failing test), then GREEN (impl), then REFACTOR
- Functional style, no classes unless Astro requires it
- NO `I` prefix on interface names
- NO comments in code
- Conventional Commits (Angular) — `feat:` for features, `fix:` for bug fixes
- `npx` commands directly — never via pnpm scripts

## Never
- Modify `@neondatabase/auth` or `@danielvm/neon-astro-auth` internals
- Use `workspace:*` protocol — deps from npm registry
- Commit secrets, `.env` files, or tokens
- Use CommonJS or dual format — ESM-only

## Agent Rules
- **Workflow Mandate:** You MUST use the bigpowers skills (e.g. `plan-work`, `develop-tdd`, `orchestrate-project`) to perform tasks. DO NOT write code directly in response to a user prompt like "build this feature".
- Read specs/ before writing code.
- All planning and specifications MUST be written to `specs/` (e.g. `specs/PLAN.md`) before any code is generated.
- Write the minimum code that solves the stated problem. Nothing extra.
- Never refactor, rename, or reorganize code outside the task scope.
- Run tests after every change. Show evidence before declaring done.
- One clarifying question beats a wrong assumption baked into 200 lines.
