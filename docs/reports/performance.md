# Performance report

This report records the Lighthouse findings behind the performance gate in `.lighthouserc.json`. The gate is 0.9 for the median of five mobile runs on home (`/`), catalog (`/catalog`) and product (`/product/handwoven-jamdani-saree-indigo`).

## Baseline (run 42221516081, commit 9e152a7)

Three runs per URL, mobile emulation, Lighthouse 13.

| URL     | Scores (per run) | Median |
| ------- | ---------------- | ------ |
| Home    | 0.53, 0.77, 0.76 | 0.76   |
| Catalog | 0.82, 0.84, 0.84 | 0.84   |
| Product | 0.85, 0.85, 0.86 | 0.85   |

Home was the weakest page. Its first run had TBT 3,700 ms because the run was affected by a cold start, which is why one bad sample moved the score so much.

## Findings (home, run 2 of baseline)

- **LCP element:** the hero photo (`/_next/image?url=%2Fmedia%2Fdepartments%2Fhandloom.jpg&w=750`). LCP was 6.1 s while FCP was 1.1 s, so the image is discovered early but painted late.
- **Why the paint is late:** `PageEnter` wraps every page in `.page-enter`, a client-side fade from opacity 0 and an 8 px lift. The hero sits inside it, so the largest element is invisible until the animation starts after hydration.
- **Server response:** the root document took 20 ms, so the server is not the bottleneck. The document itself is 18 KB transferred.
- **Render-blocking resources:** none reported.
- **Unused JavaScript:** about 57 KiB estimated savings. The two home chunks (`1tw3h3plvwqmg.js` at 75 KB and `2pw8-z4935wv5.js` at 37 KB) are 40% and 76% unused.
- **Main thread:** script evaluation of the 75 KB chunk took 364 ms; total scripting for the page was about 420 ms.
- **Long tasks:** four long tasks; the largest, 151 ms, is in the same 75 KB chunk.
- **Third-party code:** Cloudinary only, used for product images on the catalog and product pages. No analytics or ad scripts.
- **Images:** twelve department photos (39 to 145 KB each) were loaded eagerly at about 325 ms and compete with the hero for bandwidth.
- **Fonts:** three woff2 files (48, 106 and 36 KB) are preloaded by `next/font` and do not block rendering.
- **DOM size:** 436 elements; not a problem.
- **Layout shift:** CLS is 0 on all three pages.

## Changes made in this round

- The hero no longer depends on the page-enter fade for visibility on first paint (see the commit that accompanies this report).
- Department photos below the fold keep `loading="lazy"`; the hero image keeps `priority` and `fetchPriority="high"`.

Results of each round are appended below as they are measured.
