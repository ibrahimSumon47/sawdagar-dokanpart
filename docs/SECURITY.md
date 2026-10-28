# Security

## Current controls

- Authentication is handled by Better Auth with email/password, HTTP-only session cookies, a seven-day session and a 24-hour update age. `nextCookies` writes cookies from Server Actions and route handlers.
- Passwords are hashed by Better Auth; no password is stored or compared in application code. The seed and demo action read `DEMO_ACCOUNT_PASSWORD` from the server environment.
- The public demo action accepts only the eight emails in `packages/domain/src/auth/demoAccounts.ts`. The role is read from the database, never from a form field, and the post-sign-in path is restricted to internal paths by `safeNextPath`.
- Authorization runs on the server in `requireArea`; the account area needs a session, the seller area needs a vendor role, and the admin area needs a platform role. Hidden navigation is a convenience, not the control.
- Profile writes validate name, Bangladeshi phone, district and bio with Zod on the server and write only the session user's row.
- Better Auth rate limits sign-in and general requests, stored in the `rate_limits` table (10 sign-in attempts and 30 requests per minute per key).
- Demo sign-in and profile updates append to `audit_logs`. The audit viewer requires `admin:audit:read`, which only the super admin holds.
- Shop Server Actions accept only product or variant ids and a bounded quantity. They resolve the viewer from the session, validate ids with Zod, reject inactive products and re-read variant stock before every add or quantity change. No price, user id, role or total is accepted from the client.
- Guest carts use a random UUID in an HTTP-only, `SameSite=Lax`, production-`Secure` cookie; the token is the only way the guest cart can be addressed. A signed-in cart is addressed by the session user id, not by a cookie supplied id.
- Wishlist writes require a session and enforce a 100-product cap. Comparison is a cookie-only list of at most four ids; it holds no personal data and cannot change prices or stock.
- Removing a cart row is allowed even when the product has since become inactive, so a buyer can always clear a line. Adding and quantity changes are the paths that trust stock.
- Every Seller Center action resolves the membership from the session, requires the owner role and the `seller:manage` permission, and scopes updates by the store's `organizationId`. A product, variant, sub-order, question or return id from another store is treated as invalid rather than updated.
- Store approval and KYC are checked on the server before a product can become active. A seller can save drafts while under review but cannot publish to the catalog.
- Product, store, promotion, question and return text is validated with Zod length bounds before it is stored; no seller form accepts a price, role, user id or total from the client.
- Stock changes are bounded to 1,000 units per action, cannot make stock negative, and write an `inventory_adjustments` row with the actor and resulting count. Sub-order transitions use the same state machine as checkout.
- The public store page reads only stores whose status and KYC are both approved, and only active products. A suspended or rejected store disappears from the public page without deleting its data.
- The CSV export route returns 401 for guests and 403 for accounts without an owner membership, and it is marked private with `no-store`.
- Secrets (`DATABASE_URL`, `DIRECT_DATABASE_URL`, `BETTER_AUTH_SECRET`, `DEMO_ACCOUNT_PASSWORD`) exist only in the Vercel and GitHub dashboards. The repository contains no connection string or key.

## Residual risks and planned controls

- Anyone can open a demo super-admin session by design. Demo data must therefore stay non-sensitive and resettable; the nightly reset is not implemented yet.
- The demo password is shared by all eight accounts. Rotating it requires re-running the seed workflow; there is no per-account reset.
- There is no email verification, password reset, two-factor authentication, OAuth, session listing or account deletion yet.
- CSRF relies on Better Auth's origin checks and Next.js Server Action protections. A dedicated penetration test has not been run.
- The demo has no abuse limit on cart writes and no background cleanup for expired guest carts. A public demo could accumulate stale rows; add a scheduled delete and per-session throttling before traffic grows.
- An OWASP ASVS Level 2 mapping, a formal threat model, security headers and a Content Security Policy are still required.
- There is no security contact or private reporting channel yet.

## Reporting and secrets

Do not include secrets or personal data in public issues. Configure runtime secrets only in the relevant Vercel or GitHub dashboard; do not commit them or paste them into chat.
