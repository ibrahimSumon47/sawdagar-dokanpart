# 03 Architecture and technology

## Version policy
Use the newest stable release of every tool at the start of Phase 0 and pin exact versions in `docs/TECH_VERSIONS.md` (run `npm view <package> version`). Required: Next.js 16.4.3 or newer 16.4.x patch (Node 20.9+ required; use the newest LTS Node supported by Vercel; Next.js 16 uses `proxy.ts` instead of `middleware.ts`), sharp 0.35.5 or newer (security fix), React as required by that Next.js release, TypeScript latest 5.x, Tailwind CSS v4, shadcn/ui (re-themed with the design tokens), `motion`, Zod latest, React Hook Form, TanStack Query and TanStack Table, NestJS latest stable (Express adapter), Express 5, Prisma latest stable, Better Auth latest stable, Vitest, Playwright, ESLint flat config, Prettier, pnpm, Turborepo, Husky + commitlint. Re-check versions at the start of each phase and upgrade patch versions when safe.

## Repository layout (pnpm + Turborepo monorepo, package scope `@sd/*`)
- `apps/web`: Next.js storefront, Seller Center, admin and CMS (route groups: `(store)`, `(account)`, `(seller)`, `(admin)`).
- `apps/api`: NestJS modular monolith on the Express adapter (REST, OpenAPI), deployed to Vercel as a serverless function.
- `apps/gateway`: small standalone Express 5 app for webhooks (raw-body signature verification, idempotency).
- `services/insights` (Python, FastAPI as Vercel Python function), `services/settlement` (Java 21, Docker, Hugging Face Space), `native/search-core` (C++ to WebAssembly), `native/sku-kit` (C to WebAssembly). These come in Phase 10.
- `packages/ui` (design system components and skeleton pairs), `packages/domain` (pure business logic and state machines), `packages/validators` (Zod schemas shared by web and api), `packages/sdk` (typed API client generated from OpenAPI), `packages/config` (tsconfig, eslint, tailwind tokens), `packages/cs-core` (data structures and algorithms in TypeScript).
- `cli/`: Node CLI (`sd seed`, `sd reset-demo`, `sd doctor`).
- `docs/`, `.github/workflows/`, `scripts/` (Node `.mjs`).
If the free Vercel plan limits how many projects can be created, verify this in Phase 0 and record the outcome: fall back to fewer Vercel projects (for example, mount the API inside the web project as route handlers) and write an ADR.

## Auth: Better Auth
Better Auth with the Prisma adapter on Neon. Plugins: `organization` (a Vendor store is an organization; members have owner/staff roles with permission sets Catalog, Orders, Support), `admin` (platform roles and ban/impersonate with audit), `twoFactor` (TOTP), email OTP or magic link, Google sign-in. For Google OAuth, set the consent screen to "In production" with only basic scopes (openid, email, profile) so tokens do not expire as in testing mode. Sessions are server-validated; the NestJS API validates sessions through a guard using Better Auth, and authorization uses permission-based policies (roles map to permissions). One-click demo login for each role: a server action limited to demo accounts, rate-limited and logged.

## Database: Neon PostgreSQL (free) with Prisma
Use a pooled connection or Neon's serverless driver for serverless functions. Storage budget is small (verify current free limits in Phase 0): store NO images or files in the database (Cloudinary holds media), keep audit and analytics rows compact, and document the storage budget in `docs/DATABASE.md`. Schema (normalized to 3NF where sensible, with proper indexes), at minimum: users, sessions, accounts, organizations (vendors), members, profiles, addresses, categories (materialized path), attributes, brands, products, product_variants, product_images, inventory_levels, stock_reservations, carts, cart_items, wishlist_items, coupons, coupon_redemptions, orders, sub_orders, order_items, payments, payment_attempts, refunds, return_requests, shipments, shipment_events, reviews, review_media, review_votes, questions, answers, follows, notifications, ledger_accounts, ledger_entries, payouts, commission_rules, cms_pages, cms_blocks, cms_versions, banners, collections, nav_items, help_articles, feature_flags, audit_logs, idempotency_keys, jobs, outbox_events, search_synonyms, kyc_documents. Migrations run only through GitHub Actions (`workflow_dispatch`) using repository secrets. Document the 3 most important queries, their `EXPLAIN` output and indexes in `docs/DATABASE.md`, plus a Mermaid ER diagram.

## Search
PostgreSQL full-text search (tsvector) plus `pg_trgm` for typo tolerance, a synonyms table, and a Bangla/English transliteration dictionary for common marketplace terms. Autosuggest in the browser uses the C++ `search-core` WebAssembly module once Phase 10 lands (until then, a TypeScript trie in `packages/cs-core` behind the same interface).

