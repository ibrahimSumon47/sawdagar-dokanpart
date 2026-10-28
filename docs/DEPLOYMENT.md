# Deployment

## Owner actions

- None are outstanding for the auth slice. The Vercel production environment and the GitHub repository already contain the four variables below, set from the authenticated CLIs without exposing their values. Keep them in the dashboards only.
- The Vercel Hobby project serves the [demo](https://sawdagar-dokanpart.vercel.app/), [/sign-in](https://sawdagar-dokanpart.vercel.app/sign-in), [/account](https://sawdagar-dokanpart.vercel.app/account) and [/design](https://sawdagar-dokanpart.vercel.app/design). Confirm Node.js 24 and Git deployments for `main` remain enabled. Keep the demo non-commercial and use sandbox payments only.
- The `sawdagar-dokanpat` Neon Free project holds the migrated schema. Do not share its connection strings in chat.
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
- `seed` — generate the client and upsert the demo users, profiles and store
- `status` — `prisma migrate status`

## GitHub description and topics

Description: A non-commercial Bangladeshi multi-vendor marketplace demonstration.

Topics: `marketplace`, `bangladesh`, `nextjs`, `typescript`, `monorepo`, `tailwindcss`, `design-system`, `better-auth`, `prisma`.
