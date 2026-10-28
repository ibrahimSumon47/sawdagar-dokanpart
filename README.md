# Sawdagar Dokanpat

A non-commercial marketplace demonstration inspired by the independent makers and merchants of Bangladesh.

**Demo store: sandbox payments.** This is a portfolio project, not a real shop; no real money is accepted.

## Current state

Phases 0 to 7 are complete and deployed: foundation and design system, authentication and roles, catalog, cart and wishlist, checkout and orders, the buyer account, and the Seller Center. The catalog, authentication and role model are live:

- [Home](https://sawdagar-dokanpart.vercel.app/) — departments, featured products and the bilingual shell.
- [Catalog](https://sawdagar-dokanpart.vercel.app/catalog) — 432 products across 84 categories from 24 vendors, with search, filters and pagination.
- [A product page](https://sawdagar-dokanpart.vercel.app/product/handwoven-jamdani-saree-indigo) — variants, stock, vendor details and related items (open any card from the catalog).
- [Design system](https://sawdagar-dokanpart.vercel.app/design) — tokens, type, components, states, both themes and frames at six widths.
- [Wishlist](https://sawdagar-dokanpart.vercel.app/wishlist) — products saved by the signed-in buyer (sign in first).
- [Compare](https://sawdagar-dokanpart.vercel.app/compare) — up to four products side by side.

The cart works for guests and signed-in buyers: it survives a reload for 30 days, merges the guest cart on sign-in, groups rows by vendor, and keeps totals in integer poisha. Products can be saved to a DB-backed wishlist or added to a four-product comparison.
- [Sign in](https://sawdagar-dokanpart.vercel.app/sign-in) — one-click demo access for eight roles.
- [Account](https://sawdagar-dokanpart.vercel.app/account) — profile editing, role and store membership.
- [Seller Center](https://sawdagar-dokanpart.vercel.app/seller) — dashboard, product editing, inventory, fulfillment, questions, returns, promotions, analytics and store settings, limited to vendor roles.
- [Public store](https://sawdagar-dokanpart.vercel.app/store/rupsha-tangail-weavers) — a vendor's public page with announcement, active products, about text and policies.
- [Admin](https://sawdagar-dokanpart.vercel.app/admin) — accounts and audit log, filtered by the role's permissions.

Search and sort run on the server. A query matches English or Bangla product titles and leaf-category names. Prices are integer poisha formatted in Bengali or Western numerals. Sessions are validated on the server: the seller area rejects buyers and platform staff, the admin area rejects buyers and vendors, and Seller Center writes require a store owner. Theme and language are read from cookies before the first paint. Cart, wishlist, checkout and Seller Center writes are Server Actions that validate ids and resolve ownership from the session; no price, store id or actor id is accepted from the browser.

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

CI runs lint, type checking, unit tests and a production build on Linux, Windows and macOS. The 118 unit tests include catalog filter validation, the deterministic 432-product seed, role boundaries, the demo allowlist, safe redirects, cart and coupon totals, order and stock rules, review and return rules, seller approval and stock rules, WCAG AA token contrast and skeleton layout parity. See [testing](docs/TESTING.md), [architecture](ARCHITECTURE.md), [security](docs/SECURITY.md) and [deployment](docs/DEPLOYMENT.md).

## Known limitations

- Seller staff can read the Seller Center but cannot write until staff permission sets land.
- KYC is a text-only demo submission; there are no document uploads or admin review screen yet, and there is no new-store application flow.
- Bulk CSV import, packing-slip PDFs, seller replies to reviews, featured collections and a block-based store builder are not implemented. CSV export is.
- Seller analytics show ninety-day totals, best sellers and low stock without charts, a date picker or conversion metrics.
- Coupons are one per cart; stacking and free-shipping coupons alongside a discount code are not supported.
- Catalog photography is an original SVG jamdani pattern per product tone; no image host is integrated. Review photos are bounded data URLs in PostgreSQL.
- Ratings and review counts come from published review rows, but seeded reviews belong to synthetic buyers without login accounts. Follower counts are still display data.
- Search is a bounded substring match, not full-text search: no typo tolerance, stemming or autocomplete, and it does not match a vendor name from the search box.
- MockPay reservations are held for 30 minutes but no scheduled job releases abandoned ones yet. SSLCommerz sandbox and Stripe test mode need owner credentials and are not wired.
- Demo sign-in is not covered by an automated integration test; there is no browser or accessibility suite, and no nightly demo reset yet.
- Password reset, email verification, two-factor authentication and Google sign-in are not enabled.
