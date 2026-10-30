# ADR-005: Better Auth sessions with an explicit platform role model

- Status: accepted
- Date: 2026-10-30

## Context

The demo needs email and password sign-in, HTTP-only sessions, store membership and eight roles that map to different areas: buyer, vendor owner, vendor staff, support, moderator, finance, content editor and super admin. Visitors must be able to enter each role from the sign-in page without a password. Authorization decides what a route may read or write, so it cannot rely on hidden navigation or a value sent by the browser.

## Decision

- Use Better Auth 1.7.14 with the organisation, admin and `nextCookies` plugins, email and password enabled, seven-day sessions and a 24-hour update age. Passwords are hashed by the library; application code never compares one.
- Keep the platform role in `user.role` and define the eight allowed values, their labels and the permission map in [`roles.ts`](../../packages/domain/src/auth/roles.ts). Guards call `hasArea` and `requireArea` on the server; the account area needs a session, the seller area a vendor role and the admin area a platform role.
- Limit the public demo action to the eight allowlisted emails in [`demoAccounts.ts`](../../packages/domain/src/auth/demoAccounts.ts). It signs in with `DEMO_ACCOUNT_PASSWORD` from the server environment and reads the role from the database; no form field can choose a user or a role. A successful demo sign-in appends to `audit_logs`.
- Treat store membership as data, not as a role: a vendor owner belongs to an organisation through `members` with an `owner` role, and Seller Center writes resolve that membership from the session and scope every update by its `organizationId`.
- Mark demo users with `isDemo` so the account header and admin user list can label them. There is no email or password change flow in the demo; the profile form edits name, phone, district and bio only.

## Alternatives considered

1. **NextAuth/Auth.js.** Viable, but organisation membership, invitations and role-aware pages would be custom code that Better Auth already provides.
2. **A hosted identity service.** Rejected under the free-forever policy: the demo should not depend on an external account, quota or trial, and its data must remain resettable.
3. **A hand-written session table.** Rejected: password hashing, cookie rotation, rate limiting and the organisation plugin are exactly the parts where a home-grown implementation accumulates mistakes.
4. **Use the admin plugin's role field as the platform role.** The plugin's `admin`/`user` values do not describe finance, moderation or content roles, so a separate domain map is clearer.

## Consequences

- Anyone can open a super-admin session by design. The data must stay non-sensitive and the demo must be resettable; a nightly reset is still missing.
- All eight accounts share one password. Rotating `DEMO_ACCOUNT_PASSWORD` requires re-running the seed workflow, and there is no per-account reset yet.
- Vendor staff can read the Seller Center but cannot write until staff permission sets are implemented.
- A hidden link is only a convenience. Every protected page and action must still call a server guard; the unit tests cover the role map, but the session round trip has no integration test yet.
