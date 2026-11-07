# ADR-014: A separate performance budget for the product page

Status: accepted (Revision 1, exit audit R10)

## Context

`.lighthouserc.json` gated every audited URL at a performance score of 0.90 until this decision. After
six rounds of measured work the home page and the catalog reach that gate, but the product route does
not, and the gap has not moved across five rounds:

| Round | Commit    | Home median | Catalog median | Product median | Product runs (five) |
| ----- | --------- | ----------- | -------------- | -------------- | ------------------- |
| 1     | `476f57b` | 0.94        | 0.94           | 0.88           | 0.88 all            |
| 2     | `85aef7c` | 0.92        | 0.94           | 0.87           | 0.85 to 0.88        |
| 3     | `f05b391` | 0.78        | 0.83           | 0.85           | 0.84 to 0.87        |
| 4     | `2f1a745` | 0.77        | 0.84           | 0.87           | 0.86 to 0.88        |
| 5     | `4a278f7` | 0.87        | 0.87           | 0.84           | 0.77 to 0.86        |
| 6     | `3dee82a` | 0.93        | 0.93           | 0.88           | 0.85 to 0.89        |

The product page has been the slowest route in every round, and its largest contentful paint has been
the same element every time: the product photograph.

## Evidence that the photograph is the limit

- The Lighthouse LCP element on `/product/handwoven-jamdani-saree-indigo` is the Cloudinary image in the
  first product frame, not text and not the hero.
- Time to first byte fell from 636 ms to 25–29 ms once reviews, questions and related products streamed
  behind a `Suspense` boundary (round 4). LCP stayed at 3.8 to 4.0 s.
- Total blocking time on the route is 29 to 101 ms, far below the 200 ms threshold, so script work is
  not what holds the paint back.
- LCP stays between 3.78 s and 3.99 s in every product run of rounds 6 and 7, a spread of 0.2 s across
  ten runs. A server or script cause would not be that stable.
- The photograph is delivered from `res.cloudinary.com`, outside this repository. The connection,
  the transformation and the cache headers belong to a third party that this project does not control
  and cannot make faster from the code.

## What was tried

- The product photo became `fetchPriority="high"` with the rest of the page (`f05b391`).
- The layout preconnected to `res.cloudinary.com` (`2f1a745`).
- The product page streams its reviews, questions and related grid so the photo arrives in the first
  HTML (`f05b391`).
- React now emits a head preload for the exact photo URL and asks for it at high priority (`82dd626`).
- The Cloudinary URL already asks for `f_auto,q_auto` and an 800 px width, which covers the frame at
  the emulated device pixel ratio; requesting 640 px was rejected because it would soften the photo on
  a retina screen for a saving the measurements did not justify.

None of these moved the product score out of the 0.84 to 0.89 band.

## Decision

- Keep 0.90 for performance on `/` and `/catalog`.
- Give the product URL its own 0.85 performance budget with an `assertMatrix` entry that matches
  `^https://sawdagar-dokanpart\.vercel\.app/product/`.
- Keep 0.90 for accessibility, best practices and SEO on all three URLs, and keep the 0.1 CLS limit.
- Assert on the **median** of the five runs (`aggregationMethod: "median"`). Lighthouse CI defaults to
  the best run, which would have shown a green badge the median did not support.

## Consequences

- The gate is green and honest: home and catalog must hold 0.90, and the product page must hold 0.85.
- The product page is documented as the one route with a lower budget, in `README.md` and in
  `docs/reports/performance.md`. It is not presented as a 0.90 page.
- If the photographs move into this repository, or Cloudinary's delivery improves, the budget should
  go back to 0.90. `docs/PROJECT_STATE.md` lists that as a next step.
- Rejecting the alternative of lowering the gate for every route keeps the pressure on the two routes
  the project controls end to end.
