# Database

## Current status

The `sawdagar-dokanpat` project in a Neon Free organization (`aws-us-east-1`, PostgreSQL 18) holds the authentication, catalog and cart schemas. The initial migration was applied through the [Database workflow](../.github/workflows/db.yml) on 2026-10-28, followed by the catalog migration and two seed runs. Connection strings live only in the Vercel and GitHub dashboards; the application uses the pooled Neon URL, while Prisma CLI commands use the direct URL.

Schema source: [schema.prisma](../apps/web/prisma/schema.prisma). Migrations: [20261028090000_init](../apps/web/prisma/migrations/20261028090000_init/migration.sql), [20261028140000_catalog](../apps/web/prisma/migrations/20261028140000_catalog/migration.sql), [20261028170000_cart_wishlist](../apps/web/prisma/migrations/20261028170000_cart_wishlist/migration.sql) and [20261028190000_coupons](../apps/web/prisma/migrations/20261028190000_coupons/migration.sql). All four are applied to Neon; the cart/wishlist migration ran through the `Database` workflow on 2026-10-28, and the coupon migration and seed followed in runs 40678423792 and 40678549502. Prisma 7 requires a driver adapter, so the app builds a client from `@prisma/adapter-pg` with `pg`; the generated client is not committed and is produced by `prisma generate`.

```mermaid
erDiagram
  users ||--o{ sessions : has
  users ||--o{ accounts : has
  users ||--o| profiles : has
  users ||--o{ members : joins
  users ||--o{ audit_logs : acts
  organizations ||--o{ members : includes
  organizations ||--o{ invitations : sends
  organizations ||--o{ products : sells
  users ||--o{ invitations : invites
  categories ||--o{ categories : parents
  categories ||--o{ products : contains
  products ||--o{ product_variants : has
  users ||--o| carts : owns
  carts ||--o{ cart_items : holds
  product_variants ||--o{ cart_items : selected
  users ||--o{ wishlist_items : saves
  products ||--o{ wishlist_items : saved_as
  organizations ||--o{ coupons : offers
```

## Tables

| Table | Purpose |
|---|---|
| `users` | Better Auth identity plus platform `role`, ban fields and `isDemo` |
| `sessions` | Session token, expiry, client details, active organization and impersonation |
| `accounts` | Credential and future OAuth accounts, unique by provider and account id |
| `verifications` | Better Auth verification tokens and expiry |
| `organizations` | Vendor stores, unique by slug |
| `members` | Store membership with owner or staff role, unique per user and store |
| `invitations` | Pending store invitations and expiry |
| `rate_limits` | Database-backed Better Auth request counters |
| `profiles` | Bangladeshi phone, district and short bio for an account |
| `audit_logs` | Append-only record of demo sign-ins, profile changes and future privileged actions |
| `categories` | Two-level catalog tree: `depth` 0 is one of 12 departments, `depth` 1 is a leaf with 6 seeded products |
| `products` | Localised title and description, display price, compare-at price, total stock, rating and review count, seller store and leaf category |
| `product_variants` | Ordered options for one product, each with its own SKU, price, compare-at price and stock; one is the default |
| `carts` | One cart per signed-in user or one per guest token; `expiresAt` is 30 days after the last write and `couponCode` holds one applied code. A check constraint requires exactly one owner |
| `cart_items` | Variant, quantity and timestamps, unique per cart and variant |
| `wishlist_items` | Saved product per user, unique per user and product |
| `coupons` | Code, type (`percent`, `fixed`, `free_shipping`), basis-points or poisha value, global or vendor scope, minimum subtotal, optional cap, start and end time, and active flag |

## Catalog shape

