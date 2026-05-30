# Bug Log

| Bug ID | Date | Severity | Priority | Scope | Summary | Status | Files Changed | Approach | Risk Level | Commit Message | File |
|--------|------|----------|----------|-------|---------|--------|---------------|----------|------------|----------------|------|
| BUG-2026-05-30T211620 | 2026-05-30 | critical | high | middleware | SSR function crashes when Neon Auth env vars unset, causing HTTP 500 on all routes | fixed | src/middleware.ts | guard function checking env vars before auth module init | low | fix(middleware): guard against missing Neon Auth env vars | specs/bugs/BUG-2026-05-30T211620.md |
