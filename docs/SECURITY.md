# Security

## Current controls

- Authentication is handled by Better Auth with email/password, HTTP-only session cookies, a seven-day session and a 24-hour update age. `nextCookies` writes cookies from Server Actions and route handlers.
- Passwords are hashed by Better Auth; no password is stored or compared in application code. The seed and demo action read `DEMO_ACCOUNT_PASSWORD` from the server environment.
- The public demo action accepts only the eight emails in `packages/domain/src/auth/demoAccounts.ts`. The role is read from the database, never from a form field, and the post-sign-in path is restricted to internal paths by `safeNextPath`.
- Authorization runs on the server in `requireArea`; the account area needs a session, the seller area needs a vendor role, and the admin area needs a platform role. Hidden navigation is a convenience, not the control.
- Profile writes validate name, Bangladeshi phone, district and bio with Zod on the server and write only the session user's row.
- Better Auth rate limits sign-in and general requests, stored in the `rate_limits` table (10 sign-in attempts and 30 requests per minute per key).
- Demo sign-in and profile updates append to `audit_logs`. The audit viewer requires `admin:audit:read`, which only the super admin holds.
- Secrets (`DATABASE_URL`, `DIRECT_DATABASE_URL`, `BETTER_AUTH_SECRET`, `DEMO_ACCOUNT_PASSWORD`) exist only in the Vercel and GitHub dashboards. The repository contains no connection string or key.

## Residual risks and planned controls

- Anyone can open a demo super-admin session by design. Demo data must therefore stay non-sensitive and resettable; the nightly reset is not implemented yet.
- The demo password is shared by all eight accounts. Rotating it requires re-running the seed workflow; there is no per-account reset.
- There is no email verification, password reset, two-factor authentication, OAuth, session listing or account deletion yet.
- CSRF relies on Better Auth's origin checks and Next.js Server Action protections. A dedicated penetration test has not been run.
- An OWASP ASVS Level 2 mapping, a formal threat model, security headers and a Content Security Policy are still required.
- There is no security contact or private reporting channel yet.

## Reporting and secrets

Do not include secrets or personal data in public issues. Configure runtime secrets only in the relevant Vercel or GitHub dashboard; do not commit them or paste them into chat.
