# ADR-010: Quality gates on three operating systems, database changes and Lighthouse in Actions

- Status: accepted
- Date: 2026-10-30

## Context

The owner uses Windows, the deployment runs on Linux and the project promises that tooling works on macOS too. The database is remote and must not be touched from a laptop, and the free hosting policy rules out a persistent staging server for browser tests. A build that passes on one operating system can still fail on another through path handling, line endings or native binaries, and a performance score only means something when measured against the deployed site.

## Decision

- The `CI` workflow runs on every push to `main`: lint (format check plus ESLint), typecheck, tests, a production build and the client asset-budget check, in a matrix of Ubuntu, Windows and macOS. A fourth job runs the Python and Java reference modules with `--require`, so a missing runtime fails the build instead of being skipped.
- Schema migrations and seeds never run from a developer machine or a Vercel build. The `Database` workflow is manual, takes `migrate`, `seed` or `status`, holds the direct Neon URL and serialises runs with a concurrency group.
- Lighthouse runs in the `Lighthouse` workflow on demand and weekly. `.lighthouserc.json` audits the deployed home, catalog and product pages with mobile emulation, three runs per URL, and fails the job if performance, accessibility, best practices or SEO score below 90, or if cumulative layout shift exceeds 0.1. Reports are uploaded as a workflow artifact for 14 days.
- axe-core is run by hand in a browser against the deployment for the accessibility review. The project does not start a local development server for tests, so accessibility checks must target the deployed origin or a CI runner.

## Alternatives considered

1. **Run Lighthouse locally against a dev server.** Rejected: the repository forbids localhost development servers, and a local score would not include the CDN, image optimisation and cold-start behaviour of the deployment.
2. **Lighthouse on every push.** Rejected: the job would usually race the Vercel build and measure the previous deployment, and the extra minutes and variance on every commit would make the gate noisy. A weekly and on-demand run is enough for a demo.
3. **Run `prisma migrate deploy` during the Vercel build.** Rejected: a failed build could leave a half-applied schema, and every preview deployment could change production data.
4. **A third-party Lighthouse GitHub action.** Rejected: `@lhci/cli` is the first-party Lighthouse runner, pinned in the lockfile, and the artifact upload is explicit.
5. **Only test on Ubuntu.** Rejected: the owner develops on Windows, and the project's cross-platform promise needs a CI check.

## Consequences

- A push can deploy before the migration workflow runs. The deploy must tolerate the old schema until the migration is applied; changes that need both are applied in the same maintenance window.
- The Lighthouse job measures whatever is live when it starts, not the commit that triggered it. Run it after a deployment is Ready.
- A GitHub capacity failure on the macOS runner looks like a red build but is infrastructure; rerun the job rather than changing code.
- The assertions allow a single slow run to be filtered by the median, but a sustained regression, a cold database or a changed deployment will still fail the gate.
