---
bug_id: BUG-001
date: 2026-06-26
status: open
severity: medium
scope: auth-client
title: "auth-client.ts crashes at module load when NEON_AUTH_BASE_URL unset"
---

# BUG-001: auth-client.ts crashes at module load when NEON_AUTH_BASE_URL unset

## Problem

`src/auth-client.ts` throws at module evaluation time when `NEON_AUTH_BASE_URL` is unset. This is inconsistent with the project's graceful degradation policy — the middleware handles missing auth env vars via a no-op pass-through, but the auth client crashes at import time.

**Actual behavior:** Importing `auth-client.ts` when `NEON_AUTH_BASE_URL` is unset throws synchronously at module evaluation:

```ts
const baseUrl = import.meta.env.NEON_AUTH_BASE_URL;
if (!baseUrl) {
  throw new Error(
    "NEON_AUTH_BASE_URL environment variable is required for auth operations",
  );
}
```

**Expected behavior:** Importing the module should not throw. Errors should only surface when the auth client is actually used (deferred/lazy — matching `db.ts` and `middleware.ts` patterns).

**Reproduction:**
1. Unset `NEON_AUTH_BASE_URL` in environment
2. `import("../auth-client")`  → throws immediately

## Root Cause Analysis

The same class of bug as **BUG-2026-05-30T211620** (middleware crashed at module scope). The module defines and evaluates `export const authClient = createAuthClient(baseUrl)` at load time, including the env-var guard in the same synchronous pass.

**Contributing factors:**
- Eager initialization instead of lazy/deferred
- No distinction between "module imports fine" and "module is usable"
- Astro SSR imports client modules on the server for hydration optimization, so this affects SSR rendering even for pages that only use authClient in browser islands

**Risk level:** Medium (currently no page imports `auth-client.ts`, but story 0.2.2 login page will be the first consumer)

## TDD Fix Plan

1. **RED**: Update test "exports authClient with signIn, signUp, signOut, getSession" → "getAuthClient returns client with signIn, signUp, signOut, getSession when env set"
   **GREEN**: Replace `export const authClient` with `export function getAuthClient()` using lazy initialization (let-cache pattern from `db.ts`)
   **verify**: `npx vitest run`

2. **RED**: Update test "throws when NEON_AUTH_BASE_URL is not set" → import module (does NOT throw), then call `getAuthClient()` (DOES throw)
   **GREEN**: Move env guard inside `getAuthClient()` body — module-level code has only the import and the function declaration
   **verify**: `npx vitest run`

3. **RED**: New test: "importing auth-client module does not throw when env unset"
   **GREEN**: Already satisfied by the lazy pattern — importing the module is safe
   **verify**: `npx vitest run`

**REFACTOR**: Update `getAuthClient()` name for clarity (consistency with `getAuthMiddleware()` and `getSession()` from the Better Auth client). Consider whether to rename `authClient` to `getAuthClient` in the story spec for story 0.2.2.

## Acceptance Criteria

- [ ] Importing `auth-client.ts` does not throw when `NEON_AUTH_BASE_URL` is unset
- [ ] Calling `getAuthClient()` throws when `NEON_AUTH_BASE_URL` is unset
- [ ] Calling `getAuthClient()` returns a valid client when `NEON_AUTH_BASE_URL` is set
- [ ] Existing tests still pass (updated for new API shape)
- [ ] `npx astro check` passes (0 errors)
- [ ] `npx astro build` succeeds

## Resolution

**Fixed:** 2026-06-26
**Root cause confirmed:** Module-level env var guard runs at import time, crashing SSR when NEON_AUTH_BASE_URL is unset — inconsistent with graceful degradation policy.
**Fix applied:** Replaced `export const authClient = createAuthClient(baseUrl)` with lazy `export function getAuthClient()` that defers env check and client creation to first call.
**Hardening added:** Lazy initialization pattern (let-cache) matching `db.ts` pattern and `middleware.ts` guard function pattern.
**Evidence:** all tests pass (`npx vitest run`)
**Commit:** `fix(auth-client): defer env guard to call time via lazy getAuthClient()`
