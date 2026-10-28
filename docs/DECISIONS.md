# Decisions

- 2026-10-28: Start Phase 0 with a static, bilingual landing page and workspace quality gates. It does not require data loading, so no skeleton, empty state, or retry state is shown for this static content. Interactive localization and the design system remain Phase 1 work.
- 2026-10-28: Use ESLint 9.39.5 rather than ESLint 10 because the current Next.js plugins declare support only through ESLint 9; revisit when their peer ranges support the newer major version.
- 2026-10-28: Check formatting for web application source with the pinned Prettier configuration as part of lint. Documentation and generated files remain outside this first formatting scope to avoid unrelated rewrites.
- 2026-10-28: Evaluate hosting and database plans before provisioning them; account access and free-tier terms must be verified. See [ADR-001](adr/ADR-001-free-services.md).
