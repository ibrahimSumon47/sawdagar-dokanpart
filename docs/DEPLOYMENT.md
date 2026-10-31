# Deployment

## Owner actions

- None are outstanding. The Vercel production environment and the GitHub repository already contain the four variables below, set from the authenticated CLIs without exposing their values. Keep them in the dashboards only. No image host, mail provider, cache or payment account is needed.
- The Vercel Hobby project serves the [demo](https://sawdagar-dokanpart.vercel.app/), [/catalog](https://sawdagar-dokanpart.vercel.app/catalog), a product page such as [/product/full-grain-leather-belt-black](https://sawdagar-dokanpart.vercel.app/product/full-grain-leather-belt-black), [/case-study](https://sawdagar-dokanpart.vercel.app/case-study), [/llms.txt](https://sawdagar-dokanpart.vercel.app/llms.txt), [/sign-in](https://sawdagar-dokanpart.vercel.app/sign-in), [/seller](https://sawdagar-dokanpart.vercel.app/seller), [/admin](https://sawdagar-dokanpart.vercel.app/admin) and [/design](https://sawdagar-dokanpart.vercel.app/design). Confirm Node.js 24 and Git deployments for `main` remain enabled. Keep the demo non-commercial and use sandbox payments only.
- The `sawdagar-dokanpat` Neon Free project holds every migration through `20261028233000_admin_cms`. The admin/CMS migration and seed ran through the `Database` workflow on 2026-10-28 (runs 40706126268 and 40706283350). The seed created 12 departments, 72 leaf categories, 24 vendors, 432 products, 1,296 variants, 1,755 reviews, three demo orders, four coupons, eleven content entries and two flags. Do not share its connection strings in chat.
- The showcase deployment was checked on 2026-10-30: `/case-study` returned 200 with its canonical URL and structured data, `/llms.txt` returned the committed text, and the sitemap listed 473 URLs. Re-run those three checks after changing the public route list.
- Re-running `seed` is not required for the cart migration; it restores the catalog rows and the four demo coupons.
- If the catalog is reset, run the `Database` workflow with `migrate` only when a new migration exists, then with `seed`. The seed restores the same deterministic catalog and does not duplicate rows.
- The deployed Phase 4 build passed the guest-cart, reload, sign-in merge, wishlist, comparison and coupon smoke checks. `BOISHAKH10` discounted the ৳3,840 cart by ৳384 to ৳3,576 and survived a reload. Re-run these after a schema or auth change; the stock-limit and four-product compare-cap edge cases still need a manual pass.
- The `20261028230000_finance` migration added `organizations.commissionRateBps` and the ledger, payout and refund tables. It was applied by the `Database` workflow on 2026-10-28 (run 40696952497), and the seed (run 40697066479) refreshed the catalog with a 7% rate on every fourth store. The finance pass on the deployment exercised a delivery posting, a payout request, approval, payment and a refund; it left the demo data with one paid ৳1,500 payout and one ৳3,250 refund, so a reseed is needed to restore a clean balance before a fresh walkthrough.
- Rotating the demo password requires updating `DEMO_ACCOUNT_PASSWORD` in both dashboards and re-running the `Database` workflow with `seed`, so the stored hashes match the new value.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Vercel production, GitHub Actions | Pooled Neon connection used by the app |
| `DIRECT_DATABASE_URL` | GitHub Actions | Direct Neon connection used by Prisma migrations and seeding |
| `BETTER_AUTH_SECRET` | Vercel production, GitHub Actions | Signs and verifies Better Auth sessions |
| `DEMO_ACCOUNT_PASSWORD` | Vercel production, GitHub Actions | Password for the eight seeded demo accounts |

Vercel stores the three production values as hidden secrets. `DIRECT_DATABASE_URL` is intentionally not present in Vercel, because the runtime uses the pooled connection and never runs migrations.

## Build and deploy behaviour

- Vercel installs from the workspace root even though the Root Directory is `apps/web`, so `pnpm install` covers all five workspace projects (897 package directories). With the build cache present (478 MiB of the 1.5 GiB limit) a rebuild restores it, the install finishes in milliseconds and Turbo replays the `@sd/web` build from its remote cache: the rebuild at `1eb44a8` took 15 seconds.
- A cache-miss build skips all of that and downloads the full dependency tree, which can take minutes on a slow registry. A `[WARN] Tarball download average speed` line is pnpm reporting throughput below its threshold and retrying; it is a warning, not a failure, and the deployment stays in Building while the downloads finish.
- Do not trim the install to speed up cache-miss builds. CI-only tooling (Lighthouse, commitlint, husky, Prettier) is 28 of those 897 directories, and any filter that drops the workspace root also drops `turbo`, which costs the remote cache that keeps normal rebuilds at 15 seconds.
- Keep a single Vercel project for this repository. A second import gets a suffixed project name and no environment variables, so it would build cleanly and then fail on the first database or session read.

## Database workflow

Run `Database` from the Actions tab or with `gh workflow run db.yml -f task=migrate`. Tasks:

- `migrate` — `prisma migrate deploy`
- `seed` — generate the client and upsert the demo users, profiles, store, categories, vendors, products and variants
- `status` — `prisma migrate status`

## GitHub description and topics

Set on the repository on 2026-10-30 with the authenticated GitHub CLI.

Description: A non-commercial Bangladeshi multi-vendor marketplace demonstration.

Homepage: https://sawdagar-dokanpart.vercel.app

Topics: `marketplace`, `bangladesh`, `nextjs`, `typescript`, `monorepo`, `tailwindcss`, `design-system`, `better-auth`, `prisma`.
