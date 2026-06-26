# Decision Log — Neon Auth Astro Demo
> Lightweight decisions that don't warrant a full ADR
> Migrated from custom specs/CONTEXT.md on 2026-06-26

| Date | Decision | Rationale | Alternatives |
|------|----------|-----------|--------------|
| 2026-05-26 | ESM-only, Node 22+ | Matches adapter and Astro requirements | CommonJS (deprecated in Astro 5) |
| 2026-05-26 | Email/password auth only | Demo scope — show auth integration, not provider diversity | Social login (out of scope per SCOPE_LATEST.yaml) |
| 2026-05-26 | DVD Rental dataset (film, actor, film_actor only) | Pre-loaded, well-known sample, only 3 of 15 tables needed | All 15 tables (unnecessary complexity) |
| 2026-05-26 | Cookie sameSite policy: `lax` | Adapter default — safe for redirect-based auth flows | `strict` (breaks redirect after login) |
