# SEO audit

Scope: metadata, canonical URLs, Open Graph and Twitter cards, structured data, the sitemap and robots file, hreflang, and Core Web Vitals. Audited against the code in `apps/web/app` and `apps/web/features` on `main`.

## Findings and fixes

| #   | Finding                                                                                                                                                                                                       | Fix                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The root layout set `openGraph.url` to the home URL. Any page without its own Open Graph block inherited it, so social previews for help, journal, static pages and the index pages pointed at the home page. | `publicPageMetadata()` in `apps/web/lib/meta.ts` sets canonical, Open Graph and Twitter fields per page. Used on help, journal, static pages and their index pages. Covered by a unit test. |
| 2   | Help articles, journal posts, static pages and the help and journal index pages had no canonical URL.                                                                                                         | Each now sets `alternates.canonical` to its own path.                                                                                                                                       |
| 3   | `/design` and `/cs-lab` were in the sitemap, although they are developer pages.                                                                                                                               | Removed from the sitemap. Both pages now send `robots: { index: false }`.                                                                                                                   |
| 4   | Product JSON-LD always emitted `aggregateRating`, even with zero reviews. Google rejects a rating with no reviews behind it.                                                                                  | Emitted only when `reviewCount > 0`.                                                                                                                                                        |
| 5   | Product pages return an empty `{}` metadata object when the product is missing.                                                                                                                               | Kept: the page itself calls `notFound()`, which returns 404 with the root title. Nothing to fix.                                                                                            |
| 6   | Sitemap, robots and metadata base use the same `site.demoUrl`.                                                                                                                                                | Kept. The URL is the deployed production origin and is the single source of truth.                                                                                                          |

## Checked and in order

- `robots.ts` disallows private routes (`/account`, `/admin`, `/seller`, `/checkout`, `/orders`, `/wishlist`, `/compare`, `/login`, `/api/`) and points at the sitemap.
- `sitemap.ts` lists active products, approved and KYC-verified stores, and published CMS entries. It falls back to static routes without a database.
- Track-by-code pages (`/track/[code]`), order pages and order confirmation send `noindex`.
- Product pages set a canonical and an Open Graph image (`/opengraph-image`).
- The home page sets its canonical to `/`.
- Product descriptions are shortened to 160 characters by `metaDescription()`.

## Not done, and why

- **hreflang EN/BN.** Language is chosen by a cookie (`apps/web/i18n/getLocale.ts`), not by the URL. Both languages share one URL, so an hreflang pair would point at the same page. Adding `/bn/` routes is a large change and is out of scope for Revision 1. Recorded in `docs/DECISIONS.md`.
- **Core Web Vitals.** Measured by the Lighthouse workflow, not in this report. The latest run scored 93 to 95 on mobile performance, and the final audit in R10 records the current numbers.

## Verification

- Unit tests: `apps/web/lib/meta.test.ts` covers the new helper and the existing `metaDescription` behavior.
- The sitemap test (`apps/web/app/sitemap.test.ts`) still covers approved-store filtering and the no-database fallback.
