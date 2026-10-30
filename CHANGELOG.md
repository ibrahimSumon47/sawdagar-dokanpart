# Changelog

## Unreleased

- Add a public `/case-study` page with project numbers, engineering decisions, hard problems, links and `SoftwareSourceCode` structured data, linked from the footer and sitemap.
- Rewrite the README as a portfolio overview with an original banner, six production screenshots, demo credentials, per-role features, architecture and ER diagrams, measured numbers and known limitations; add the MIT licence.
- Complete the architecture decision record set to ten records, index them from `docs/DECISIONS.md`, and refresh the free-service record to match the deployed services.
- Add `llms.txt` at the repository root and at `/llms.txt`, with a parity test, plus generated `docs/PROJECT_FACTS.json` and `docs/repo-map.md` and CI checks that fail when either generated file drifts.
- Replace the catalog's "Phase 3" eyebrow with storefront copy and recapture every README screenshot from production without the browser overlay.
- Fix the generated-file drift checks on Windows by normalising CRLF and pinning generated files to LF.
- Run Lighthouse against the deployed storefront in a manual and weekly workflow, with mobile budgets for performance, accessibility, best practices, SEO and layout shift.
- Localize the retry and storefront actions on the root error page.
- Give the home, catalog and product routes self-referencing canonical URLs and keep the shared social card on product pages.
- Keep product and store meta descriptions within search-snippet length and use the store's description in the active language.
- Keep route titles and descriptions in the document head by making metadata blocking for every user agent.
- Hide the wordmark text on narrow headers so the logo is not clipped to a single letter, and label the home link for screen readers.
- Use licensed, locally stored department photography as representative catalog imagery, localize image descriptions and publish the attribution at `/credits`.
- Add SEO and error surfaces and enforce client asset budgets after builds.
- Include only approved, KYC-approved stores in the sitemap, matching the public store page.
- Improve status badge, seller notice and avatar contrast on tinted backgrounds in light and dark themes.
- Localize Bangladesh division and district display names without changing stored address identifiers.
- Make product grids and loading skeletons adapt to available width, and separate the sold-out badge from the wishlist control.

- Add the CS core package: C++ search ranking and a C SKU kit compiled to WebAssembly, plus Python demand insights and Java settlement reference implementations with TypeScript ports.
- Order catalog search results by relevance and typo tolerance instead of insertion order, with a WebAssembly-first engine and a port fallback.
- Give every new product SKU a position-weighted check character, and show trend, days of cover and restock hints on seller analytics.
- Preview the next payout settlement on admin finance, including whole-taka rounding and the amount carried forward.
- Add `/cs-lab`, which runs every module and shows whether the native or fallback engine answered.
- Add a CI reference job that runs the Python and Java modules over shared fixtures on every push.

- Add the admin store approval queue with the submitted KYC record, approve and reject decisions, and an audit entry for every decision.
- Add review moderation that publishes or hides a review and recomputes the product rating from the remaining visible rows.
- Add the Storefront CMS: static pages, Help Center articles and Journal posts with bilingual fields, SEO text, drafts, scheduled publishing and version history.
- Add version restore as a new snapshot, so admin edits never rewrite the history.
- Add the public Help Center, Journal and static page routes, linked from the footer and gated by feature flags.
- Add feature flags with bilingual labels and an admin switch that revalidates the storefront.
- Add platform analytics and a paginated audit viewer, plus role-filtered admin navigation for every admin page.
- Seed eleven bilingual content entries (four Help articles, three Journal posts, two static pages, one draft and one scheduled entry) and two feature flags.
- Fix the CMS schema rejecting a new entry because an empty id and empty publish date arrive from the form as null or empty strings.

- Add a double-entry ledger with commission per store, delivery, payout and refund transactions, and idempotent posting by kind and reference.
- Add seller finance: available balance, minimum payout requests, payout history and a delivered statement with commission.
- Add the platform finance queue: cash, commission and seller payable balances, payout approval, payment and rejection, and refunds for approved returns.
- Settle approved returns with a refund row and a reversing ledger transaction, and carry a negative store balance forward.
- Give the seed a negotiated 7% commission rate on every fourth store and keep the standard 8% elsewhere.
- Fix the finance page crashing after a refund that leaves platform cash negative by adding a signed taka format and an opt-in negative balance on `Price`.
- Show refunds and their reversed commission on the seller finance page, so a refunded sale does not look unpaid.

- Add the Seller Center with dashboard totals, product create/edit, variant price and stock editing, inventory adjustments with history, sub-order fulfillment, buyer questions, return decisions, store promotions, ninety-day analytics and store settings.
- Add store approval and KYC state, bilingual storefront CMS fields, fulfillment timestamps and courier details, and an append-only inventory adjustment table.
- Add a public store page with the store banner, verification, announcement, active products, about text and policies.
- Add CSV export of every store variant and a seeded confirmed COD order for the demo store.
- Fix seeded order shipping to store ৳60 as 6,000 poisha instead of ৳0.60, and clear stale fulfillment fields when the demo order is reseeded.

- Add verified-purchase reviews with stars, headline, body and up to three photos resized in the browser, and recompute each product's rating and count from published rows.
- Add product questions with public seller answers, a five-per-hour limit and an account view of the answers received.
- Add seven-day return requests for delivered order lines, with a reason, optional note and status.
- Add account tabs with order history, reviews, questions, returns and the mail outbox, plus two delivered demo orders and 1,755 seeded reviews for the demo buyer.
- Fix the account overview and review page by passing plain labels rather than formatter-bearing dictionaries to client forms.
- Add checkout with 64-district addresses, saved addresses, per-seller shipping zones, COD and MockPay.
- Add the order, seller sub-order, order-item, payment, stock-reservation, coupon-redemption and mail-outbox schema.
- Add conditional stock decrement in the order transaction, signed 30-minute MockPay links, an idempotent payment callback, receipts, printable invoices and the in-app outbox.
- Add percentage, fixed and free-shipping coupons with server-side eligibility, four seeded codes and a cart drawer form that shows the discount and can remove the code.
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
