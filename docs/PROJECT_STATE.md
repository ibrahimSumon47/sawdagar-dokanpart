# Project state

## Done
- Product, design, architecture, data and roadmap specifications are documented.
- Phase 0: pnpm/Turborepo workspace, CI on Linux/Windows/macOS, Vercel deployment, pinned formatting and the documentation baseline.
- Phase 1: Editorial Heritage tokens and themes, fonts, server-rendered theme and language cookies, English and Bangla catalogs, storefront shell, shared components with skeleton pairs, and the `/design` gallery at six widths.
- Phase 2: Prisma 7 schema and initial migration for Better Auth users, sessions, accounts, organizations, members, invitations, rate limits, profiles and audit logs; Better Auth email/password with the admin, organization and Next.js cookie plugins; eight allowlisted demo accounts; role permissions in `@sd/domain`; server guards for the account, seller and admin areas; profile editing with Zod; audit logging; `/sign-in`, `/account`, `/seller`, `/admin` and `/forbidden`.
- Phase 3: catalog migration for categories, vendor profile fields, products and product variants; deterministic original seed of 12 departments, 72 leaf categories, 24 vendors, 432 products and 1,296 variants; `/catalog` listing with URL-validated search, category, vendor, price, rating, stock and sort filters; `/product/[slug]` page with variants, stock, vendor card, related products, breadcrumbs and Product JSON-LD; home departments and featured products now come from the database.
- Phase 3 pages have layout-matching loading skeletons, empty results and a route error boundary. The catalog is in both languages: Bangla numerals, category names, descriptions, variant names and search.
- Neon migration and two idempotent seeds ran successfully through the `Database` GitHub Actions workflow.
- Unit tests: 58 across `@sd/domain`, `@sd/ui` and `@sd/web`, including deterministic seed invariants and catalog filter validation.
- Lint, typecheck, tests and build pass locally; the build does not touch the database.
- Production verification: the catalog returned 200 with 432 products, a department filter changed the result count, English `jamdani` returned six sarees, Bangla `শাড়ি` returned 36, and a product page switched variants with the correct price and SKU. Phase 2 demo sign-in and role guards were re-verified earlier on the same deployment.

## Now
- Phase 3 is complete. Phase 4 (cart and wishlist) is next and has not started.

## Next
- Phase 4: guest and user cart, add-to-cart experience, drawer, wishlist, compare and coupons.
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
