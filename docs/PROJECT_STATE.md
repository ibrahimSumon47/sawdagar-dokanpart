# Project state

## Done
- Product, design, architecture, data and roadmap specifications are documented.
- Phase 0: pnpm/Turborepo workspace, CI on Linux/Windows/macOS, Vercel deployment, pinned formatting and the documentation baseline.
- Phase 1: Editorial Heritage tokens and themes, fonts, server-rendered theme and language cookies, English and Bangla catalogs, storefront shell, shared components with skeleton pairs, and the `/design` gallery at six widths.
- Phase 2: Prisma 7 schema and initial migration for Better Auth users, sessions, accounts, organizations, members, invitations, rate limits, profiles and audit logs; Better Auth email/password with the admin, organization and Next.js cookie plugins; eight allowlisted demo accounts; role permissions in `@sd/domain`; server guards for the account, seller and admin areas; profile editing with Zod; audit logging; `/sign-in`, `/account`, `/seller`, `/admin` and `/forbidden`.
- Phase 3: catalog migration for categories, vendor profile fields, products and product variants; deterministic original seed of 12 departments, 72 leaf categories, 24 vendors, 432 products and 1,296 variants; `/catalog` listing with URL-validated search, category, vendor, price, rating, stock and sort filters; `/product/[slug]` page with variants, stock, vendor card, related products, breadcrumbs and Product JSON-LD; home departments and featured products now come from the database.
- Phase 3 pages have layout-matching loading skeletons, empty results and a route error boundary. The catalog is in both languages: Bangla numerals, category names, descriptions, variant names and search.
- Phase 4 cart and wishlist slice: `carts`, `cart_items` and `wishlist_items` migration; guest carts keyed by an HTTP-only `sd_cart` cookie and signed-in carts keyed by user, both expiring after 30 days; guest cart merge on demo sign-in; server actions for add, quantity change, remove, wishlist toggle and comparison; optimistic client updates with rollback and row-level stock errors; cart drawer grouped by vendor with free-delivery progress, quantity steppers, remove, save-for-later and an estimated total.
- Phase 4 wishlist: DB-backed saved products, heart controls on catalog cards and product pages, sign-in prompt for guests, a 100-product cap, `/wishlist` with an empty state and live removal.
- Phase 4 compare: a four-product `sd_compare` cookie, product-page compare control, header count link, `/compare` table with category, vendor, price, rating, variant count and stock, and clearing/removal that updates in place.
- Phase 4 coupons: `coupons` migration and a vendor relation; percentage, fixed and free-shipping rules in `@sd/domain`; four seeded codes; server-side code validation, eligibility and integer-poisha pricing; coupon entry in the drawer with applied-code removal; discount row in the totals. The migration ran through the `Database` workflow (run 40678423792) and the seed (run 40678549502) loaded the four codes.
- Coupon production check: `BOISHAKH10` reduced the ৳3,840 leather-belt cart by ৳384 and showed a ৳3,576 estimated total; the code and discount survived a reload, so the cart row and rule were persisted server-side.
- Phase 5 implementation: checkout migration for addresses, orders, sub-orders, order items, payments, attempts, stock reservations, coupon redemptions and the mail outbox; 64-district address data and validation; per-seller shipping with Dhaka, outside-Dhaka and remote zones; integer discount allocation; COD and MockPay order placement; signed 30-minute MockPay links and an idempotent callback; receipt, printable invoice and in-app outbox.
- Product cards, buy boxes and the cart drawer are bilingual in English and Bangla; shortage messages and totals use the active language.
- Neon migration and two idempotent seeds ran successfully through the `Database` GitHub Actions workflow. The Phase 4 cart/wishlist migration was applied by the `Database` workflow (run 40672398462) and reported all migrations successful.
- Unit tests: 99 across `@sd/domain`, `@sd/ui` and `@sd/web`, including deterministic seed invariants, catalog filter validation, cart grouping and delivery totals, coupon rules and comparison cookie parsing and limits.
- Lint, typecheck, tests and build pass locally; the build does not touch the database.
- Production verification: the catalog returned 200 with 432 products, a department filter changed the result count, English `jamdani` returned six sarees, Bangla `শাড়ি` returned 36, and a product page switched variants with the correct price and SKU. The home page showed 12 live departments, blank price fields no longer hid results, and the catalog and product page had no horizontal overflow at 360 px. Phase 2 demo sign-in and role guards were re-verified earlier on the same deployment.
- Phase 4 production smoke test: a guest cart survived a reload, the drawer totalled correctly after a quantity change, demo sign-in merged the guest row into the user cart (2 + 1 = 3), wishlist save and removal updated the page live, and the comparison page rendered from the cookie. CI run 40675747563 passed on all three operating systems and the Vercel deployment reported Ready.

## Now
- Phase 5 checkout is implemented and passes lint, typecheck, 99 tests and build. The checkout migration still needs to run through the `Database` workflow before the deployed checkout can be exercised.

## Next
- Apply the `20261028200000_checkout_orders` migration, then place one COD order and one MockPay order on production, check the receipt, invoice and outbox, and repeat the MockPay callback to confirm it does not duplicate.
- Add a database-backed concurrency check for the last unit of stock, and a released-reservation path for abandoned MockPay orders.
- Verify the remaining Phase 4 production edge cases: stock-limit row errors, save-for-later from the drawer, the four-product compare cap and clearing a comparison.
- Add a catalog query integration test once there is a disposable test database or a Prisma mock.
- Consider the full seed volumes from [the data specification](spec/04-data-and-seed.md) when orders and reviews need more rows.

## Blocked
- Phase 10 Java hosting: Hugging Face Docker Spaces currently require a paid plan; a free-compliant alternative must be verified before that phase.

## Known issues
- Search matches only English and Bangla product titles and leaf-category names. Descriptions, variants and vendor names are not searched; there is no typo tolerance, stemming or autosuggest yet.
- Product imagery is an original SVG jamdani pattern per department tone. There is no media host, photo, gallery or zoom.
- Ratings, review counts and follower counts are seeded display summaries, not review rows. Reviews arrive in Phase 6.
- Listing pagination uses an offset `page` parameter; the specification's cursor pagination is deferred.
- The catalog seed is below the full data-spec target of 800+ products and 40+ vendors; see [decisions](DECISIONS.md).
- Vercel can queue production builds for several minutes.
- Moderator and content editor production logins were not exercised individually; their role checks share the restricted admin branch verified with finance and are covered by unit tests.
- Seller and admin pages remain read-only foundations. Catalog editing, orders, finance and CMS tools arrive with their phases.
- Rotating `DEMO_ACCOUNT_PASSWORD` requires re-running the seed workflow so existing demo passwords match.
- Cart totals are an estimate: the drawer uses a flat ৳120 below the free-delivery threshold, while checkout charges per seller by destination zone.
- MockPay reservations are held for 30 minutes but no scheduled job releases abandoned ones yet; a later job must restore stock and cancel the pending order.
- SSLCommerz sandbox and Stripe test mode are not wired because both need owner accounts and sandbox credentials. The checkout currently offers COD and MockPay only.
- Order emails are captured in the in-app outbox; no mail provider is configured.
