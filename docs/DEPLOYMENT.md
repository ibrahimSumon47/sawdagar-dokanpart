# Deployment

## Owner actions

- None are outstanding for the catalog slice. The Vercel production environment and the GitHub repository already contain the four variables below, set from the authenticated CLIs without exposing their values. Keep them in the dashboards only. No image host, search service or other provider is needed.
- The Vercel Hobby project serves the [demo](https://sawdagar-dokanpart.vercel.app/), [/catalog](https://sawdagar-dokanpart.vercel.app/catalog), product pages such as [/product/handwoven-jamdani-saree-indigo](https://sawdagar-dokanpart.vercel.app/product/handwoven-jamdani-saree-indigo), [/sign-in](https://sawdagar-dokanpart.vercel.app/sign-in), [/account](https://sawdagar-dokanpart.vercel.app/account) and [/design](https://sawdagar-dokanpart.vercel.app/design). Confirm Node.js 24 and Git deployments for `main` remain enabled. Keep the demo non-commercial and use sandbox payments only.
- The `sawdagar-dokanpat` Neon Free project holds the migrated auth and catalog schemas. The catalog seed created 12 departments, 72 leaf categories, 24 vendors, 432 products and 1,296 variants. Do not share its connection strings in chat.
- If the catalog is reset, run the `Database` workflow with `migrate` only when a new migration exists, then with `seed`. The seed restores the same deterministic catalog and does not duplicate rows.
- Rotating the demo password requires updating `DEMO_ACCOUNT_PASSWORD` in both dashboards and re-running the `Database` workflow with `seed`, so the stored hashes match the new value.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Vercel production, GitHub Actions | Pooled Neon connection used by the app |
| `DIRECT_DATABASE_URL` | GitHub Actions | Direct Neon connection used by Prisma migrations and seeding |
| `BETTER_AUTH_SECRET` | Vercel production, GitHub Actions | Signs and verifies Better Auth sessions |
| `DEMO_ACCOUNT_PASSWORD` | Vercel production, GitHub Actions | Password for the eight seeded demo accounts |

Vercel stores the three production values as hidden secrets. `DIRECT_DATABASE_URL` is intentionally not present in Vercel, because the runtime uses the pooled connection and never runs migrations.

## Database workflow

Run `Database` from the Actions tab or with `gh workflow run db.yml -f task=migrate`. Tasks:

- `migrate` — `prisma migrate deploy`
- `seed` — generate the client and upsert the demo users, profiles, store, categories, vendors, products and variants
- `status` — `prisma migrate status`

## GitHub description and topics

Description: A non-commercial Bangladeshi multi-vendor marketplace demonstration.

Topics: `marketplace`, `bangladesh`, `nextjs`, `typescript`, `monorepo`, `tailwindcss`, `design-system`, `better-auth`, `prisma`.
