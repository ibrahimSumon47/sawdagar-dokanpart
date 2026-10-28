# Testing

The quality gates are `pnpm lint` (format check plus ESLint), `pnpm typecheck`, `pnpm test` and `pnpm build`. CI runs them on Linux, Windows and macOS.

## Unit tests

| Package | Tests | What they cover |
|---|---|---|
| `@sd/domain` | 58 | Taka formatting in English and Bangla numerals, category tree shape, the eight platform roles, area boundaries, vendor staff limits, super-admin coverage, the demo allowlist and one account per role; the deterministic catalog seed, 84-category tree, 432 products and 1,296 variants, unique slugs and SKUs, whole-taka prices, stock totals, leaf-category and vendor references, sale/out-of-stock coverage, and slugify; plus percentage, fixed and free-shipping coupons, caps, vendor scope, minimum subtotal, and expiry rules |
| `@sd/ui` | 13 | Button markup, price rendering and discounts, product card content, skeleton parity via shared layout constants, WCAG AA contrast in both themes, quantity clamping |
| `@sd/web` | 42 | Catalog key parity and Bengali script, locale and theme guards, safe post-sign-in redirects, English and Bangla date formatting; catalog filter parsing, invalid-value fallbacks, price-range swapping, canonical filter links, page reset rules and Bangla query encoding; cart grouping, quantity counts, delivery threshold, free-delivery progress, coupon discount totals, and an ineligible coupon falling back to no discount; comparison cookie parsing, deduplication, the four-product cap and limit responses |

## Phase 6 local checks

On 2026-10-28 the reviews, questions and returns slice passed `pnpm lint`, `pnpm typecheck`, `pnpm test` (113 tests) and `pnpm build`. The build listed the four new account routes as dynamic and did not need a database. New domain tests cover rating averages and distribution, invalid rating values, review eligibility and the seven-day return window including its closing minute. The web tests cover review input validation (rating bounds, short text, bounded image data URLs and seeded order-line ids) and question validation (length bounds and seeded product ids).

## Phase 5 local checks

On 2026-10-28 the checkout slice passed `pnpm lint`, `pnpm typecheck`, `pnpm test` (99 tests) and `pnpm build`. The build listed `/checkout`, `/checkout/pay/[paymentId]`, `/orders/[number]`, `/orders/[number]/invoice`, `/account/mail` and `/api/payments/mockpay` as dynamic routes and did not connect to the database. The new domain tests cover 64 districts, zone rates, per-seller shipping, exact discount allocation, order/sub-order/payment transitions and order numbers. The web tests cover MockPay token signing and expiry, address validation and mass-assignment-safe form reading.

## Phase 6 production check

On 2026-10-28 the review/returns migration and two seed runs completed through the `Database` workflow: 1,755 reviews across 432 products and two delivered orders for `buyer@demo.sawdagar.test`. On the deployment, as that buyer:

- `/account/orders` listed both seeded orders with their seller counts;
- `/account/reviews` listed the three delivered lines, published a five-star review with a verified-purchase badge, and the product page average moved from 4.3 with 6 reviews to 4.4 with 7;
- `/account/returns` opened a not-as-described request and removed that line from the returnable list;
- a product question was sent, appeared under Questions and answers, and the account's Questions tab listed it as awaiting the seller;
- the Bangla account pages rendered the new copy, and the account pages had no horizontal overflow at 360 px;
- CI run 40687496385 passed on Linux, Windows and macOS, and the Vercel deployment was Ready.

Two defects found in this pass were fixed: passing formatter-bearing dictionaries to the client review and profile forms, and validating seeded readable ids as UUIDs. The seed now reads rating aggregates back from the database so a reseed keeps buyer-written reviews in the average.

## Production smoke check

On 2026-10-28 the catalog migration and seed ran through the `Database` workflow: 84 categories, 24 vendors, 432 products and 1,296 variants. The deployed listing returned 200 and reported 432 products.

The deployed build was then exercised in a browser:

- the listing rendered with its heading, search form, 12 department chips, filters, product grid and pagination;
- a department filter narrowed the result count and kept the filter in the URL;
- English `jamdani` returned six sarees and Bangla `শাড়ি` returned 36;
- the product page rendered media, title, rating, variant radios, stock, vendor card and related products;
- selecting the second variant changed the displayed price and SKU;
- submitting the filter form with both price boxes empty returned all 432 products after blank fields were treated as absent, instead of the zero-taka maximum that hid every result;
- the home page listed all 12 departments from the live category tree;
- the product page had no horizontal overflow at 360 px and the catalog had none at 360 or 768 px;
- the variant-picker deployment error caused by passing formatter functions across the server/client boundary was fixed and the page re-verified.

The auth deployment was also exercised through the real sign-in page: buyer, vendor owner, vendor staff, support, finance and super admin opened their demo sessions. Vendor staff saw only the account and Seller Center links, support saw the user directory but not the audit log, finance saw neither, and the super admin saw both. Opening `/admin` as a vendor redirected to `/forbidden`.

## Phase 4 local checks

On 2026-10-28 the full gate passed after the shop slice: `pnpm lint` (Prettier plus ESLint), `pnpm typecheck`, `pnpm test` (65 tests) and `pnpm build`. The build listed `/wishlist` and `/compare` as dynamic routes and did not connect to the database. The cart migration was applied to Neon by the `Database` workflow (run 40672398462).

The coupon slice then passed the same gate with 74 tests: seven in `@sd/domain` cover percentage, fixed and free-shipping discounts, caps, vendor scope, minimum subtotal and expiry, and two in `@sd/web` cover a discount subtracted from the estimated total and an ineligible coupon being ignored. The coupon migration (run 40678423792) and seed (run 40678549502) completed. On production, `BOISHAKH10` reduced the ৳3,840 cart by ৳384 to ৳3,576; after a reload in a fresh tab the code and discount were still applied. The deployed build was then exercised on the production origin:

- a guest added the small leather belt, the drawer opened at ৳1,280 and the quantity stepper moved it to two at ৳2,560 with a ৳120 delivery fee;
- a full reload kept the guest cart at two items, confirming the `sd_cart` cookie and database row;
- after signing out, the guest added one more belt and signed in through the support demo account; the cart showed three, so the guest row had merged into the existing user cart and the cookie was cleared;
- the product-page heart saved the belt and `/wishlist` listed it; removing the heart left the wishlist empty state without a reload;
- adding the belt to compare created the header count link, and `/compare` rendered the one-column table with an "add another product" notice and its vendor, price, rating, category, variant and stock rows.

Still to exercise on production: changing quantity past stock to see the inline row error, saving a cart row for later, adding four products and confirming the fifth is refused, and removing a column or clearing the comparison.

## Not yet covered

- No test signs in against a database. The role model, allowlist and redirect rules are unit-tested, but the Better Auth session round trip, rate limiting and audit write still need an integration test with a test database or a mocked adapter.
- No test executes the Prisma catalog queries against a database. The production smoke check exercises them, but they are not automated. Add a seeded test database and query tests when checkout begins to depend on stock.
- There is no browser, end-to-end, accessibility or visual-regression test, and no automated check of the six gallery widths.
- Lighthouse budgets, axe and Playwright are scheduled with later phases.
