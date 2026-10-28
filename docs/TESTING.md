# Testing

The quality gates are `pnpm lint` (format check plus ESLint), `pnpm typecheck`, `pnpm test` and `pnpm build`. CI runs them on Linux, Windows and macOS.

## Unit tests

| Package | Tests | What they cover |
|---|---|---|
| `@sd/domain` | 8 | Taka formatting in English and Bangla numerals, category tree shape |
| `@sd/ui` | 13 | Button markup, price rendering and discounts, product card content, skeleton parity via shared layout constants, WCAG AA contrast for the token pairs in both themes, quantity clamping state |
| `@sd/web` | 7 | English/Bangla catalogs share keys and contain no empty strings, Bangla copy uses Bengali script, sentence templates interpolate, locale and theme guards, default light theme |

The skeleton parity test renders the product card and its skeleton and compares the `data-layout` and `data-media-aspect` attributes both read from `productCardLayout`. It checks the shared constants, not pixel geometry; the Playwright bounding-box comparison required by the design specification arrives with browser testing.

## Not yet covered

There is no browser, end-to-end, accessibility or visual-regression test, and no automated check of the six gallery widths. The gallery is rendered from the same components and tokens as the storefront, but a person has to confirm the frames at each width. Lighthouse budgets, axe and Playwright are scheduled with the phases that add data and interaction.
