# Plan — Review Fixes for Epic e04

We will address the must-fix and should-fix findings from the Code Review Report for Epic e04.

## Checklist

- [ ] **Finding A (must-fix)**: Add click event listener to `#nav-sign-out` in `src/components/NavClient.astro` to perform `client.signOut()` and redirect.
- [ ] **Finding B (must-fix)**: Throw error if environment variables `NEON_AUTH_BASE_URL` or `NEON_AUTH_COOKIE_SECRET` are missing in `src/middleware.ts` to fail fast. Update `src/__tests__/middleware.test.ts` to assert throwing.
- [ ] **Finding C (must-fix)**: Wrap queries in `src/db.ts` with a timeout of 5 seconds.
- [ ] **Finding D (should-fix)**: Add authenticated flow E2E tests in Playwright by routing `/get-session` to return a mock user. Verify Profile logged-in page, Nav Client logged-in links, reviews POST authentication, and Sign-out button.

---

## Detailed Steps

### Step 1: Nav Client Sign-out Listener
We will update `src/components/NavClient.astro` to add:
```typescript
      const signOutBtn = document.getElementById("nav-sign-out");
      signOutBtn?.addEventListener("click", async () => {
        await client.signOut();
        window.location.href = "/";
      });
```
We will also ensure that we do not introduce any comments into the code.

### Step 2: Fail Fast in Middleware
We will edit `src/middleware.ts` to:
- Check for `baseUrl` and `secret` during middleware initialization.
- Throw a descriptive error if they are missing.
- Update `src/__tests__/middleware.test.ts` to assert that importing/calling `onRequest` throws when env vars are missing.

### Step 3: DB Timeout in `src/db.ts`
We will wrap the database call in `src/db.ts` with a `Promise.race` that rejects after 5000ms.

### Step 4: Playwright E2E Authenticated flow mock
We will write a new E2E test file `e2e/auth-flow.spec.ts` that:
- Uses `page.route("**/get-session", ...)` to return a mock authenticated user session.
- Visits `/profile`, verifies it shows "Logged in as test-user@example.com".
- Verifies the Sign-out button is visible and can be clicked.
- Intercepts `client.signOut()` (or calls to `/sign-out` if any) to mock successful sign-out.
- Verifies navigation bar shows "Dashboard" and "Sign out" when logged in.
- Visits `/dashboard` and checks the film catalog table.

---

## Verifications
- Run `npx vitest run` to verify unit tests.
- Run `npx playwright test` to verify E2E tests.
- Run `npm run preflight` to run compliance check.
