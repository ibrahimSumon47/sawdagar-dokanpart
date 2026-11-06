# Design system: Editorial Heritage

This file is the design reference for Sawdagar Dokanpat. It is adapted from the DESIGN.md format in the awesome-design-md collection (structure only). The identity is original to this project, and no other brand's tokens, type or imagery were copied. The source of truth for values is `packages/ui/src/theme.css` (Tailwind v4 `@theme`). If this file and the code disagree, the code wins and this file must be corrected in the same commit.

## 1. Identity

Editorial Heritage reads like a printed Bangladeshi bazaar catalogue: warm paper, serif headings, terracotta accents taken from jamdani weaving, and a padma-green secondary. Storefront pages have generous whitespace and near-square corners. Dashboards are denser with the same tokens. Light is the default theme. Dark is a hand-tuned theme, not an inversion.

## 2. Colour tokens

Every colour is a Tailwind utility generated from a `--color-*` variable. Components never use hex values.

| Utility                                | Light                              | Dark                               | Use                                      |
| -------------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------------- |
| `bg-background`                        | #FAF7F2                            | #0F0E0C                            | page background                          |
| `bg-surface`                           | #FFFFFF                            | #1A1816                            | cards, panels                            |
| `bg-surface-elevated`                  | #FFFFFF                            | #24211E                            | drawers, menus, popovers                 |
| `text-ink`                             | #141414                            | #F5F1EA                            | primary text                             |
| `text-ink-muted`                       | #57534E                            | #A8A29E                            | secondary text                           |
| `border-line`                          | #E7E1D8                            | #2E2A26                            | hairline borders                         |
| `accent` / `accent-hover`              | #C2410C / #9A3412                  | #F97316 / #FB923C                  | primary buttons, links, price highlights |
| `accent-contrast`                      | #FFFFFF                            | #1A0D05                            | text on accent                           |
| `secondary`                            | #166534                            | #4ADE80                            | padma green, positive states             |
| `highlight`                            | #B45309                            | #FBBF24                            | gold, badges                             |
| `success`, `warning`, `danger`, `info` | #15803D, #B45309, #B91C1C, #1D4ED8 | #4ADE80, #FBBF24, #F87171, #60A5FA | status                                   |
| `*-strong` variants                    | darker shades                      | same as base                       | status text on tinted backgrounds        |
| `skeleton-base` / `skeleton-shine`     | #ECE5DA / #F6F1E8                  | #25211D / #332E29                  | loading placeholders only                |

Rules:

- Accent is used sparingly: primary actions, links, active states, price highlights and badges.
- Text and interactive colours meet WCAG 2.2 AA in both themes. Status labels use the `*-strong` shades on tinted backgrounds, which was the fix for the Phase 11 contrast finding.
- The theme is set by a cookie and rendered on the server, so there is no flash on load.

## 3. Typography

| Role             | Family            | Token                                   |
| ---------------- | ----------------- | --------------------------------------- |
| Headings, prices | Fraunces          | `font-serif`                            |
| UI text          | Inter             | `font-sans`                             |
| Bangla           | Noto Sans Bengali | `font-bangla`, applied with `:lang(bn)` |

- Loaded with `next/font`, subset, `display: swap`.
- Fluid scale: `text-hero`, `text-display`, `text-title`, `text-lead`, using `clamp()`. Body text uses Tailwind's default sizes.
- Body line height is 1.55 for English and 1.7 for Bangla.
- Prices and tables use tabular numerals.

## 4. Spacing, shape and elevation

- Spacing: 4 px base, using Tailwind's default scale.
- Radii: `rounded-sm` (2 px) and `rounded-md` (4 px) for the storefront, `rounded-lg` (8 px) for admin and seller tools.
- Elevation: 1 px hairline borders instead of heavy shadows. One soft shadow, `shadow-float`, for floating layers only.
- Product imagery uses a 4:5 aspect ratio.

## 5. Breakpoints and layout

Mobile first at 360, 640, 768, 1024, 1280 and 1536 px, and checked from 320 to 1920 px.

- Product grid: 2, then 3, 4 and 5 columns. The grid uses container queries, so it adapts to the width of its container.
- Filters: a bottom sheet on mobile and a sticky sidebar on desktop.
- Product page: two columns with a sticky buy box from 1024 px.
- Tables become stacked cards on small screens.
- Touch targets are at least 44 px. There is no horizontal scrolling.

## 6. Motion

Motion is CSS only (no animation library). Animate transform and opacity only.

| Token             | Value                                 |
| ----------------- | ------------------------------------- |
| `--duration-fast` | 120 ms                                |
| `--duration-base` | 200 ms                                |
| `--duration-slow` | 320 ms                                |
| `--ease-out-soft` | cubic-bezier(0.22, 1, 0.36, 1)        |
| Drawer spring     | stiffness about 300, damping about 30 |
| Page maximum      | 520 ms                                |

Rules:

- Nothing runs longer than 600 ms, except the decorative marquee.
- Every animation is disabled under `prefers-reduced-motion`. The global rule in `theme.css` shortens durations, and skeleton shimmer is removed.
- The catalogue of animations lives at `/design/motion` and is linked from the footer only.

## 7. Skeletons

- Each data-loading component is a pair, `Thing.tsx` and `ThingSkeleton.tsx`, in the same folder.
- Both use the layout constants from `apps/web/features/shell/pageLayout.ts`, so dimensions match.
- Colours come only from the skeleton tokens. The shimmer is a 1.4 s diagonal sweep.
- Each route segment has a `loading.tsx`, and each async section is wrapped in Suspense.

## 8. Components and states

- Shared components live in `packages/ui`. Feature components live in `apps/web/features/<feature>/components`.
- Empty states, error states with retry, a bilingual 404 and 500 page, toasts, and confirm dialogs for destructive actions are all part of the system.
- Icons come from Lucide. The UI has no emoji. The brand mark and patterns are original SVG.

## 9. Verification

- The Tailwind token names above are checked against `theme.css` by reading the file. The design gallery at `/design` shows both themes at six widths.
- Contrast was checked with axe-core on nine template, theme and width combinations in Phase 11.
