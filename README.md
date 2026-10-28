# Sawdagar Dokanpat

A non-commercial marketplace demonstration inspired by the independent makers and merchants of Bangladesh.

**Demo store: sandbox payments.** This is a portfolio project, not a real shop; no real money is accepted.

## Current state

Phases 0, 1 and 2 are complete. The authentication and role model is deployed and verified:

- [Home](https://sawdagar-dokanpart.vercel.app/) — the storefront shell, bilingual copy and the current phase.
- [Design system](https://sawdagar-dokanpart.vercel.app/design) — tokens, type, components, states, both themes and frames at six widths.
- [Sign in](https://sawdagar-dokanpart.vercel.app/sign-in) — one-click demo access for eight roles.
- [Account](https://sawdagar-dokanpart.vercel.app/account) — profile editing, role and store membership.
- [Seller Center](https://sawdagar-dokanpart.vercel.app/seller) — the vendor's store and team, limited to vendor roles.
- [Admin](https://sawdagar-dokanpart.vercel.app/admin) — accounts and audit log, filtered by the role's permissions.

Sessions are validated on the server. The seller area rejects buyers and platform staff; the admin area rejects buyers and vendors; panels inside the admin area follow the role's permissions, and the audit log is visible only to the Super Admin. Theme and language are read from cookies before the first paint.

## Demo accounts

Use the **Try demo** buttons on the sign-in page. No password is shown or needed.

| Role | Demo email |
|---|---|
| Buyer | `buyer@demo.sawdagar.test` |
| Vendor owner | `vendor@demo.sawdagar.test` |
| Vendor staff | `staff@demo.sawdagar.test` |
| Support agent | `support@demo.sawdagar.test` |
| Moderator | `moderator@demo.sawdagar.test` |
| Finance admin | `finance@demo.sawdagar.test` |
| Content editor | `editor@demo.sawdagar.test` |
| Super Admin | `admin@demo.sawdagar.test` |

Demo accounts cannot change their email or password. The seed is idempotent and runs only through the `Database` GitHub Actions workflow.

## Workspace

- `apps/web` — Next.js App Router storefront, auth routes and role-guarded pages; Prisma schema, migration and seed.
- `packages/ui` — design tokens and shared components with skeleton pairs.
- `packages/domain` — pure helpers for money, categories, roles, permissions and demo accounts.

## Quality checks

CI runs lint, type checking, unit tests and a production build on Linux, Windows and macOS. The 43 unit tests include role boundaries, the demo allowlist, safe redirects, WCAG AA token contrast and skeleton layout parity. See [testing](docs/TESTING.md), [architecture](ARCHITECTURE.md), [security](docs/SECURITY.md) and [deployment](docs/DEPLOYMENT.md).

## Known limitations

- No catalog, cart, checkout or payments exist yet; the gallery products and vendors are design fixtures.
- The seller and admin pages are read-only foundations. Catalog, order, finance and CMS tools arrive with later phases.
- Demo sign-in is not yet covered by an automated integration test, and there is no browser or accessibility suite yet.
- Password reset, email verification, two-factor authentication and Google sign-in are not enabled.
- Product imagery is an original SVG jamdani pattern until real photography and media hosting are added.
