# Review Brief — Story 0.2.1 "Auth client helper"

## Feature Description
Browser-side auth helper module. Wraps `createAuthClient()` from `@neondatabase/auth` with env-var validation. Exports a pre-configured `authClient` with Better Auth methods: `signIn`, `signUp`, `signOut`, `getSession`.

## Files Changed
- `src/auth-client.ts` (new, 11 lines) — module definition
- `src/__tests__/auth-client.test.ts` (new, 26 lines) — Vitest tests
- `specs/verifications/AUDIT-e02-0.2.1.md` (new, 37 lines) — audit report

## Diff (74 lines)
See attached diff. Key details:
- Imports `createAuthClient` from `@neondatabase/auth` (not the `@danielvm/neon-astro-auth` wrapper)
- Guards `NEON_AUTH_BASE_URL` at module load with descriptive throw
- Exports `authClient` with inferred type (no type assertions)
- Tests: shape assertion via `typeof` + missing-env error via `vi.stubEnv`/`vi.resetModules`

## CONVENTIONS.md Rules
- TDD: RED → GREEN → REFACTOR
- NO comments in code (code is self-explanatory)
- NO `I` prefix on interfaces
- Functional style, no classes
- ESM-only
- Strict TypeScript (`strict: true`)
- Run `npx vitest run` after every change
- Write minimum code that solves the stated problem

## Active Epic Spec
Epic e02 (Auth UI), Story 0.2.1:
- Wrap `createAuthClient` from `@danielvm/neon-astro-auth`
- Export pre-configured `authClient`
- Guard missing env var
- Tests: exports shape + missing-env error

## Verify Command
```bash
npx vitest run && npx astro check
```

## Areas of Uncertainty
1. **Import source**: Switched from `@danielvm/neon-astro-auth` to `@neondatabase/auth` for correct TypeScript default type parameter. Both export the same runtime `createAuthClient`. Is this a concern?
2. **Module-level throw**: Throwing at module evaluation time when env var is missing. This blocks ALL imports of the module. Is this the right UX vs a lazy getter?
3. **Test approach**: Using `vi.stubEnv` + `vi.resetModules` for env-dependent module imports. Any test isolation concerns?
4. **No explicit return type**: `authClient` has inferred type (no annotation). Is this acceptable, or should we define a minimal interface?
