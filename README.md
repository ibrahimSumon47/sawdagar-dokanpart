# Sawdagar Dokanpat

A non-commercial marketplace demonstration inspired by the independent makers and merchants of Bangladesh.

**Demo store: sandbox payments.** This is a portfolio project, not a real shop; no real money is accepted.

## Current state

Phases 0, 1, 2 and 3 are complete. The catalog, authentication and role model are deployed:

- [Home](https://sawdagar-dokanpart.vercel.app/) — departments, featured products, trusted vendors and the bilingual shell.
- [Catalog](https://sawdagar-dokanpart.vercel.app/catalog) — 432 products across 84 categories from 24 vendors, with search, filters and pagination.
- [A product page](https://sawdagar-dokanpart.vercel.app/product/handwoven-jamdani-saree-indigo) — variants, stock, vendor details and related items (open any card from the catalog).
- [Design system](https://sawdagar-dokanpart.vercel.app/design) — tokens, type, components, states, both themes and frames at six widths.
- [Sign in](https://sawdagar-dokanpart.vercel.app/sign-in) — one-click demo access for eight roles.
- [Account](https://sawdagar-dokanpart.vercel.app/account) — profile editing, role and store membership.
- [Seller Center](https://sawdagar-dokanpart.vercel.app/seller) — the vendor's store and team, limited to vendor roles.
- [Admin](https://sawdagar-dokanpart.vercel.app/admin) — accounts and audit log, filtered by the role's permissions.

Search and sort run on the server. A query matches English or Bangla product titles and leaf-category names. Prices are integer poisha formatted in Bengali or Western numerals. Sessions are validated on the server: the seller area rejects buyers and platform staff, the admin area rejects buyers and vendors, and panels inside the admin area follow the role's permissions. Theme and language are read from cookies before the first paint.

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

- `apps/web` — Next.js App Router storefront, catalog queries and routes, auth routes and role-guarded pages; Prisma schema, migrations and seed.
- `packages/ui` — design tokens and shared components with skeleton pairs.
- `packages/domain` — pure helpers for money, categories, catalog seed generation, roles, permissions and demo accounts.

## Quality checks

CI runs lint, type checking, unit tests and a production build on Linux, Windows and macOS. The 58 unit tests include catalog filter validation, the deterministic 432-product seed, role boundaries, the demo allowlist, safe redirects, WCAG AA token contrast and skeleton layout parity. See [testing](docs/TESTING.md), [architecture](ARCHITECTURE.md), [security](docs/SECURITY.md) and [deployment](docs/DEPLOYMENT.md).

## Known limitations

- There is no cart, checkout, order or payment flow yet. Product pages say so instead of offering a dead button.
- Catalog photography is an original SVG jamdani pattern per product tone; no image host is integrated.
- Ratings, review counts and follower counts are seeded display summaries; there is no review or follow table yet.
- Search is a bounded substring match, not full-text search: no typo tolerance, stemming or autocomplete, and it does not match a vendor name from the search box. Vendor name matches were removed because they returned unrelated products.
- The seller and admin pages are read-only foundations. Catalog, order, finance and CMS tools arrive with later phases.
- Demo sign-in is not yet covered by an automated integration test, and there is no browser or accessibility suite yet.
- Password reset, email verification, two-factor authentication and Google sign-in are not enabled.
