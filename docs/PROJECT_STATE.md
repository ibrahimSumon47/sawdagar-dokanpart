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
- Phase 4 coupons: `coupons` migration and a vendor relation; percentage, fixed and free-shipping rules in `@sd/domain`; four seeded codes; server-side code validation, eligibility and integer-poisha pricing; coupon entry in the drawer with applied-code removal; discount row in the totals.
- Product cards, buy boxes and the cart drawer are bilingual in English and Bangla; shortage messages and totals use the active language.
- Neon migration and two idempotent seeds ran successfully through the `Database` GitHub Actions workflow. The Phase 4 cart/wishlist migration was applied by the `Database` workflow (run 40672398462) and reported all migrations successful.
- Unit tests: 74 across `@sd/domain`, `@sd/ui` and `@sd/web`, including deterministic seed invariants, catalog filter validation, cart grouping and delivery totals, coupon rules and comparison cookie parsing and limits.
- Lint, typecheck, tests and build pass locally; the build does not touch the database.
- Production verification: the catalog returned 200 with 432 products, a department filter changed the result count, English `jamdani` returned six sarees, Bangla `শাড়ি` returned 36, and a product page switched variants with the correct price and SKU. The home page showed 12 live departments, blank price fields no longer hid results, and the catalog and product page had no horizontal overflow at 360 px. Phase 2 demo sign-in and role guards were re-verified earlier on the same deployment.
- Phase 4 production smoke test: a guest cart survived a reload, the drawer totalled correctly after a quantity change, demo sign-in merged the guest row into the user cart (2 + 1 = 3), wishlist save and removal updated the page live, and the comparison page rendered from the cookie. CI run 40675747563 passed on all three operating systems and the Vercel deployment reported Ready.

## Now
- Phase 4 is complete: cart, wishlist and compare are deployed and production-verified, and coupon rules now pass lint, typecheck, 74 tests and build. The coupon migration and seed still need to run through the `Database` workflow before the deployed coupon form is verified.
- The product-thumbnail flight animation and the "you may also like" strip from the design spec remain out of scope until their phases.

## Next
- Apply the coupons migration and run the seed workflow, then apply `BOISHAKH10` in the deployed drawer and confirm the discount and removal.
- Verify the remaining production edge cases: stock-limit row errors, save-for-later from the drawer, the four-product compare cap and clearing a comparison.
- Start Phase 5 with addresses, checkout and the order/sub-order transaction.
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
- Cart totals are an estimate: delivery is free from ৳10,000 and otherwise a flat ৳120. Per-vendor shipping and checkout pricing arrive in Phase 5.
