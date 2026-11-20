# Usage audit: Fluid Active CPU and function invocations

Date: 2026-11-20. The Vercel team was paused after 4h25m of the 4h Fluid Active
CPU allowance. Function invocations were 731K against 776K CDN requests: almost
one function call per CDN request, which is programmatic or uncached traffic, not
normal page views. Production was not touched during this audit.

Savings below are estimates based on the request shapes in the repository. They
could not be measured on the paused deployment; the next unpaused week should
replace them with dashboard numbers.

## Findings

| #   | Finding                                                                                                                       | Evidence                                                                                                 | Action                                                                                                        | Estimated saving                                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | Live tracking opened an SSE stream for four minutes and queried the database every five seconds inside it                      | `app/api/track/live/route.ts` held a `ReadableStream`, a 5s interval and a 4-minute limit                 | Removed streaming. Each poll is one short JSON request with an ETag and an 8-second Redis snapshot cache       | 48 database reads per stream become at most two per minute; tracking invocations fall by roughly 70–90% |
| 2   | After a stream error the client polled every five seconds forever, even in a hidden tab                                         | `LiveStatus.tsx` started `setInterval(poll, 5_000)` in `onerror` with no stop condition                   | Replaced with visible-tab polling every 25s, exponential backoff to 5 minutes, stop after 10 quiet minutes or a final status, and a manual refresh button | A stuck tab made 17,280 calls/day; it now makes at most 24 per session, about 99% fewer               |
| 3   | The live endpoint had no rate limit                                                                                            | No limiter in the route; only the tracking lookup action used Upstash                                     | Added a per-IP sliding window of 90 requests per 10 minutes                                                     | Caps a script at 90 calls instead of unlimited; three visible tabs still fit                          |
| 4   | Every public page is dynamic because the root layout reads the locale and theme cookies                                        | `app/layout.tsx` calls `getLocale()` and `getTheme()`; build output marks all pages `ƒ`                   | Audited only. Making these pages static needs locale in the path or a cookie-free public shell; see next steps | Largest remaining win: most of the 731K invocations could become CDN hits, roughly 40–60%             |
| 5   | Fifteen routes declare `force-dynamic`                                                                                         | Account, checkout, compare, order, track and wishlist pages, plus `/policies` and `/sitemap`              | Kept for private and cookie-bound pages. `/policies` stays dynamic because the shell is cookie-bound          | None without the shell refactor in finding 4                                                          |
| 6   | `/sitemap.xml` is generated per request and crawlers fetch it repeatedly                                                       | `app/sitemap.ts` sets `dynamic = 'force-dynamic'` and reads the database                                  | Kept dynamic because CI builds without a database                                                              | Small: one query per crawler fetch; cache it after the shell refactor                                  |
| 7   | Product, content and department cards prefetched dynamic routes; the footer prefetched ten dynamic links on every page          | `ProductGrid`, `ContentCard`, `CategoryTiles`, `SiteFooter` used default `Link` prefetch                   | Added `prefetch={false}` to the repeated lists and footer links                                                | Low single-digit percent of invocations now, more while crawlers hover large catalogs                 |
| 8   | Crawlers could request unlimited catalog, Help and Journal filter combinations                                                 | `robots.ts` allowed every query string                                                                     | Disallowed `/catalog?*`, `/help?*`, `/journal?*` and the tracking paths                                         | Cuts crawler cache misses on the most expensive listing queries; not measurable offline               |
| 9   | `Release guest holds` called production hourly                                                                                 | Cron `17 * * * *` in `.github/workflows/release-holds.yml`                                                 | Workflow disabled with `gh workflow disable`; cron changed to weekly for after the unpause                    | 24 calls/day removed while paused; 1 call/week afterwards                                             |
| 10  | Lighthouse audited production weekly; Playwright defaulted to the production URL                                               | `lighthouse.yml` weekly cron, `playwright.yml` default `base_url`                                         | Both disabled; Lighthouse moved to monthly; Playwright now requires a preview URL                              | Removes the heaviest recurring headless load; prevents accidental production loops                    |
| 11  | No middleware or proxy matcher                                                                                                 | No `middleware.ts` or `proxy.ts` in the repository                                                        | No change needed                                                                                               | Avoids a function call on every asset and prefetch                                                     |
| 12  | `router.refresh()` is used only after a theme change                                                                           | `ThemeRevealForm.tsx` calls it once on submit                                                             | No change needed                                                                                               | No loop                                                                                               |
| 13  | `robots.txt`, `llms.txt` and the OpenGraph image are already static                                                            | Build output marks `/llms.txt`, `/robots.txt` and `/opengraph-image` as static                            | No change needed                                                                                               | Already served by the CDN                                                                             |

## What changed for tracking

- `GET /api/track/live` answers `{ fingerprint, status, final }` with an ETag.
  An unchanged `If-None-Match` gets `304`; the function still runs, but the body
  and database read are skipped.
- Only `fingerprint`, `status` and `final` are cached in Upstash for 8 seconds,
  keyed by a hash that includes the viewer id for account orders.
- The client polls every 25 seconds only while `document.visibilityState` is
  visible. Errors back off at 25s, 50s, 1m40s, 3m20s and 5m. A final status stops
  immediately; ten minutes without a change stops with a "Tap to refresh" button.
- A per-IP limit of 90 requests per 10 minutes fails open if Redis is unavailable.
  Access still requires the signed tracking cookie or the owner's session.

## Next steps (not done in this slice)

1. Move the public locale from a cookie to a path prefix or a request header so
   the storefront shell can be prerendered and cached at the CDN. This is the
   only finding with a four-figure monthly invocation saving.
2. After the team is unpaused, read the top routes in Observability → Usage and
   replace the estimates above with measured week-over-week numbers.
3. If `/api/track/live` still appears near the top, lower the poll to 30 seconds
   before adding more caching; the endpoint must stay a single short request.

See [USAGE.md](../USAGE.md) for the limits, the dashboard steps and the weekly
routine.
