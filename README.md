# Sawdagar Dokanpat

A non-commercial marketplace demonstration inspired by the independent makers and merchants of Bangladesh.

**Demo store: sandbox payments.** This is a portfolio project, not a real shop; no real money is accepted.

## Current state

Phase 1 is complete. The deployed site has the storefront shell and a design system page:

- [Home](https://sawdagar-dokanpart.vercel.app/) — the shell, bilingual copy and a short note on the current phase.
- [Design system](https://sawdagar-dokanpart.vercel.app/design) — tokens, typography, components, empty and error states, both themes, and header/product frames at 360, 640, 768, 1024, 1280 and 1536 px, with skeleton pairs.

The theme and language are chosen on the server from a cookie, so the first paint is already correct in either theme and either language. English is the default; Bangla uses Noto Sans Bengali with a taller line height.

The catalog, accounts, cart and checkout are not built yet. See the [project state](docs/PROJECT_STATE.md) and the [roadmap](docs/spec/05-roadmap.md).

## Workspace

- `apps/web` — Next.js App Router storefront and shell.
- `packages/ui` — design tokens and shared components with skeleton pairs.
- `packages/domain` — pure helpers such as taka formatting and the category list.

## Quality checks

CI runs lint, type checking, unit tests and a production build on Linux, Windows and macOS. The 28 unit tests include WCAG AA contrast for the token pairs in both themes and layout parity between the product card and its skeleton. See [testing](docs/TESTING.md), [architecture](ARCHITECTURE.md), [security](docs/SECURITY.md) and [deployment](docs/DEPLOYMENT.md).

## Known limitations

- No accounts, catalog, cart, checkout or payments exist; the gallery products and vendors are design fixtures.
- Payments are sandbox only, and the demo plans to use free service tiers throughout.
- There is no browser, end-to-end or accessibility test yet, and the six gallery widths still need a human check.
- Product imagery is an original SVG jamdani pattern until real photography and hosting are added.
