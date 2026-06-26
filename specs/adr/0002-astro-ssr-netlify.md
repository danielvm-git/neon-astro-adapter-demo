# ADR-0002: Astro 5 SSR With Netlify Adapter

**Status:** Accepted
**Date:** 2026-05-26

## Context

Neon Auth server-side session validation requires a server runtime that supports HTTP-only cookies and server-side fetch. The demo could use Astro static export, Astro SSR with Vercel, Cloudflare Pages, or Netlify.

The deployment target also determines which platform-specific features (env var management, function runtime, CI integration) are available.

## Decision

Use Astro 5 SSR with `@astrojs/netlify` adapter. Netlify provides:

1. SSR functions with Node 22+ runtime
2. Environment variable management via dashboard (required for Neon Auth secrets)
3. Framework API for Astro 5+ integration
4. Free tier sufficient for a reference demo

## Consequences

**Easier:**
- Aligns with the target audience (many Astro users deploy to Netlify)
- Simple env var management via Netlify dashboard
- No Cold-start issues for demo traffic levels

**Harder:**
- SSR function cold start adds latency on first request
- Platform lock-in — demo won't work on Vercel or Cloudflare without adapter changes
- Netlify Framework API is relatively new; edge cases may emerge
- Local dev requires Netlify CLI for full fidelity
