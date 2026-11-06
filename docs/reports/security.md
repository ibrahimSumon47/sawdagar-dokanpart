# Security review

Scope: the web app in `apps/web` (authentication, sessions, CSRF, rate limits,
order and tracking access, uploads, secrets, response headers and CSP), plus the
CI workflows. Method: code reading of each entry point, then a search for
dangerous sinks. This is a static review; no live penetration test was run.

## What was checked and the result

| Area                    | Where                                                                                              | Result                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sessions                | `apps/web/lib/auth.ts`, `features/auth/session.ts`                                                 | Better Auth sessions expire after 7 days and refresh daily. `getViewer`, `requireViewer` and `requireArea` gate private pages. OK.                                                |
| Cookies                 | guest access, cookie state, help votes, preferences                                                | `httpOnly`, `sameSite: lax`, `secure` in production. OK.                                                                                                                          |
| CSRF                    | server actions, auth endpoints                                                                     | Next.js server actions reject cross-origin POSTs. Better Auth checks `trustedOrigins`, which is the site's own origin. OK.                                                        |
| Rate limits             | `lib/auth.ts` (sign-in 10/min, sign-up 5/min, reset 3 per 5 min); `features/tracking/rateLimit.ts` | Stored in the database because no Upstash account is available (ADR-011). OK.                                                                                                     |
| Order and tracking IDOR | payments, reviews, returns, seller sub-orders, cart                                                | Each query filters by the viewer's id (`order.userId`) or the seller's `organizationId`. Guest tracking uses a signed, expiring cookie checked with a timing-safe comparison. OK. |
| Uploads: reviews        | `features/reviews/inputs.ts`, `actions.ts`                                                         | Photos are checked on the server: data URL must be JPEG, PNG or WebP, at most 220,000 characters, at most three photos. Browser resize is a convenience, not the control. OK.     |
| Uploads: covers         | `features/admin/components/ContentEditorForm/coverUpload.ts`                                       | Unsigned upload to Cloudinary with a preset. The preset must restrict type and size in the Cloudinary console (owner action, see Known risks).                                    |
| Secrets                 | repository and git history scan                                                                    | No tracked `.env` files, `.env*` is ignored, and no key-shaped strings were found. The API secret is read only in `scripts/images/fetch.ts` and the workflow secret store. OK.    |
| Rich text               | `ArticleBody.tsx`                                                                                  | Journal HTML is cleaned with `sanitize-html` on save and again on render. OK.                                                                                                     |
| JSON-LD                 | `ProductJsonLd.tsx`, `CaseStudyJsonLd.tsx`                                                         | Inline JSON with `<` escaped. OK.                                                                                                                                                 |
| Headers                 | `apps/web/next.config.ts`, `lib/securityHeaders.ts`                                                | **Gap found and fixed:** no CSP, frame, HSTS, nosniff, referrer or permissions headers. Added to every route.                                                                     |

## Fixed in this review

- Added `apps/web/lib/securityHeaders.ts` and wired it through `headers()` in
  `next.config.ts`. The policy is `default-src 'self'`, no `object-src`, no
  foreign form posts, `frame-ancestors 'none'`, and images allowed from
  Cloudinary and `data:` (review photos). HSTS is one year with subdomains,
  `X-Frame-Options: DENY`, `nosniff`, a strict-origin referrer policy, and a
  Permissions-Policy that turns off camera, microphone, geolocation, payment
  and USB.
- Covered by `lib/securityHeaders.test.ts` (5 tests).

## Decisions and known risks

- **`'unsafe-inline'` in `script-src`.** Next.js writes its hydration payload
  inline, and the JSON-LD blocks are inline. Nonces would force every page to
  render per request and lose the static product pages. Recorded in
  `docs/DECISIONS.md`. Mitigation: no `eval`, no third-party script hosts, and
  inputs are escaped or sanitized.
- **Cover upload preset.** The Cloudinary unsigned preset cannot be
  restricted from the code. The owner should set it to accept only images and
  a size limit in the Cloudinary console. Until then, an admin with the preset
  could upload a non-image; the public URL is still served only from the
  Cloudinary host.
- **Database rate limits.** Stored in Postgres, so they are per-instance-safe
  but slower than a Redis store. Acceptable at portfolio traffic.
- **No live pentest.** Dynamic testing of the deployed site was not run for
  this report.

## Follow-up checks

- Dependency vulnerabilities: `pnpm audit` in CI (added with R9 item 6).
- Secret scan: gitleaks in CI (added with R9 item 6).

## Dependency audit (R9 item 6)

- `pnpm audit --audit-level=high --prod`: **no known vulnerabilities** in the
  shipped dependency tree. This is the CI gate (`.github/workflows/security.yml`).
- `pnpm audit --audit-level=high` (including dev tools): 5 high advisories, all
  in dev-only Lighthouse tooling (`@lhci/cli` and its `lighthouse` and
  `puppeteer-core` chain): `basic-ftp` (fix in 6.2.1), `zod` (fix in 4.6.6, used
  by `chromium-bidi`), `tmp` (fix in 0.2.6), and two `extract-zip` symlink
  advisories with no patched release. None of these run in the deployed app or
  on user input. Decision: keep them out of the blocking gate and record them
  here, because forcing overrides into the Lighthouse chain could break the
  Lighthouse budget run. Re-check when `@lhci/cli` is updated.

## Secret scan

- gitleaks runs in CI on the full git history (`fetch-depth: 0`). A local
  pattern search of the working tree found no key-shaped strings, and no
  `.env` file is tracked.
