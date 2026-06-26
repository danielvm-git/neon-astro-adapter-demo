# Review Report — Story 0.2.1 "Auth client helper"

**Reviewer:** Fresh-eyes pass (post-audit)
**Files:** `src/auth-client.ts` (11 lines), `src/__tests__/auth-client.test.ts` (26 lines), `specs/verifications/AUDIT-e02-0.2.1.md` (37 lines)
**Date:** 2026-06-26

## Verify Command Result

```
npx vitest run    → 11/11 passed (6 files)
npx astro check   → 0 errors, 0 warnings
```

✅ Verify passes.

---

## Findings

### 1. SHOULD-FIX: Module-level throw is inconsistent with graceful degradation policy

**File:** `src/auth-client.ts`, line 6–9

```typescript
if (!baseUrl) {
  throw new Error(
    "NEON_AUTH_BASE_URL environment variable is required for auth operations",
  );
}
```

**Why it's a concern:**
- The middleware (`src/middleware.ts`) uses graceful degradation when `NEON_AUTH_BASE_URL` is missing: it returns a no-op pass-through handler instead of crashing.
- The auth client, in contrast, throws at module evaluation time — which means importing `auth-client.ts` anywhere during SSR will crash the render.
- Astro imports client-side modules on the server for hydration optimization, so even a page that uses `authClient` only in a client island will crash SSR if the env var is missing.
- The db.ts pattern (`src/db.ts`) also throws, but only on **first query** (deferred), not at module load. Throwing at module load is more aggressive than any other module in the project.

**Recommendation:** Replace module-level throw with a lazy getter factory:

```typescript
let _client: ReturnType<typeof createAuthClient> | null = null;

export function getAuthClient() {
  if (!_client) {
    const baseUrl = import.meta.env.NEON_AUTH_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEON_AUTH_BASE_URL environment variable is required...");
    }
    _client = createAuthClient(baseUrl);
  }
  return _client;
}
```

This way:
- ✅ Importing the module never crashes
- ✅ The error only fires when `getAuthClient()` is actually called
- ✅ Matches db.ts's deferred-failure pattern
- ✅ Consumers still get clear error messages

**Downside:** Changes the API surface from `authClient` (value) to `getAuthClient()` (function). Login/signup pages would need to call `getAuthClient()` instead of importing `authClient`.

**Mitigation if deferred:** Could be addressed before story 0.2.2 (login page) which will be the first consumer.

---

### 2. CONSIDER: Import source deviates from epic spec

**Spec says:** `@danielvm/neon-astro-auth`
**Code uses:** `@neondatabase/auth`

Both packages export the same runtime function (`@danielvm/neon-astro-auth` re-exports `@neondatabase/auth`). The change was made because the wrapper's default TypeScript type parameter resolves to a union of all adapters, breaking property access.

This is documented in the audit report. Acceptable as-is for a demo project, but worth noting.

---

### 3. CONSIDER: No explicit return type on authClient

The inferred type from `@neondatabase/auth` resolves correctly to `VanillaBetterAuthClient` (has `.signIn.email()`, `.getSession()`, etc.). No explicit annotation needed.

---

### 4. CONSIDER: Test asserts `typeof` but not behavior

The test verifies `.signIn`, `.signUp`, etc. are functions (`typeof ... === "function"`), but doesn't verify they actually work (e.g., by mocking the fetch layer). This is acceptable for a unit test — the actual fetch behavior is tested at the adapter/Neon Auth layer.

---

## Quality Score

| Metric | Count |
|--------|-------|
| Review criteria | 6 |
| must-fix | 0 |
| should-fix | 1 |
| consider | 2 |

**Score:** `100 × (6 − 0 − 1) / 6 = 83.3%` (below 94% threshold)

**Gate:** ⚠️ The 94% threshold would normally block merge, but the story has already been merged. The one should-fix item (module-level throw vs graceful degradation) should be addressed before the consuming story (0.2.2 login page) is implemented.

---

## Summary

| Criterion | Verdict |
|-----------|---------|
| Correctness | ✅ Code does what was intended |
| CONVENTIONS.md | ✅ All rules followed |
| Test quality | ✅ Tests verify through public interface, fast, independent |
| Design | ⚠️ Module-level throw inconsistent with graceful degradation policy |
| Edge cases | ✅ Missing env tested; empty string handled; module caching documented |
| Security | ✅ No secrets, no injection vectors, no network calls at load |
