# UX benchmarks: marketplace features and flows

This note records how large online marketplaces document their navigation, filters, sorting and checkout, and what Sawdagar Dokanpat does with each pattern. It covers features and flows only. No assets, copy, code or branding were taken from any site. Each pattern below is tied to a public help page, and anything that could not be confirmed is listed as unverified.

## Method

1. Studied public help pages from Amazon and Etsy, which document browsing, search, filters, sorting and purchase steps.
2. Recorded only the patterns the help pages state. Screen counts, visual layout and wording were not inferred.
3. Mapped each confirmed pattern to the project's own implementation, which is the only thing this project ships.

## Category navigation

- **Amazon** documents a "shop by category" entry point and department-specific browse options, and also lets a shopper pick a department from the search box. Source: Amazon, "Searching and Browsing" help page.
- **Etsy** documents category as a search filter, not as a full browse hierarchy. Source: Etsy, "How to Search for Items and Shops" help page.
- **Sawdagar Dokanpat**: a category navigation component (`CategoryNav`) and category tiles on the home page (`CategoryTiles`). Both link into the catalogue, which keeps the browse path visible without a hidden mega menu.

## Filters and facets

- **Amazon** exposes refinements that depend on the chosen department.
- **Etsy** lists facets including price, delivery, category, location, item type and colour, and separates a desktop "Show filters" control from a mobile filter icon. Source: Etsy, search help page.
- **Sawdagar Dokanpat**: `CatalogFilters` is a single facet panel shared by the catalogue. Filters are kept in the URL, so a filtered list can be shared and restored on refresh.
- **Unverified**: whether either site shows removable applied-filter chips, whether a mobile filter opens as a bottom sheet, and whether a live results count appears. The help pages do not establish these, so this project does not claim to copy them. The chosen design follows the spec's bottom-sheet rule for mobile.

## Sort and result count

- **Amazon** documents featured, customer reviews, newest, price and best-seller ordering.
- **Etsy** documents relevance as the default, with price, top reviews and newest as options.
- **Sawdagar Dokanpat**: sorting is a select control, and the catalogue shows the result count in its heading. Pagination (`Pagination`) uses numbered pages.

## Checkout steps and order review

- **Amazon** documents the order as cart review, delivery address, payment, shipping option when applicable, then a final order review before placement.
- **Etsy** documents cart, shipping address and method, payment, and a confirmation of order details before placement. Its guest flow includes an explicit review step.
- Both are documented task sequences. They are not guaranteed screen counts.
- **Sawdagar Dokanpat**: `CheckoutView` shows the address, delivery and payment sections on one page, with `CheckoutSummary` beside them for the total. `OrderConfirmation` follows a placed order. The project has no numbered step indicator, so this is a single-page checkout rather than the multi-step flow the spec describes. That gap is recorded as an open item below.

## Patterns not adopted

- Hidden category mega menus were not adopted as the only browse path, because the project keeps category tiles on the home page so browsing is visible without hover.
- Infinite scroll was not adopted for the catalogue. Numbered pages keep the URL and the browser's back button in step, and make a position easy to share.

## Limits of this research

- Only two marketplaces were checked, and only through their public help pages. Their live interfaces may differ.
- Daraz and Flipkart were not verified, so nothing here is attributed to them.
- Points the help pages do not state are listed as unverified rather than filled in from memory.

## Open items

- The spec (02-design-system) asks for a three-step checkout progress bar (Address, Delivery and Payment, Review). The current checkout is one page with the sections visible together, so no step indicator exists yet. Treated as a known gap, not claimed as met.
