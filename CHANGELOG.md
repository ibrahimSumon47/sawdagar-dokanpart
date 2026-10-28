# Changelog

## Unreleased

- Add guest and signed-in carts with a 30-day lifetime, guest-cart merge on sign-in, and server-side stock checks.
- Add the add-to-cart flow with spinner and check states, a toast with undo, and optimistic drawer updates that roll back on failure.
- Add the vendor-grouped cart drawer with quantity steppers, remove, save-for-later, free-delivery progress and an estimated total.
- Add the DB-backed wishlist with heart controls on catalog cards and product pages, guest sign-in prompts, and `/wishlist`.
- Add four-product comparison with a header count, product-page controls and the `/compare` table.
- Add comparison-cookie and cart-total unit tests; document the cart, wishlist, comparison and server actions.
- Add the catalog schema, migration and deterministic seed for 12 departments, 72 leaf categories, 24 vendors, 432 products and 1,296 variants.
- Add the `/catalog` listing with URL-synced search, category, vendor, price, rating, stock and sort filters, pagination, empty states and layout-matching skeletons.
- Add the `/product/[slug]` page with variant selection, stock, vendor summary, breadcrumbs, related products and Product JSON-LD.
- Build the home department tiles and featured products from the seeded database, and support English and Bangla catalog search.
- Add catalog filter and seed invariant tests; document the catalog, search limits and seed decisions.

- Add Better Auth email/password sessions on Neon, with admin and organization plugins, database rate limiting and an eight-role permission model.
- Add one-click demo sign-in for eight allowlisted roles, with server-side role guards, safe redirects and audit logging.
- Add the account profile, vendor store summary, permission-filtered admin overview and audit log, plus a forbidden page and route error boundary.
- Add the Prisma schema, initial migration and idempotent demo seed, run through a manual `Database` workflow.
- Verify demo sign-in, guard redirects and permission-filtered admin panels on the production deployment.

- Add the Phase 1 design system: Editorial Heritage tokens, light and dark themes, Fraunces/Inter/Noto Sans Bengali type, shared components with skeleton pairs, and a `/design` gallery at six widths.
- Add the storefront shell with an announcement strip, sticky header, mobile menu, footer and trust strip.
- Add cookie-backed theme and language preferences, with complete English and Bangla copy and no flash on first paint.
- Establish the workspace, static bilingual demo introduction, and CI quality gates.
- Document the current architecture, security, database, API, credits, and Phase 0 owner actions.
- Record the live demo, Neon Free project, and free-service constraints for later phases.
- Add a pinned Prettier configuration and web source formatting check, with consistent source line endings across platforms.
