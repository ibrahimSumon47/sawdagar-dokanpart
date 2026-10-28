# Lessons

- The first Prettier CI check failed on Windows because Git checked out source with CRLF endings while Prettier expected LF. Define source line endings in Git attributes and verify the checkout policy when introducing format checks across platforms.

- I asked the owner to create a Neon project without checking the existing authenticated CLI. Before requesting account actions, check whether the necessary CLI and authenticated access are already available, and avoid displaying credentials.

- A staged whitespace check caught trailing whitespace in a new ADR. Run `git diff --check` before committing and avoid Markdown trailing spaces.
- An initial install failed because pnpm rejected an unapproved transitive native-binding installer, and ESLint 10 exceeded the declared peer ranges of the Next.js plugins. Inspect peer ranges and build-script requirements before selecting the newest compatible tool versions; explicitly approve only reviewed build scripts.
- The Windows CI check failed a second time on CRLF because `.gitattributes` only covered `apps/web`, while the formatting check also covers `packages/*/src`. When a formatting scope grows, extend the line-ending rules and run `git add --renormalize` in the same change instead of waiting for CI.
