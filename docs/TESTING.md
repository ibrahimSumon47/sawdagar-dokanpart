# Testing

The quality gates are `pnpm lint` (format check plus ESLint), `pnpm typecheck`, `pnpm test` and `pnpm build`. CI runs them on Linux, Windows and macOS.

## Unit tests

| Package | Tests | What they cover |
|---|---|---|
| `@sd/domain` | 73 | Taka formatting in English and Bangla numerals, including signed and negative-zero ledger balances, category tree shape, the eight platform roles, area boundaries, vendor staff limits, super-admin coverage, the demo allowlist and one account per role; the deterministic catalog seed, 84-category tree, 432 products and 1,296 variants, unique slugs and SKUs, whole-taka prices, stock totals, leaf-category and vendor references, sale/out-of-stock coverage, and slugify; percentage, fixed and free-shipping coupons, caps, vendor scope, minimum subtotal, and expiry rules; seller approval, signed stock changes and their limits, product-status narrowing and sales summaries; commission rounding, seller net after discount and shipping, balanced delivery, payout and refund entries, account balances, the payout minimum and available balance |
| `@sd/cs-core` | 15 | WebAssembly and TypeScript parity for every search fixture pair, including Bangla; search ordering rules (exact above prefix above fuzzy, coverage over one strong token, stable ties); SKU normalization, validation and check characters with WASM parity; demand signal values against the Python fixtures; settlement values against the Java fixtures |
| `@sd/ui` | 17 | Button markup, price rendering and discounts, signed balances only when allowed, product card content, skeleton parity via shared layout constants, selected token contrast on plain and tinted backgrounds in both themes, quantity clamping |
| `@sd/web` | 65 | Catalog key parity and Bengali script, locale and theme guards, safe post-sign-in redirects, English and Bangla date formatting; catalog filter parsing, invalid-value fallbacks, price-range swapping, canonical filter links, page reset rules and Bangla query encoding; cart grouping, quantity counts, delivery threshold, free-delivery progress, coupon discount totals, and an ineligible coupon falling back to no discount; comparison cookie parsing, deduplication, the four-product cap and limit responses; CMS slug, status, scheduling and optional-field validation, the admin navigation each role receives, search-snippet shortening at a word boundary, and the committed `llms.txt` matching the route's text |

## Lighthouse

The `Lighthouse` workflow (`.github/workflows/lighthouse.yml`, configured by `.lighthouserc.json`) audits the deployed home, catalog and product pages with mobile emulation. It runs manually and every Monday, because it measures the live deployment rather than a local server. The job fails when performance, accessibility, best practices or SEO fall below 90, or when cumulative layout shift exceeds 0.1. Reports are kept as workflow artifacts for 14 days.

## Phase 12 checks

On 2026-10-30, `pnpm lint`, `pnpm typecheck`, `pnpm test` (170 tests), `pnpm build` and `pnpm perf:budget` passed, along with the new `pnpm facts:check` and `pnpm repo-map:check` jobs. Lint reported the four known `next/image` warnings and no errors. The budget measured 249.1 KiB gzipped client JavaScript, 10.0 KiB gzipped CSS, a 71.8 KiB largest chunk, 852.0 KiB of catalog photographs and a 144.8 KiB largest photograph.

The first typecheck of the slice failed: the `/llms.txt` route imported `../../../lib/llmsText`, one directory above the application. The import now resolves to `../../lib/llmsText`, and the parity test checks that the served text matches the committed `llms.txt`. The test counts in `docs/PROJECT_FACTS.json` are counted from `it(` declarations by `scripts/gen-project-facts.mjs`, and the twelve feature-to-file paths are checked for existence before the file is written, so the facts file and the test table cannot drift silently; CI reruns both generators with `--check`.

The first CI run for the showcase commit then failed only on Windows, at `pnpm facts:check`: Git checked the generated JSON out with CRLF while the generator wrote LF, so the byte comparison failed on that runner alone. Both generators now normalise CRLF before comparing, and `PROJECT_FACTS.json`, `repo-map.md` and `llms.txt` are pinned to LF in `.gitattributes`. The tolerance was verified by converting both generated files to CRLF and rerunning the checks before restoring them.

On the deployment, `/case-study` returned 200 with a self-referencing canonical, `SoftwareSourceCode` JSON-LD, the footer link and an entry in the 473-URL sitemap. `/llms.txt` returned 200 as `text/plain; charset=utf-8` and was byte-identical to the root file, including the product link to the in-stock leather belt. The six README screenshots were captured from production at 1280 × 860 and 390 × 844 in a fresh headless browser, so no signed-in state or browser overlay appears; the catalog shot shows the replaced "Independent sellers" eyebrow instead of the old development label.

