# Threat Model — Epic e05: Security Hardening

**Date:** 2026-06-28  
**Source review:** specs/security/SECURITY-REVIEW-2026-06-28.md  
**Risk level:** HIGH (one confirmed XSS, two medium disclosures)

---

## Surface Area

| File | Change | Attack Surface |
|------|--------|----------------|
| `src/components/ProfileClient.astro` | Replace `innerHTML` with DOM API | Client-side XSS sink |
| `src/pages/api/health.ts` | Strip db/auth detail from public response | Info disclosure |
| `netlify.toml` | Add security response headers | Browser-level mitigations |

## Vulnerability Categories In Scope

| Category | Relevant Story | Status |
|----------|---------------|--------|
| XSS (stored/reflected via innerHTML) | 0.5.1 | OPEN — confirmed HIGH |
| Information disclosure via health endpoint | 0.5.2 | OPEN — medium |
| Missing browser security headers | 0.5.3 | OPEN — medium |

## Out of Scope for This Epic

- CSRF on `/api/reviews` (mitigated by JSON Content-Type + CORS; below threshold)
- Rate limiting (infrastructure concern; handled at Netlify edge)
- `authUrl` client exposure (by design for client-side auth SDK)

## Mitigation Guidance

### Story 0.5.1 — XSS
- Use `element.textContent` for all user-controlled string insertion; never `innerHTML` with dynamic data.
- If HTML structure is required, build it via `document.createElement` chains.
- Test: assert that `<script>` or `<img onerror>` payloads in mock session data are rendered as literal text, not executed markup.

### Story 0.5.2 — Health Info Disclosure
- Public endpoint should return only `{"status": "ok"}` (HTTP 200).
- Full db/auth detail should be removed from the response payload — monitoring tools can use an authenticated route or Netlify status instead.

### Story 0.5.3 — Response Headers
- `X-Frame-Options: DENY` — prevent clickjacking.
- `X-Content-Type-Options: nosniff` — prevent MIME sniffing attacks.
- `Referrer-Policy: strict-origin-when-cross-origin` — limit referrer leakage.
- `X-XSS-Protection: 0` — disable legacy XSS auditor (it's been removed from browsers; explicitly disabling avoids unexpected behavior).
- Apply to `/*` in `netlify.toml` so all routes (including auth callback) receive the headers.

## Residual Risks After Epic

After all three stories are complete, the known risk posture drops from HIGH to LOW. No further security work is required before the Deploy epic.
