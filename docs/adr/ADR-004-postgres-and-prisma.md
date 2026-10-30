# ADR-004: PostgreSQL on Neon with Prisma 7 and a driver adapter

- Status: accepted
- Date: 2026-10-30

## Context

The marketplace needs relational data with foreign keys, transactions and conditional updates: catalog, carts, orders, stock reservations, reviews and a double-entry ledger. The deployment runs on Vercel's free Hobby plan, the database must stay inside a free-forever allowance, and builds must succeed without an open connection. Prisma 7 requires a JavaScript driver adapter, so the client is built on `pg`.

## Decision

- Use PostgreSQL 18 on Neon Free in `aws-us-east-1`. The runtime connects with the pooled URL (`DATABASE_URL`); Prisma CLI commands use the direct URL (`DIRECT_DATABASE_URL`) through [prisma.config.ts](../../apps/web/prisma.config.ts), because migrations cannot run through the pooler.
- Use Prisma 7 with `@prisma/adapter-pg` and `pg`. The generated client lives in `apps/web/generated/prisma`, is rebuilt by `prisma generate` before typecheck, build and seed, and is not committed.
- Create the Prisma client lazily on the first request. A module-level client opened a connection during static collection and made every route log a configuration error on a build without a database.
- Keep schema changes as SQL migrations under `apps/web/prisma/migrations`. They are generated locally and applied only by the `Database` GitHub Actions workflow, never by the Vercel build and never from a developer machine.

## Alternatives considered

1. **SQLite or an embedded database.** Rejected: conditional stock updates, transactional ledger writes and concurrent checkout are the point of the demo, and a file database would not survive serverless deployment.
2. **Prisma without a driver adapter.** Not available in Prisma 7; the adapter is now the supported runtime path.
3. **Drizzle or raw `pg`.** Both would work, but the schema is large and Prisma's migration history and typed relations are already used by every query and seed script.
4. **Prisma Accelerate or a managed connection pooler.** Rejected: a paid or quota-limited service on top of a free database adds a dependency without solving a measured problem.
5. **Run migrations during the Vercel build.** Rejected: a failed deploy could leave the schema half-applied, and deployment should not be the moment a schema changes.

## Consequences

- Two connection strings must stay configured in the Vercel and GitHub dashboards; the repository contains neither.
- A schema change needs two steps: commit the migration and run the `Database` workflow. An untagged migration is visible in `prisma migrate status`.
- The production build never queries the database, so every page that reads data is dynamic and catches a missing configuration at request time.
- Query performance at demo volume is acceptable without extra indexes; `docs/DATABASE.md` lists the indexes that exist and the search path that would need a trigram or full-text index later.
