# Project state

## Done
- Product, design, architecture, data and roadmap specifications are documented.
- Phase 0: pnpm/Turborepo workspace, CI on Linux/Windows/macOS, Vercel deployment, pinned formatting and the documentation baseline.
- Phase 1: Editorial Heritage tokens and themes, fonts, server-rendered theme and language cookies, English and Bangla catalogs, storefront shell, shared components with skeleton pairs, and the `/design` gallery at six widths. CI passed on all three systems after the CRLF fix.
- Phase 2 auth slice: Prisma 7 schema and initial migration for Better Auth users, sessions, accounts, organizations, members, invitations, rate limits, profiles and audit logs; Better Auth email/password with the admin, organization and Next.js cookie plugins; eight allowlisted demo accounts; role permissions in `@sd/domain`; server guards for the account, seller and admin areas; profile editing with Zod; audit logging; `/sign-in`, `/account`, `/seller`, `/admin` and `/forbidden`.
- Neon migration and demo seed both ran successfully through the `Database` GitHub Actions workflow. The migration was applied before the seed.
- Unit tests: 43 across `@sd/domain`, `@sd/ui` and `@sd/web`, covering role boundaries, the demo allowlist and safe redirects as well as the Phase 1 checks.
- Lint, typecheck, tests and build pass locally; the build no longer touches the database.
- Production verification on 2026-10-28: buyer, vendor owner, vendor staff, support, finance and super admin signed in with Try demo. A vendor opening `/admin` was redirected to `/forbidden`; vendor staff saw no Admin link; support saw the user directory but not the audit log; finance saw neither; the super admin saw both, with each demo sign-in appended to the audit log.

## Now
- Phase 2 is complete and verified on the production deployment.
- Phase 3: catalog schema, seed pipeline, listing, filters, product page and bilingual search.

## Next
- Phase 3: design the catalog schema and deterministic seed, then build the listing, filters, product page and English/Bangla search.
- Add an integration test for demo sign-in once a test database or a mocked adapter is available.

## Blocked
- Phase 10 Java hosting: Hugging Face Docker Spaces currently require a paid plan; a free-compliant alternative must be verified before that phase.

## Known issues
- Vercel can queue production builds for several minutes; the auth deployment may show `Queued` before it serves.
- Moderator and content editor production logins were not exercised individually; their role checks share the restricted admin branch verified with finance and are covered by unit tests. Rate limiting uses the database but is per-window, not distributed per account.
- Passwords, password reset, email verification, two-factor authentication and Google sign-in are not enabled yet; only email/password and the demo allowlist exist.
- Seller and admin pages are read-only foundations. Catalog, order, finance and CMS tools arrive with their phases.
- Rotating `DEMO_ACCOUNT_PASSWORD` requires re-running the seed workflow so existing demo passwords match.