The case-study page was exercised at 360 px in dark theme and with the Bangla locale: `scrollWidth` equalled `clientWidth`, all five sections and the eight repository links rendered, and 340 Bengali characters appeared in the localized shell. The article body stays English by design, like the README and architecture document; only the shared shell is translated.

The prior CI run 41069451787 passed on three operating systems; the final showcase run and Vercel deployment are recorded in [PROJECT_STATE.md](PROJECT_STATE.md).

## Phase 11 checks

On 2026-10-30, `pnpm lint`, `pnpm typecheck`, `pnpm test` (170 tests, including the later `llms.txt` parity check), `pnpm build` and `pnpm perf:budget` passed. Lint reported four `next/image` warnings for plain image elements. The budget check measured 249.0 KiB gzipped client JavaScript, 9.8 KiB gzipped CSS, a 71.8 KiB largest gzipped chunk, 852.0 KiB of catalog photographs and a 144.8 KiB largest photograph; all were within their configured limits.

Unit tests cover container-query parity between product grids and their skeleton, the sold-out badge corner, localized division and district names with unchanged English identifiers, localized descriptions for every credited department photo, sitemap store eligibility, and selected status colors against 10% tinted backgrounds in both themes.

On the production deployment, the browser was resized to 360, 640, 768, 1024, 1280 and 1536 px. Home and catalog had no horizontal overflow at any width; the product page had none at 360, 768, 1024, 1280 and 1536. The catalog grid used 2, 2, 3, 3, 4 and 4 columns as its container narrowed beside the filters, while the wider home and wishlist containers reached five columns. The product page switched to a two-column layout with a sticky buy box at 1024 px. In Bangla, home and catalog carried more than 1,200 Bengali characters, `lang="bn"` was set, shipping districts, image descriptions, department names and credit captions were translated, and no width overflowed.

axe-core 4.10.2, injected into the deployed pages, reported zero violations on home (light at 360 px and dark at 1536 px), catalog (light at 360 px), product (dark at 1280 px), account (light at 360 px), help (light at 1280 px), design gallery (light at 1280 px), credits (light at 360 px) and CS lab (light at 1280 px). This was a manual browser audit of representative templates, not a substitute for an automated job on every route.

Lighthouse CI (run 41067055369, median of three mobile runs per URL) scored:

| Route | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home | 93 | 100 | 100 | 100 | 3.06 s | 124 ms | 0 |
| Catalog | 95 | 100 | 100 | 100 | 2.78 s | 71 ms | 0 |
| Product | 93 | 100 | 100 | 100 | 3.19 s | 68 ms | 0 |

The workflow asserts 90 for each category and 0.1 for cumulative layout shift. The home page had one 83 run in the same batch, which is why the job uses a median of three. An artifact check on the same run confirmed 100 SEO on all three URLs, with no failed SEO audit.

SEO checks on the deployment found and fixed two defects: every route inherited a canonical URL pointing at the home page, and dynamic product metadata streamed into the body instead of the head. Product and catalog canonicals are now self-referencing, product and store descriptions are shortened to at most 160 characters, and `htmlLimitedBots: /.*/` makes metadata blocking so titles and descriptions are in the head. `robots.txt` returned 200 with the private routes disallowed, the sitemap returned 472 URLs (432 products and 24 stores), and an unknown route returned the localized 404 page with status 404. The custom error boundary was not triggered in production; its retry and storefront actions are covered by the build and manual inspection only.

## Phase 9 production check

On 2026-10-28 the admin/CMS migration (run 40706126268) and seed (run 40706283350) completed through the `Database` workflow: 11 bilingual entries with their first version and two feature flags. On the deployment:

