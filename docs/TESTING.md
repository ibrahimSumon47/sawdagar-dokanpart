# Testing

The quality gates are `pnpm lint` (format check plus ESLint), `pnpm typecheck`, `pnpm test` and `pnpm build`. CI runs them on Linux, Windows and macOS.

## Unit tests

| Package | Tests | What they cover |
|---|---|---|
| `@sd/domain` | 26 | Taka formatting in English and Bangla numerals, category tree shape, the eight platform roles, area boundaries, vendor staff limits, super-admin coverage, the demo allowlist and one account per role; plus the deterministic catalog seed, 84-category tree, 432 products and 1,296 variants, unique slugs and SKUs, whole-taka prices, stock totals, leaf-category and vendor references, sale/out-of-stock coverage, and slugify |
| `@sd/ui` | 13 | Button markup, price rendering and discounts, product card content, skeleton parity via shared layout constants, WCAG AA contrast in both themes, quantity clamping |
| `@sd/web` | 20 | Catalog key parity and Bengali script, locale and theme guards, safe post-sign-in redirects, English and Bangla date formatting; plus catalog filter parsing, invalid-value fallbacks, price-range swapping, canonical filter links, page reset rules and Bangla query encoding |

## Production smoke check

On 2026-10-28 the catalog migration and seed ran through the `Database` workflow: 84 categories, 24 vendors, 432 products and 1,296 variants. The deployed listing returned 200 and reported 432 products.

The deployed build was then exercised in a browser:

- the listing rendered with its heading, search form, 12 department chips, filters, product grid and pagination;
- a department filter narrowed the result count and kept the filter in the URL;
- English `jamdani` returned six sarees and Bangla `শাড়ি` returned 36;
- the product page rendered media, title, rating, variant radios, stock, vendor card and related products;
- selecting the second variant changed the displayed price and SKU;
- the variant-picker deployment error caused by passing formatter functions across the server/client boundary was fixed and the page re-verified.

The auth deployment was also exercised through the real sign-in page: buyer, vendor owner, vendor staff, support, finance and super admin opened their demo sessions. Vendor staff saw only the account and Seller Center links, support saw the user directory but not the audit log, finance saw neither, and the super admin saw both. Opening `/admin` as a vendor redirected to `/forbidden`.

## Not yet covered

- No test signs in against a database. The role model, allowlist and redirect rules are unit-tested, but the Better Auth session round trip, rate limiting and audit write still need an integration test with a test database or a mocked adapter.
- No test executes the Prisma catalog queries against a database. The production smoke check exercises them, but they are not automated. Add a seeded test database and query tests when checkout begins to depend on stock.
- There is no browser, end-to-end, accessibility or visual-regression test, and no automated check of the six gallery widths.
- Lighthouse budgets, axe and Playwright are scheduled with later phases.
