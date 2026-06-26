# ADR-0001: Manual Route Injection Over Integration Function

**Status:** Accepted
**Date:** 2026-05-26

## Context

The `@danielvm/neon-astro-auth` adapter provides a `neonAuth()` integration function that auto-wires middleware and API route handlers in `astro.config.mjs`. However, the documentation goal of this demo is to show developers exactly how the adapter works under the hood — not to abstract it away.

The original plan (Story 0.1.2) specified using the `neonAuth()` integration, but the implementation chose manual injection. This divergence was intentional but undocumented.

## Decision

Use manual `injectRoute` in `astro.config.mjs` instead of the `neonAuth()` integration. This explicitly shows:

1. The route handler injection pattern
2. Where the auth proxy routes live (`/api/auth/[...slug]`)
3. How middleware wires to the adapter

The integration function exists in the adapter but is bypassed for educational clarity.

## Consequences

**Easier:**
- Developers can see the exact mechanism of route injection
- No magic — every wire is visible in the config
- Easier to debug issues since the injection path is explicit

**Harder:**
- More boilerplate in `astro.config.mjs`
- Risk of drifting from the adapter's recommended integration path
- If the adapter adds features to `neonAuth()`, the demo won't automatically benefit
- The plan (Story 0.1.2) and implementation now diverge — docs must stay in sync