## Backend design (how it works)
- NestJS modules: auth-bridge, users, vendors, catalog, inventory, search, cart, checkout, orders, payments, shipping, coupons, reviews, qna, wishlist, notifications, finance, cms, media, analytics, audit, settings, jobs, health.
- Layers: controller > application service > domain (pure, in `packages/domain`) > repository (Prisma). Dependency injection throughout. Controllers contain no business logic.
- API: REST under `/api/v1`, OpenAPI published at `/api/v1/openapi.json` with a docs page, request validation with Zod DTOs, error format RFC 9457 problem+json with stable error codes, cursor pagination, `Idempotency-Key` header on payments and checkout, ETag and Cache-Control on reads, request ID on every request, rate limits on auth, search and checkout.
- The web app calls the API through `packages/sdk`. Server Components fetch with cache tags and revalidate on mutation (`revalidateTag`); mutations use Server Actions that call the API. The browser never receives secrets.
- Order flow: cart (client + server) > checkout creates one Order and N SubOrders (one per vendor) in a single transaction > stock reserved with optimistic locking > payment intent created > webhook (via `apps/gateway`) confirms payment idempotently > sub-orders move through state machines (pending > confirmed > packed > shipped > delivered; cancelled; return states) with validated transitions and domain events written to an outbox table.
- Stock integrity: reservations inside transactions with a version column; expired reservations released by a scheduled job; a concurrency test proves no overselling.
- Finance: immutable double-entry ledger (commission, vendor payable, platform revenue, refunds, payouts). Balances are derived from entries, never stored. Server computes every price; client totals are never trusted.
- Background jobs: Postgres-backed job table using `FOR UPDATE SKIP LOCKED`, executed by protected cron endpoints. Vercel Hobby only allows a few daily cron schedules (verify), so use GitHub Actions scheduled workflows (free for public repos) to call the protected endpoints for anything more frequent.
- Payments behind a `PaymentProvider` interface: Cash on Delivery, **MockPay** (our own demo gateway page, works with zero accounts), SSLCommerz sandbox, Stripe test mode. Courier behind a `CourierProvider` interface with a clearly named demo courier that advances tracking events. Email behind a `Mailer` interface: Resend when a verified domain exists, otherwise an in-app "Mail outbox" page so every email flow can still be shown.
- Observability: structured JSON logs (pino), request IDs, `/api/v1/health`, audit log for privileged actions, Vercel logs.

## CS fundamentals (real modules wired into the product)
- **OOP (TypeScript domain)**: state pattern for order and payout lifecycles, strategy for shipping and commission rules, decorator for pricing adjustments, observer for domain events, specification pattern for coupon eligibility, repository and unit of work, immutable `Money` value object.
- **Java 21 `services/settlement`** (Phase 10): commission and settlement engine using abstract rules, chain of responsibility, BigDecimal money, JUnit 5; called through a TypeScript interface with a TypeScript fallback because free Hugging Face Spaces can sleep.
- **C++ `native/search-core`** (Phase 10): trie autosuggest, BK-tree/Levenshtein typo tolerance, compiled to WebAssembly with Emscripten in CI; tests and a benchmark against a naive JS version.
- **C `native/sku-kit`** (Phase 10): EAN-13 and Luhn checks, CRC32, fast CSV tokenizer for bulk import validation, compiled to WebAssembly; tests with sanitizers in CI.
- **Python `services/insights`** (Phase 10): item-to-item collaborative filtering and demand forecasting, FastAPI on Vercel, pytest.
- Concept coverage is documented in `docs/CS_FUNDAMENTALS.md` (OOP and SOLID, data structures, algorithm complexity, DBMS: ACID, normalization, indexes, isolation levels; OS: concurrency, locking, queues; networking: HTTP caching, idempotency, TLS, rate limiting) with exact file paths, and shown to visitors on a public `/cs-lab` page with interactive visualizations.

## Free services (all must be re-verified in Phase 0 and recorded in ADR-001)
| Need | Service | Notes |
|---|---|---|
| Hosting | Vercel Hobby | Non-commercial use only; no custom domain required |
| Database | Neon Postgres free | Scale-to-zero; small storage budget |
| Media | Cloudinary free | Monthly credits; compress uploads; no watermark |
| Email | Resend free | Needs a verified domain to email other people; fallback outbox |
| Cache/rate limit | Upstash Redis free | Fall back to in-database rate limiting if limits are hit |
| CI/CD | GitHub Actions | Free for public repositories |
| Java service | Hugging Face Spaces (Docker) free | May sleep; keep-alive workflow; TypeScript fallback |
| Payments | MockPay, SSLCommerz sandbox, Stripe test | Sandbox only, no real money |
| Maps/geo | Not required in this project | |
Excluded on purpose (trial or expiring): Render free Postgres, Railway trial, Heroku, any "free trial" tier.

## Security
OWASP ASVS Level 2 mapping in `docs/SECURITY.md` plus a short threat model; server-side Zod validation on every input; RBAC enforced on the server; CSRF protection on mutations; secure headers and a strict CSP; rate limiting; password hashing handled by Better Auth; file-upload type and size checks; signed webhooks with replay protection; no secrets in client bundles; dependency audit and CodeQL in CI; audit log for admin and vendor-owner actions.

## Testing and quality gates
- Vitest unit tests for domain logic (target 80%+ coverage in `packages/domain`), API integration tests, Playwright end-to-end tests for each role's main journey on Chromium, Firefox and WebKit at phone, tablet and desktop viewports, axe accessibility checks inside Playwright, skeleton parity tests.
- Performance budgets: LCP under 2.5 s, INP under 200 ms, CLS under 0.1, route JavaScript under 170 kB gzipped; Lighthouse mobile at least 90 for Performance, Accessibility, Best Practices and SEO on home, listing and product pages.

## CI/CD (GitHub Actions, push to `main` only)
Workflows: `ci` (lint, typecheck, unit tests on an ubuntu + windows + macos matrix, build), `e2e` (Playwright against the Vercel deployment URL, triggered by the `deployment_status` event), `lighthouse`, `codeql`, `db-migrate` and `db-seed` (`workflow_dispatch`), `demo-reset` (nightly cron), `keep-alive` (pings for services that sleep or pause), `screenshots` (Playwright captures for the README, committed to `docs/screenshots`), `docs-check` (fails if `docs/PROJECT_FACTS.json` or documented file paths are stale), `wasm-build`, `java-test` and `java-deploy` (Phase 10), `python-test`. Releases use semantic versions and `CHANGELOG.md`.