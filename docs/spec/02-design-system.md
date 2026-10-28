# 02 Design system and UI/UX: "Editorial Heritage"

Light theme is the default. Dark theme is a first-class, hand-tuned theme (not a color inversion). Theme choice is stored in a cookie so the server renders the correct theme with no flash. Use Tailwind CSS v4 with `@theme` CSS variables as the only source of colors, spacing, radii, shadows and motion values. No hard-coded hex values in components.

## Color tokens
| Token | Light (default) | Dark |
|---|---|---|
| background | #FAF7F2 (warm paper) | #0F0E0C |
| surface | #FFFFFF | #1A1816 |
| surface-elevated | #FFFFFF with soft shadow | #24211E |
| ink (primary text) | #141414 | #F5F1EA |
| ink-muted | #57534E | #A8A29E |
| border | #E7E1D8 | #2E2A26 |
| accent (jamdani terracotta) | #C2410C | #F97316 |
| accent-hover | #9A3412 | #FB923C |
| accent-contrast text | #FFFFFF | #1A0D05 |
| secondary (padma green) | #166534 | #4ADE80 |
| highlight (gold) | #B45309 | #FBBF24 |
| success / warning / danger / info | #15803D / #B45309 / #B91C1C / #1D4ED8 | #4ADE80 / #FBBF24 / #F87171 / #60A5FA |
| skeleton-base / skeleton-shine | #ECE5DA / #F6F1E8 | #25211D / #332E29 |
All text and interactive colors must meet WCAG 2.2 AA contrast in both themes (verify with automated checks). Accent is used sparingly: primary buttons, links, active states, price highlights, badges.

## Typography
Fraunces (serif) for headings and prices, Inter for UI text, Noto Sans Bengali for Bangla (matched weights and line-height; Bangla needs larger line-height, about 1.7). Load with `next/font`, subset, `display: swap`. Fluid type scale with `clamp()`. Tabular numerals for prices and tables.

## Shape, spacing, elevation
Near-square corners (2 to 4 px) for the storefront; 6 to 8 px for admin/seller tools. 1 px hairline borders instead of heavy shadows; one soft shadow level for floating layers (drawers, menus, popovers). 4 px spacing base. Product imagery 4:5. Generous whitespace on the storefront, denser on dashboards.

## Breakpoints and layout
Mobile-first at 360, 640, 768, 1024, 1280, 1536 px. Layouts must genuinely change, not just shrink: product grid 2 > 3 > 4 > 5 columns; filters become a bottom sheet on mobile and a sticky sidebar on desktop; product page becomes a two-column layout with sticky buy box at 1024 px and up; tables become stacked cards on small screens. No horizontal scrolling. Touch targets at least 44 px. Container queries for components that live in different widths.

## Storefront look (page by page)
- **Header**: thin announcement marquee; logo (serif wordmark "Sawdagar Dokanpat" with a small jamdani-pattern mark); search bar with autosuggest panel (products, categories, vendors, recent searches); language switch (EN/বাংলা); theme toggle; account menu; cart icon with count. Sticky, condenses on scroll. Mega menu on desktop with category imagery and featured links; full-screen menu with accordion on mobile. Bottom tab bar on mobile (Home, Categories, Search, Wishlist, Account).
- **Home**: full-bleed editorial hero carousel (parallax image, large serif headline), flash-sale strip with live countdown, category tiles in an asymmetric grid, featured vendors row (logo, rating, follower count), trending products, editorial banner, recently viewed, trust strip (secure checkout, easy returns, verified sellers), rich footer.
- **Listing**: breadcrumb, title and result count, sort select, filter chips (removable), facet panel, product grid with infinite scroll option or numbered cursor pages, "no results" state with suggestions.
- **Product card**: 4:5 image with second image on hover (desktop), wishlist heart (top right), sale badge, vendor name, title (2 lines), rating, price (sale price in accent plus struck-through original), quick add on hover (desktop) and a compact add button (mobile).
- **Product page**: gallery (thumbnails, zoom, swipe), title, vendor, rating, price block, variant selectors (swatches for color, pills for size, disabled state for out of stock), quantity stepper, delivery estimate by district, add to cart and buy now, accordion for details/shipping/returns, reviews and Q&A sections, sticky bottom add-to-cart bar on mobile.
- **Cart (add-to-cart experience)**: see the dedicated section below.
- **Checkout**: single page with a 3-step progress bar (Address, Delivery and Payment, Review); order summary column sticks on desktop and collapses into an expandable bar on mobile; inline validation; payment method cards; per-vendor shipping lines; clear total breakdown (items, shipping, VAT, discount, total).
- **Order tracking**: per sub-order vertical timeline with animated fill, courier and tracking id, expected delivery date.
- **Account, vendor store, Seller Center, admin/CMS**: as defined in the product spec; dashboards use a sidebar shell (collapsible on tablet, bottom navigation or sheet menu on phones) with the same tokens but denser data tables and charts (Recharts, themed with tokens).