- `/help` listed the four published articles in English and Bangla, hid the scheduled Eid article, and had no horizontal overflow at 360 px; `/journal` listed three posts and kept the draft out; an article page rendered its title, date, excerpt and paragraphs, and the dark theme applied;
- as `editor@demo.sawdagar.test`, `/admin/content` showed 11 entries across published, scheduled and draft states and the admin navigation offered only Overview, Content and Analytics; saving a contact-page excerpt created version 2 with a success notice, restoring version 1 created version 3 with `Restored from version 1`, and the audit log listed both `cms.updated` and `cms.version.restored`;
- as `admin@demo.sawdagar.test`, turning the Journal flag off made `/journal` return the 404 page and turning it on restored the three posts; the store queue went from 0 to 1 pending when the vendor resubmitted KYC, and approving it returned 24 approved and 0 pending; hiding one review moved the published count from 1,756 to 1,755 and publishing it restored the count;
- `/admin/analytics` showed GMV ৳16,916, delivered ৳10,090, commission ৳0 after the refund, refunds ৳3,250, 4 orders, 24 active stores, 25 buyers, 432 active products, 1,756 published reviews and 1 open return;
- `/admin/audit` listed `feature_flag.updated`, `cms.*`, store decisions, finance actions and demo sign-ins with a working second page.

Two presentation gaps found in the pass were fixed: the store queue showed raw `pending`/`sole_proprietor` codes, and the back link on a static page pointed at the Journal. The queue now uses translated status and business-type labels, and the static page returns to the storefront.

## Phase 10 local checks

On 2026-10-28 the CS core slice passed `pnpm lint`, `pnpm typecheck`, `pnpm test` (154 tests) and `pnpm build`. The build listed `/cs-lab` as dynamic and did not connect to the database. The new package tests load the compiled WASM and compare it with the port: 108 search query/document pairs, nine SKU cases, seven demand fixtures and five settlement fixtures. `node scripts/check-reference-modules.mjs` ran `insights.py` (seven fixtures) and compiled and ran `Settlement.java` (five fixtures) locally. CI runs the same script with `--require` in a dedicated `Reference modules` job, so a missing or broken Python or JDK install fails the build.

The build is 2.7 KB for search-core and 1.1 KB for sku-kit. Two defects were caught by the parity tests while building them: the C bump allocator returned heap-relative offsets while the loader wrote at absolute addresses, and the SKU state machine left a pending dash armed after the first letter, producing `S-D-0001-1`. Both were fixed in the C source and the tests now pin the behaviour.

## Phase 10 production check

On 2026-10-28 commit `40d423d` deployed and CI run 40717345571 passed all four jobs: the Linux, Windows and macOS checks and the new `Reference modules` job. On the deployment:

- `/cs-lab` reported `ENGINE: WEBASSEMBLY` for both native modules, all six query/document pairs returned the same score from the compiled module and the port, the SKU rows showed `sd - 0001/1` → `SD-0001-1` with check `Y`, and the demand and settlement tables showed the fixture values (৳3,734 paid, ৳1,000.55 carried).
- `/catalog?q=jamdani` served the six sarees with the relevance note "Ordered by search-core, compiled to WebAssembly" above the grid, so the production server instantiated the committed WASM.
- Signed in as the vendor owner, `/seller/analytics` showed the new Demand column with a Rising label and a days-of-cover line. Signed in as the finance admin, `/admin/finance` showed the settlement card and its empty state, because no payout was waiting at that moment.
- The CS core commit did not change the schema, so no migration or seed run was needed.

## Phase 9 local checks

On 2026-10-28 the admin and CMS slice passed `pnpm lint`, `pnpm typecheck`, `pnpm test` (139 tests) and `pnpm build`. The build listed `/admin/stores`, `/admin/reviews`, `/admin/content`, `/admin/content/[id]`, `/admin/content/new`, `/admin/analytics`, `/admin/flags`, `/admin/audit`, `/help`, `/help/[slug]`, `/journal`, `/journal/[slug]` and `/pages/[slug]` as dynamic routes and did not connect to the database.

New tests cover CMS input validation and admin navigation. The first test run failed on three cases and exposed a real defect: the editor posts `id: null` for a new entry and `publishDate: ''` when no date is chosen, both of which the original schema rejected, so creating any entry would have failed validation. `optionalText` now accepts nullish values and the date field accepts an empty string; the tests and a scheduled-entry case pass.

## Phase 8 local checks

On 2026-10-28 the finance slice passed `pnpm lint`, `pnpm typecheck`, `pnpm test` (129 tests) and `pnpm build`. The build listed `/seller/finance` and `/admin/finance` as dynamic routes and did not connect to the database. New domain tests cover commission rounding down, seller net on discounted goods plus shipping, balanced delivery, payout and refund transactions, account balances, in-flight payouts reducing the available balance, the ৳1,000 payout minimum and signed balance formatting, and negative zero printing as `৳0`. The UI test covers an allowed negative balance. Two expectations written before the formulas were final were corrected: commission is taken after the discount, and a refund debits the seller payable rather than crediting it.

