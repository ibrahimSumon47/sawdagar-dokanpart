# ADR-009: Design tokens, skeleton parity and container-query layouts

- Status: accepted
- Date: 2026-10-30

## Context

The storefront has to hold together across six widths, two themes and two languages, and every data-driven view needs a loading state that does not reflow the page when it arrives. The catalog also places the same product grid in different containers: a full-width home section, a wishlist page and a listing that loses 260 px to a filter sidebar. Viewport breakpoints alone make the last case either too cramped or too sparse.

## Decision

- Keep every colour, font and semantic value in [`theme.css`](../../packages/ui/src/theme.css) under Tailwind 4's `@theme`, and override the same custom properties on `[data-theme='dark']`. Components reference names such as `bg-surface`, `text-ink-muted` and `border-line`; they do not contain hex values or a `dark:` class for every colour.
- Resolve the theme and language on the server from the `sd_theme` and `sd_locale` cookies, so the first byte already has the right document attributes and there is no flash.
- Build data views as a component and skeleton pair in the same folder. Shared layout constants, such as `productCardLayout` and `productGridClass`, are imported by both, so padding, aspect ratio and column count cannot drift.
- Size the product grid from its container with `@container` and `@min-[…]` breakpoints. The same classes produce two to five columns depending on the width the page gives the grid, and the skeleton uses the identical class string.
- Keep the design gallery at `/design` as the visual contract: both themes, all six widths, loading, empty and error states.

## Alternatives considered

1. **`dark:` utilities on every element.** Rejected: every component would duplicate its colour classes, and the gallery could not show both themes side by side in one document.
2. **Viewport breakpoints for the grid.** Rejected after measuring: at 1024 px the filtered catalog leaves about 650 px for cards, where a viewport-based four-column layout becomes unreadable.
3. **Separate mobile and desktop markup.** Rejected: duplicated content, two accessibility trees and a larger bundle.
4. **A CSS-in-JS theme provider.** Rejected: the server-rendered cookie theme and static CSS already cover both themes without a runtime provider.

## Consequences

- A new colour or spacing value needs a token and a contrast check, not an inline value. `theme.test.ts` computes WCAG ratios for the selected text pairs in both themes, including labels on 10% tinted backgrounds.
- Container queries require a named or anonymous `@container` ancestor; a component moved outside one silently falls back to the two-column base.
- Skeleton parity is enforced by convention and tests, not by the type system. A new card field must be added to both files in the same commit.
- The design gallery shows frames at fixed widths; it is not a substitute for the browser review of live pages.
