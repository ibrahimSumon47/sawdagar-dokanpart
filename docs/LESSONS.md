# Lessons

- A Lighthouse run reported no product meta description even though the deployed HTML contained one; the tag had streamed into the body after the head. Check where metadata lands in the raw HTML (`indexOf('</head>')`) before trusting it, and remember that `htmlLimitedBots` controls blocking metadata.

- The first Lighthouse workflow run failed because `.lighthouserc.json` used `preset: "lighthouse:default"`; LHCI only accepts `perf`, `experimental` and `desktop`, and mobile is already the default. Read the tool's preset options instead of assuming a Lighthouse CLI preset name.

- The Lighthouse artifact upload silently skipped `.lighthouseci` because `actions/upload-artifact` ignores hidden files by default. Set `include-hidden-files: true` when uploading dot-directories.

- A macOS CI job failed with "not acquired by Runner of type hosted"; that is GitHub capacity, not a code failure. Check the annotation before debugging the build.

- A newly added contrast test failed the Prettier gate on its first full check. Format edited source files before running the full quality gate, then rerun the affected checks.

- The first Prettier CI check failed on Windows because Git checked out source with CRLF endings while Prettier expected LF. Define source line endings in Git attributes and verify the checkout policy when introducing format checks across platforms.

- I asked the owner to create a Neon project without checking the existing authenticated CLI. Before requesting account actions, check whether the necessary CLI and authenticated access are already available, and avoid displaying credentials.

- A staged whitespace check caught trailing whitespace in a new ADR. Run `git diff --check` before committing and avoid Markdown trailing spaces.
- An initial install failed because pnpm rejected an unapproved transitive native-binding installer, and ESLint 10 exceeded the declared peer ranges of the Next.js plugins. Inspect peer ranges and build-script requirements before selecting the newest compatible tool versions; explicitly approve only reviewed build scripts.
- The Windows CI check failed a second time on CRLF because `.gitattributes` only covered `apps/web`, while the formatting check also covers `packages/*/src`. When a formatting scope grows, extend the line-ending rules and run `git add --renormalize` in the same change instead of waiting for CI.

- The first seed run failed with `ERR_MODULE_NOT_FOUND` for the generated Prisma client because the client is deliberately not committed. Any workflow command that imports the client must run `prisma generate` first; the `db:seed` script now does.

- Instantiating Better Auth at module scope made Next.js try to open Prisma during page-data collection, logging `DatabaseNotConfiguredError` on every route even though the build exited zero. Create database-backed clients lazily on the first request, and verify a clean build log, not just the exit code.

- When `.gitignore` patterns are added at the root, verify with `git check-ignore` rather than assuming; generated Prisma output and Vercel's local `.env.local` must never appear in `git status`.

- The product page compiled and built but failed at runtime on the deployment because a Server Component passed the whole dictionary, including formatter functions, to the client variant picker. Only plain strings can cross that boundary. Typecheck and build do not prove a server/client prop is serializable; exercise the route and keep client props to primitives or plain arrays/objects.
- Matching a search term against a vendor name produced unrelated products (a vendor named for jamdani matched its whole catalogue). Search the fields a shopper expects to match, and verify a craft term returns only relevant items before shipping.
- The first shop controllers synced server-rendered props into client state inside `useEffect`, which Next.js 16's React compiler lint rejects (`react-hooks/set-state-in-effect`) and which paints a stale frame. Adjust state during render when a prop identity changes (`useServerState`), or key the component when a full reset is intended; do not suppress the rule.
- The product grid originally passed the whole catalog dictionary into a helper used by a client view, which would have crossed the server/client boundary with functions. Keep shared views on plain serializable props (`productGridLabels` precomputes rating text), and exercise the client route rather than relying on typecheck.