The production payout run then exposed a rendering crash that local tests missed: refunding a ৳3,250 order after a ৳1,500 payout left platform cash at -৳1,440, and `formatTaka` rejects negative amounts. The action had already committed, but the redirected page hit the error boundary. `formatTakaSigned` and an opt-in `allowNegative` on `Price` now render ledger balances with a leading minus, and the platform payable keeps its sign instead of being clamped at zero.

## Phase 8 production check

On 2026-10-28 the finance migration (run 40696952497) and seed (run 40697066479) completed through the `Database` workflow. On the deployment:

- `/seller/finance` showed the Rupsha store's negotiated 7% rate, ৳0 paid out and an empty statement before a sale; delivering the seeded sub-order posted the ledger and moved the page to ৳3,082.50 available, ৳227.50 commission and one statement row of ৳3,082.50 net;
- a ৳1,500 payout request succeeded with a note, the notice appeared, available fell to ৳1,582.50 and payouts in progress rose to ৳1,500;
- as `finance@demo.sawdagar.test`, `/admin/finance` showed ৳3,310 cash, ৳227.50 commission and ৳3,082.50 owed to sellers; the payout moved Requested → Approved → Paid, leaving ৳1,810 cash and ৳1,582.50 owed;
- refunding the approved ৳3,250 return emptied the refund queue, listed the refund under recent refunds, and left cash at -৳1,440, commission at ৳0 and a negative seller payable. The buyer's `/account/returns` showed the request as Refunded with its resolution note;
- `/seller/finance` then showed ৳0 available, ৳1,500 paid out, the refund and its ৳227.50 reversed commission, and the delivered statement; the same page rendered in Bangla.

Two defects were found and fixed in this pass: the page crashed when negative cash reached `Price`, and a fully reversed commission printed `৳-0`. `formatTakaSigned`, an opt-in `allowNegative` on `Price` and a negative-zero guard now handle both, and the tests cover them. A third gap was closed by listing refunds on the seller page, so a refunded sale no longer looks unpaid.

## Phase 7 local checks

On 2026-10-28 the Seller Center slice passed `pnpm lint`, `pnpm typecheck`, `pnpm test` (118 tests) and `pnpm build`. The build listed `/seller`, all eight seller sub-pages, `/seller/products/export` and `/store/[slug]` as dynamic routes and did not connect to the database. New domain tests cover store and KYC approval, signed stock changes including zero, fractional, negative and oversized values, product-status narrowing, and delivered/pipeline/cancelled sales totals.

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

## Phase 7 production check

On 2026-10-28 the seller-center migration (run 40691015764) and seed (run 40692357548, repeated after the shipping fix) completed through the `Database` workflow. On the deployment, signed in as `vendor@demo.sawdagar.test`:

- `/seller` showed the Rupsha Tangail Weavers store as approved, its KYC-approved notice, delivered and pipeline revenue, one order to pack, 17 low-stock variants and the seeded confirmed sub-order;
- `/seller/products` listed 18 products with status, category, price, stock and edit links, and the new-product and CSV-export links;
- the product edit page prefilled both titles, both descriptions, the category and all three variants, and saving it returned the success notice;
- `/seller/inventory` listed 54 variants; a +2 adjustment with the reason restock and a note saved and refreshed the product total;
- `/seller/orders` listed the seeded sub-order; confirming, packing, shipping with `Sundarban Courier` and `SD-4471-8820`, then delivering each saved and advanced the timeline, and the courier and tracking number were displayed;
- `/seller/promotions` created `RUPSHA10`, a 10% store coupon with a ৳500 minimum, and the row appeared with its rule and zero redemptions;
- `/seller/store` prefilled the approved KYC record and storefront copy, saved an edited announcement, and the public `/store/rupsha-tangail-weavers` page rendered 18 active products with no horizontal overflow;
- the reseed exposed that `৳60` shipping had been stored as 60 poisha (৳0.60) and that a reset kept old fulfillment timestamps; both seed bugs were fixed, and the final seeded order shows ৳60 shipping and ৳3,310 total with a clean confirmed state.

The cross-account path was then exercised in full: the demo buyer asked a question on a Rupsha product and opened a not-as-described return for the delivered seller order; the vendor answered the question and approved the return with a resolution note. The return list exposed the stored reason code instead of its localized label, which was fixed by passing the buyer returns copy into the seller card. CI passed on the final commit, and the Vercel production deployment reported Ready.

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
- Asset budgets run in CI, but Lighthouse, axe and automated responsive browser checks are still outstanding for Phase 11.
