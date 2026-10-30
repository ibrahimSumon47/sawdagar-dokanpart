# ADR-007: A deterministic, idempotent demo seed

- Status: accepted
- Date: 2026-10-30

## Context

A portfolio storefront needs enough data to exercise filters, pagination, reviews, returns and finance: 12 departments, 24 vendors, hundreds of products and variants, historical reviews and a few delivered orders. A live demo also has to be resettable, and screenshots, tests and documentation should show the same values on every run. Migrations and seeds run only from CI; the database credentials are not kept on a developer machine.

## Decision

- Generate the catalog from curated inputs rather than hand-writing rows. [`catalogSeed.ts`](../../packages/domain/src/catalog/catalogSeed.ts) expands 12 departments × 6 leaves × 3 styles × 2 colours into 432 products and 1,296 variants for 24 vendors. FNV-1a hashes derive stock and the catalog's initial rating values, so the same inputs always produce the same rows; after the reviews are seeded, each product's rating and count are recomputed from the published review rows.
- Make every seed script idempotent with fixed ids or natural keys. Categories, vendors, products and demo users are upserted; a product's variants are replaced in one pass so a re-run cannot duplicate options.
- Seed the supporting history from the same builder: 1,755 published reviews from synthetic buyers, three demo orders (two delivered for the buyer account and one confirmed for the demo store), four coupons, eleven CMS entries with their first version, and two feature flags.
- Recompute product ratings from the published review rows after reviews are inserted, rather than storing an independent display number.
- Run seeds only through the `Database` GitHub Actions workflow, which supplies `DATABASE_URL`, `DIRECT_DATABASE_URL`, `BETTER_AUTH_SECRET` and `DEMO_ACCOUNT_PASSWORD` from repository secrets.

## Alternatives considered

1. **Random fixtures with a library such as faker.** Rejected: values would drift between runs, making screenshots, test expectations and bug reports incomparable.
2. **Hand-written SQL or JSON rows for every product.** Rejected: 432 products and 1,296 variants would be unmaintainable, and adding one department would touch thousands of lines.
3. **A database dump committed and restored by CI.** Rejected: schema changes would require regenerating the dump, and the seed would stop explaining how the data is shaped.
4. **Seeding from a developer machine.** Rejected: the project forbids local database operations, and the production credentials belong in the GitHub dashboard rather than in a shell.

## Consequences

- The seed is a demo reset: re-running it restores stock and product fields, so seller edits are intentionally overwritten.
- Demo order timestamps are relative to the run so delivered and returnable states stay realistic; those rows are the one part that is not byte-identical across runs.
- The catalog is smaller than the data specification's 800-product target. More rows belong with a later volume pass, not with this seed.
- A schema change that affects seeded columns must update the builder and the test that pins its counts, or `catalogSeed.test.ts` fails.
