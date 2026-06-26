# Feature Request: Expand migrate-spec skill with optional practices

**To:** bigpowers skill maintainers  
**From:** migrate-spec session on neon-astro-adapter-demo (2026-06-26)

## Summary

The `migrate-spec` SKILL.md lists 8 optional "Learnings to adopt" from GSD, spec-kit, and BMAD frameworks. Currently these are presented at the end of a migration session as checkboxes the user can opt into — but they produce no executable output or scaffolded files. Suggest promoting 5 of the 8 into first-class migration steps with templates and commands.

## Proposed additions to migrate-spec

### 1. Methodology doc (GSD) — high value

**Current:** Listed as a checkbox with no output artifact.

**Proposal:** Add an optional Step 6 that creates `specs/tech-architecture/METHODOLOGY_LATEST.md` from a template, then prompts the user which analytical lenses to include:

```markdown
# Methodology — {project name}

The following analytical lenses should inform `plan-work` and `audit-code` sessions.

## Cost of Delay (CD3)
{template with CD3 formula}
## STRIDE
{template with STRIDE categories}
```

Also add a `specref` in migrate-spec REFERENCE.md listing the template path.

### 2. ID tracking in SCOPE (GSD) — high value

**Current:** Comment-only IDs in SCOPE_LATEST.yaml (e.g., `# REQ-EP01`).

**Proposal:** When the source framework has IDs (GSD REQ-XX, BMAD FR-XX/UJ-XX), the migration should emit them as first-class YAML fields rather than comments:

```yaml
in_scope:
  - id: REQ-EP01
    description: "Epic 0.1: Astro scaffold + Neon connection"
```

When the source has no IDs, prompt the user: *"No IDs found in source. Assign auto-generated IDs? [yes / no]"* If yes, emit `REQ-{NNN}` with a comment `# auto-generated`.

### 3. Two-pass spec writing gate (spec-kit) — medium value

**Current:** Noted as a practice, no mechanism.

**Proposal:** Add an optional substep to `elaborate-spec` invocation after migration: *"Run two-pass: (1) user-journey spec → approval → (2) technical-decisions spec → approval"*. Store the gate state in `state.yaml`:

```yaml
two_pass_spec:
  journey_pass: complete  # or pending
  technical_pass: pending
  approved_at: ""
```

### 4. FR-XX + UJ-XX traceability (BMAD) — medium value

**Current:** Listed as a checkbox.

**Proposal:** When source has FR-XX or UJ-XX IDs, emit a separate `specs/product/REQUIREMENTS_TRACE.yaml` that maps each ID → epic → story → verify command. Template:

```yaml
# Auto-generated from BMAD FR-XX/UJ-XX IDs
trace:
  - id: FR-001
    description: "User can register with email/password"
    epic: e02-auth-ui
    story: 0.2.3
    verify: "Playwright: fill form, observe redirect to /login"
```

### 5. Adversarial review pass (BMAD) — medium value

**Current:** Noted as a checkbox; AUDIT.md already does this for this project.

**Proposal:** Add an optional post-migration step that runs `audit-plan` (or a lightweight variant) against the new bigpowers artifacts, producing `specs/archive/MIGRATION-AUDIT.md` with findings.

### 6. Handoff block in state.yaml (GSD) — done in this session

Already implemented during this migration — the `handoff` block is now in `specs/state.yaml`. Consider making it a mandatory Step 4 output in migrate-spec (it's currently only shown as a GSD learning).

## Priority ordering for development

1. **Methodology doc** — templates are low-effort, high-leverage for new bigpowers projects
2. **ID tracking** — closes a real traceability gap between migrated specs and bigpowers epics
3. **Two-pass gate** — needs coordination with elaborate-spec skill
4. **FR-XX trace** — specific to BMAD imports, narrow audience
5. **Adversarial review** — depends on audit-plan skill being stable

## Implementation notes

- All templates should live in `migrate-spec/templates/` (create the directory if needed)
- Each new step should have its own "Create this?" confirmation gate per migrate-spec convention
- The skip/abort flow must be preserved — none of these should be mandatory
- REFERENCE.md and REFERENCE-GSD.md need updating with template paths

---

*Generated from a real migration session on `neon-astro-adapter-demo`. Uses bigpowers v1 layout.*