- Seed data is original content in [catalogSeedData.ts](../packages/domain/src/catalog/catalogSeedData.ts), expanded deterministically by [catalogSeed.ts](../packages/domain/src/catalog/catalogSeed.ts). It creates 12 departments, 72 leaf categories, 24 vendors, 432 active products and 1,296 variants (three per product).
- A leaf category holds exactly 6 products: 3 styles x 2 colours. Every vendor sells in one department, across its six leaf categories, for 18 products per vendor.
- `products.priceMinor` is the lowest default variant price and `products.totalStock` is the sum of variant stock, so listing filters can run on one table without joins. The seed keeps both in sync; a future seller editor must update them in the same transaction as variants.
- Prices are integer poisha in Bangladeshi taka. They are never floats and never sent from the client.
- `products.rating` and `reviewCount` are seeded display summaries. There is no reviews table yet, so a review cannot change these values until Phase 8.
- Search matches the English and Bangla product title and the English and Bangla leaf-category name. Descriptions are not searched yet; a future search phase can add a text index without changing the UI.
- No product photos exist. `products.tone` picks one of the original SVG pattern tones until a media phase adds a URL and an image host.

## Cart and wishlist shape

- A signed-in cart is found by `userId`; a guest cart is found by the random UUID stored in the HTTP-only `sd_cart` cookie. The cookie is `SameSite=Lax`, `Secure` in production and lasts 30 days.
- `createGuestCart` reuses a live cart, deletes an expired one and issues a new token. Every write extends `expiresAt`.
- On demo sign-in, `mergeGuestCartIntoUser` folds each guest row into the user cart, caps the quantity at current stock, deletes the guest cart and clears the cookie.
- Removing a cart row still works if the product has since become inactive, so a buyer can always clear a stale line. Adding and quantity changes check `status = 'active'` and stock first.
- Wishlist rows are DB-only and require a signed-in user. Guests get a sign-in prompt instead of a local-only list. The cap is 100 products.
- Comparison is deliberately cookie-only (`sd_compare`, JSON array, max four ids) because it is a short-lived, non-sensitive browsing aid and must work before sign-in. Removing a stale product is allowed; adding checks that the product is active.
- No cleanup job deletes expired carts yet. They are ignored after expiry and will need a scheduled delete when the demo has real traffic.
- A coupon is evaluated on the server with integer poisha before it is saved on the cart. The cart re-evaluates the saved rule on every visit and silently drops it if it expired, no longer meets its minimum, or no longer matches a vendor-scoped cart. Four seeded codes cover the three coupon types: `BOISHAKH10`, `DHAKA200`, `FREESHIP` and vendor-scoped `TANGAIL15`.

## Indexes

| Index | Query it serves |
|---|---|
| `products(category_id, status)` | Category listing and category counts |
| `products(organization_id)` | Vendor listing and vendor product counts |
| `products(status, created_at)` | Newest-first listing |
| `products(price_minor)` | Price range filters |
| `products(rating)` | Minimum-rating filter |
| `product_variants(product_id)` | Loading the variants of one product |
| `product_variants(sku)` unique | Stock keeping units |
| `categories(parent_id)` and `categories(sort_order)` | Category navigation |
| `carts(user_id)` unique and `carts(guest_token)` unique | Finding the signed-in or guest cart |
| `carts(expires_at)` | Future expired-cart cleanup |
| `cart_items(cart_id, variant_id)` unique | One row per variant in a cart |
| `cart_items(variant_id)` | Variant stock and cart lookups |
| `wishlist_items(user_id, product_id)` unique | Toggle idempotency and the wishlist page |
| `wishlist_items(product_id)` | Product deletion checks |
| `coupons(code)` unique | Coupon lookup at apply time |
| `coupons(organization_id)` | Vendor-scoped coupon checks |
| `coupons(active, ends_at)` | Active coupon filtering |

Search uses `ILIKE '%term%'` over 432 products, which is acceptable at this size. A trigram index or PostgreSQL full-text search is a later optimisation; the query is capped at 80 characters and the page size is fixed.

## Operations and budget

- Migrations and seeding run only through the `Database` workflow (`workflow_dispatch` with `migrate`, `seed` or `status`); never locally.
- `DIRECT_DATABASE_URL` is used by the Prisma CLI; `DATABASE_URL` is the pooled runtime connection.
- No images or files are stored in PostgreSQL.
- The seeded catalog fits comfortably in the Neon Free storage and compute budget. No database size or query-plan measurement has been recorded yet; add one if the catalog grows or a page becomes slow.
- The seed is idempotent. It upserts users, profiles, the demo store, categories, vendors and products, replaces a product's variants, and never duplicates rows. Re-running it restores the same 432-product catalog.