## Add-to-cart experience (must be exactly this)
1. Pressing "Add to cart": the button shows a brief pressed state (scale 0.97), morphs into a spinner, then into a check mark with a soft ripple, then returns to label after 1.2 s.
2. A small round copy of the product thumbnail flies along a curved path to the cart icon (about 600 ms, ease-in-out). The cart icon bounces once and the count badge rolls to the new number (digit roll animation).
3. A toast appears with "Added to cart", a View cart link and an Undo action.
4. The cart opens ONLY when the user clicks the cart icon or View cart. Desktop: right-side drawer (spring animation); mobile: bottom sheet with drag handle.
5. Drawer content: items grouped by vendor (vendor header with shipping estimate), each row with thumbnail, title, variant text, quantity stepper, line price, remove and save-for-later; free-shipping progress bar ("Add ৳420 more for free delivery"); coupon field with inline validation; order estimate; primary Checkout button; "You may also like" strip.
6. Updates are optimistic with rollback on failure. Stock problems appear inline on the affected row, not as popups. With `prefers-reduced-motion`, replace the flight and bounce with a simple fade.

## Animation catalog
Use the `motion` library; GPU-friendly properties only (transform, opacity). Tokens: fast 120 ms, base 200 ms, slow 320 ms, page 520 ms maximum; spring for drawers (stiffness about 300, damping about 30). Required: page and route transitions (View Transitions where supported, fallback fade); staggered grid reveal (40 ms step) on first view; scroll-reveal with IntersectionObserver; card hover lift and image swap; mega menu spring; marquee; countdown digits; animated number counters and chart draw-in on dashboards; wishlist heart pop; checkout progress bar fill; order timeline fill; layout animation on reorder lists in CMS builders; focus-ring transitions. Nothing longer than 600 ms except decorative marquee. All animation respects `prefers-reduced-motion`. Zero layout shift (CLS below 0.1).

## Skeleton loading system (must match the UI exactly)
- Every UI component that loads data is built as a pair in the same folder: `Thing.tsx` and `ThingSkeleton.tsx`. The skeleton uses the SAME layout constants (grid, aspect ratios, paddings, line heights, radii) exported from a shared `layout.ts`, so dimensions always match.
- Skeleton shapes mirror content: 4:5 image block plus two text lines and a price line for product cards; circle plus lines for vendor rows; table rows for admin tables; stat tiles for dashboards; timeline dots for order tracking.
- Colors come only from `skeleton-base` / `skeleton-shine` tokens; the shimmer is a soft diagonal sweep (1.4 s loop), static when reduced motion is on.
- Every route segment has a `loading.tsx`; every async section is wrapped in Suspense with its matching skeleton.
- A Playwright test compares skeleton and loaded bounding boxes for key components and fails if the difference exceeds 4 px or causes layout shift.

## States and polish
Designed empty states (illustration built with SVG and tokens, helpful text, a call to action), friendly error states with retry, custom 404 and 500 pages, toast system, confirm dialogs for destructive actions, form field errors with ARIA, and keyboard shortcuts in CMS (Cmd/Ctrl+K palette, `g` then `o` for orders, and so on). Icons: Lucide. No emojis in the UI. Brand mark and patterns are original (SVG), never copied logos.