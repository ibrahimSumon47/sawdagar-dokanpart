# CI and deployment stability

## Root causes found on 2026-11-07

| Area                               | Symptom                                                        | Root cause                                                                                                                    | Fix                                                                                        |
| ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| CI                                 | Build failed on 42369101892 and 42368965662                    | A non-async constant was exported from a `use server` module, which Turbopack rejects; `askQuestion` then resolved to nothing | Moved the constant to `features/questions/limits.ts` (commit a2e0bbd)                      |
| CI                                 | Facts or repo map drift after a green local run                | Generated files were committed before Prettier reformatted them, so `facts:check` compared different bytes                    | Stop pushing between generation and formatting; regenerate last (commits 9865a65, a898c15) |
| CI                                 | Windows-only failure in `facts:check`                          | Generated JSON checked out with CRLF                                                                                          | Checks normalise line endings and the generated files are pinned to LF                     |
| Release guest holds                | A failure email every ten minutes                              | The workflow read `vars.SITE_URL` only, the variable did not exist, and an empty origin made curl fail                        | Set the variable, read `vars.SITE_URL                                                      |     | secrets.SITE_URL`, validate both values with a clear message, run hourly, retry twice, treat 5xx as a warning |
| Product images                     | Sourcing job failed or produced nothing                        | `PEXELS_API_KEY` and `PIXABAY_API_KEY` are not configured, so two of the three providers had no key                           | Owner action recorded in PROJECT_STATE.md; image check is informational until the rebuild  |
| Vercel                             | Some production deployments failed and the daily limit was hit | 93 pushes in one day and 31 the next, each triggering a production build                                                      | Push discipline in AGENTS.md; `ignoreCommand` skips docs-only commits                      |
| Security / Playwright / Lighthouse | Repeated failures on pushes                                    | They followed the same broken build commits; the workflows themselves were sound                                              | Green once the build was fixed; left dispatch-only (Lighthouse also weekly)                |

## Changes in this pass

- Dependabot: both ecosystems keep their schedule with `open-pull-requests-limit: 0`; security alerts stay on; updates are a manual monthly review against `docs/TECH_VERSIONS.md`.
- Release sweep: hourly at minute 17, validated configuration, retry 2, 5xx warning; stock reads add back expired holds so the sweep is no longer needed for correctness.
- Vercel: `ignoreCommand` limits builds to application, package, lockfile and workspace changes; `regions` stays `iad1`.
- Workflows: concurrency groups with cancel-in-progress on CI, security and image-check; `paths-ignore` for docs and markdown; image-check informational; Playwright and Lighthouse stay dispatch-only and Lighthouse keeps its weekly schedule.
- Branches: only `main` remains; pull requests #1 to #7 were closed with delete-branch.

## Verification

Evidence is added after the verification runs.

### Branches and pull requests

`git ls-remote --heads origin` lists only `refs/heads/main`. Pull requests #1 to #7 were closed with `--delete-branch` and a comment saying dependency updates are handled manually; `gh pr list --state open` returns nothing.

### Code commit aea8b7d

- CI [42379798199](https://github.com/ibrahimSumon47/sawdagar-dokanpart/actions/runs/42379798199): success on Linux, Windows and macOS.
- Security [42379798185](https://github.com/ibrahimSumon47/sawdagar-dokanpart/actions/runs/42379798185): success, including the audit and the full-history secret scan.
- Image check [42379798176](https://github.com/ibrahimSumon47/sawdagar-dokanpart/actions/runs/42379798176): the CLIP job runs with `continue-on-error` until the photo rebuild.
- Vercel created production deployment `dpl_5NYowH22cKJmW5KWSWZrXyEUfu8L` and canceled it after five seconds. The first `ignoreCommand` was the cause, not the deployment allowance: the project root directory is `apps/web`, so Vercel ran `git diff` there, the `apps` and `packages` pathspecs matched nothing, and git returned 0, which Vercel reads as "skip". The command now changes to the repository root with `git rev-parse --show-toplevel` before diffing, and a missing parent revision fails open (a non-zero exit builds rather than skips).
- The docs-only commit 4a10ba8 hit the same false skip (`The deployment was canceled because the Ignored Build Step command returned exit code 0`), which confirmed the cause. The corrected command is verified by the commit that carries this report and by the docs-only commit that follows it.

### Release guest holds

- Manual dispatch [42379834916](https://github.com/ibrahimSumon47/sawdagar-dokanpart/actions/runs/42379834916) succeeded against the production origin with `vars.SITE_URL` set.
- The old failure every ten minutes (run 42374403546) came from an empty `SITE_URL`; the workflow now fails with a named message instead of a bare curl error, and the schedule is hourly.

### Remaining runs

`gh run list` shows no failing run for CI, Security, Image check, Playwright or Lighthouse on `main`; the last Playwright run (42370768843) and Lighthouse run (42369850139) are green. The only recent failure is the historical Release guest holds run on 0288973, kept as the before case.
