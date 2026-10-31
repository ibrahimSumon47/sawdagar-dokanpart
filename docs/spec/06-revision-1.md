# 06 — Revision 1 (Sawdagar Dokanpat)

> Status: ACTIVE. This file overrides any older rule in AGENTS.md or docs/spec/01–05 that conflicts with it.
> Log it first: append a "Revision 1" entry to docs/REQUIREMENTS_LOG.md, then work through the phases below in order.
> Rule for every phase: do not mark it Done until its acceptance checks pass AND you have opened the deployed page yourself (Playwright screenshot) at 375px, 768px and 1440px.

## 0. Why this revision exists (read this, then act on it)
The first build reads like a demo. A recruiter must feel they are looking at a real store that a real person could use today.
Concrete problems to fix:
1. A "Demo store, sandbox payments" banner sits on every page, and the navbar shows "Design system" and "GitHub repository".
2. No skeleton loaders that match the real layout.
3. The light/dark toggle changes instantly with no animation.
4. Sign-in is unclear and there is no registration. Only fixed demo accounts exist.
5. The CMS exists only late in the roadmap and is not usable as a real editorial tool.
6. No guest checkout flow and no public order tracking by order ID.
7. Animation is thin.
8. Product images repeat: every product in a category shows the same picture with the same alt text ("Representative photograph for Sarees"). The catalog header says "36 products" but shows 12 cards.
9. Copy says "demo", "sample data", "About this demo" in many places.

## 1. Remove the demo feel (do first, small)
- Delete the top banner "Demo store, sandbox payments".
- Navbar contains ONLY: logo, Catalog, Categories (mega menu), Sell on Sawdagar, search, language, theme toggle, wishlist, cart, account menu. Nothing about design system or GitHub.
- Move "Design system", "Case study", "CS core", "Image credits", "Source code (GitHub)" to the footer under a column called "Project" and to the `/about/project` page. Not in header, not in a sidebar on catalog pages.
- Remove the "Explore" sidebar and the "About this demo" note from catalog pages.
- Replace every user-facing word "demo", "sample", "fictional" with neutral store language. Keep honesty in exactly two places:
  1. Footer, one line: "Payments run in test mode. No real money is charged."
  2. Payment step of checkout, a small label next to the payment method: "Test-mode payment".
  The README, /about/project and llms.txt may state plainly that this is a portfolio project and that the data is seeded.
- Update AGENTS.md section 3: delete the rule "Show a visible 'Demo store, sandbox payments' notice" and replace with the two placements above.

## 2. Real authentication (Better Auth, no fixed-account shortcut)
Pages: /register, /login, /forgot-password, /reset-password, /verify-email, /account/security.
- Register with name, email, phone (BD format +8801XXXXXXXXX, validated), password (strength meter, min 10 chars), accept terms. Choose role at signup: "Shop as a customer" or "Apply to sell" (seller application goes to admin approval queue).
- Login with email + password. Add Google sign-in (free). Remember me. Clear error messages that do not reveal whether an email exists.
- Email verification and password reset via Resend when a verified domain exists; otherwise use the in-app mail outbox (viewable at /admin/outbox and shown to the user as "Check your email" with a dev-safe fallback link only for seeded accounts). Document the choice in an ADR.
- Optional 2FA (TOTP) for seller and admin, already in the stack.
- Sessions: httpOnly secure cookies, CSRF protection, rate limit login/register/reset (Upstash).
- Seeded accounts (customer, 2 sellers, admin) are REAL rows in the same tables. On /login show a small collapsed section "Try a ready-made account" with buttons that only PRE-FILL the email and password fields. The user still presses Sign in, and the request goes through the exact same endpoint as any other user. No bypass route, no hardcoded session.
- Passwords of seeded accounts live in env vars / seed script, never in client code.
- Acceptance: Playwright tests for register → verify → login → logout, wrong password, reset flow, seller application, rate limit, and logging in with a seeded account via the normal form.

## 3. CMS (build now, not last)
Move CMS from Phase 9 to immediately after Phase 2 below. Implement the four modules defined in docs/spec/01-product.md (read them again) inside /admin/cms, role-gated (admin + editor):
1. Pages and homepage sections (hero, collections, banners): drag to reorder, schedule publish, preview before publish, draft/published/archived.
2. Journal (blog): rich-text editor (Tiptap, free), cover image upload to Cloudinary, slug, SEO fields, categories/tags, scheduled publish.
3. Help Center: categories, articles, search, "was this helpful" counts.
4. Site settings: navigation menus, footer links, announcement bar (off by default), SEO defaults, shipping/return policy text, bilingual EN/BN fields.
Every CMS entity has: version history (last 10), audit log entry (who/when/what), optimistic UI, skeleton loaders, empty states, validation (Zod).
Public pages read CMS data (ISR with on-demand revalidation when published).
- Acceptance: an editor changes the homepage hero in /admin/cms and the public homepage updates within 60s without redeploy; Playwright test proves it.

## 4. Guest checkout and account prompt
Flow when the cart has items and the visitor is signed out and presses Checkout:
1. Modal "Create an account for faster checkout" with three actions: Create account, Sign in, Continue as guest. Benefits listed in 3 short lines (track orders, save addresses, wishlist sync). Closing the modal = Continue as guest.
2. Continue as guest → /checkout with a single-page form: name, phone, email, address (Division → District → Upazila dropdowns from the Bangladesh dataset in docs/spec/04, plus street, postcode, landmark), delivery notes, delivery method, payment method (COD or Test-mode payment), order summary, coupon.
3. After placing: /order/confirmed shows the ORDER ID big, a copy button, "Track this order" button, and a soft "Create an account to save this order" panel (prefilled email, only a password field).
4. If the guest later registers with the same email or phone, claim their guest orders (verify email first).
- Order ID format: `SD-YYMMDD-XXXX` (4 chars from an unambiguous alphabet, unique, indexed). Stored separately from the DB primary key.
- Guest stock is reserved for 15 minutes at checkout and released by a scheduled GitHub Action / cron route.
- Acceptance: Playwright covers guest checkout end to end on mobile viewport, prompt-modal skip, and the claim-on-register flow.

## 5. Public live order tracking
Route: /track (also linked in header "Track order" and footer).
- Input: Order ID + the phone OR email used at checkout. Both required. Signed-in users see their own orders at /account/orders/[id] with no extra input.
- Result: timeline (Placed → Confirmed → Packed → Shipped → Out for delivery → Delivered, plus Cancelled/Returned), per-vendor package status when an order has several sellers, courier name and tracking note, estimated date, items list.
- "Live": Vercel Hobby has no persistent WebSockets. Use Server-Sent Events with short reconnects, falling back to polling every 5s with ETag/304 when SSE is unavailable. Pause when the tab is hidden. Write an ADR (docs/adr) explaining this. The page must show a small "Live" pulse and a "Last updated N seconds ago" text.
- When a seller or admin changes status, the tracking page reflects it within ~5 seconds. Animate the timeline step change.
- Security: rate limit (Upstash) by IP and by order ID; return the SAME generic "We couldn't find an order with those details" for wrong ID or wrong contact; never leak partial info; no sequential IDs; log failed attempts.
- Acceptance: Playwright test with two browser contexts (seller updates status, tracker page updates), plus a test that wrong contact returns the generic message.

## 6. Product images: fix the duplicates properly
Root cause: the seed/fallback pipeline reuses one image per category. Fix at the data level, not by hiding it.
1. Create `packages/seed/images/manifest.json`: one entry per product with `productSlug`, `cloudinaryPublicId`, `sourceUrl`, `license`, `author`, `width`, `height`, `phash`, `alt` (specific, e.g. "Indigo handwoven Dhakai Jamdani saree draped on a wooden stand"), and 3–5 gallery images per product.
2. Sourcing script `scripts/images/fetch.ts` (free sources only: Pexels, Unsplash, Wikimedia Commons; API keys in env). Use MANY specific queries per subcategory (e.g. "jamdani saree", "tangail saree", "katan silk saree", "nakshi kantha", "terracotta pot"), not one query per category. Download, dedupe by perceptual hash (reject Hamming distance < 8), upload to Cloudinary under `sawdagar/products/<slug>/`, write the manifest. Record attribution on /image-credits.
3. A product may be published ONLY if it has its own main image plus at least 2 gallery images. If the pipeline cannot find enough distinct images for a subcategory, UNPUBLISH those products instead of reusing a photo. Fewer products with correct images beats 432 with wrong images. Target 120–200 well-imaged products; say so in the README instead of claiming 432.
4. Seed script reads the manifest only. Remove any category-level fallback image.
5. Fix the count mismatch: header "36 products" vs 12 cards. The count must come from the same query as the list (including pagination, filters and the stock filter), with a "Load more"/pagination control and URL-synced page.
6. Alt text: never the same alt for two products. Use `alt` from the manifest.
7. CI test (`scripts/ci/check-images.ts`, run in GitHub Actions): fail the build if any two published products share a Cloudinary public ID, a pHash within distance 8, or an alt string; or if any published product has fewer than 3 images.
8. Next/Image with correct `sizes`, blur placeholder from the manifest, lazy loading, no layout shift.
- Acceptance: open /catalog?category=sarees and every card shows a different, relevant photo; CI check passes; screenshot attached to PROJECT_STATE.

## 7. Skeleton loaders that match the UI
- Every route has a `loading.tsx` and every async component has a Suspense fallback built from the SAME layout components with `<Skeleton>` slots in place of content (same grid, same aspect ratios, same paddings). Do not use a generic spinner or a generic grey block.
- Required: home, catalog grid + filters sidebar, product page (gallery + buy box + tabs), cart drawer, checkout, tracking, account pages, seller dashboard tables/charts, admin tables, CMS editor, journal list/article, help center.
- Pair system: each real component `Foo` has `FooSkeleton` exported from the same folder, sharing a `layout constants` file so they cannot drift.
- Shimmer animation respects prefers-reduced-motion (static fade instead).
- Acceptance: Playwright test throttles the network, screenshots skeleton vs loaded for 6 key routes and fails if the layout shift (CLS) between them exceeds 0.05.

## 8. Animation pass
Use `motion` (already installed). Keep it tasteful, 60fps, transform/opacity only. All of it must obey prefers-reduced-motion.
- Theme toggle: View Transitions API circular reveal from the toggle button position, plus an icon morph (sun ↔ moon rotate/scale). Fallback to a 200ms cross-fade when View Transitions is unsupported. No flash on first load (inline script sets the theme before paint, light default).
- Page transitions between routes (fade + 8px rise), shared-element transition from product card image to product page image.
- Staggered reveal for grids and lists on scroll (once).
- Add-to-cart: product image flies to the cart icon, cart icon bounces, count badge pops, drawer slides in.
- Wishlist heart burst, quantity stepper number roll, price change tick.
- Navbar: hide on scroll down, show on scroll up; mega menu spring open; search overlay scale-in.
- Order tracking timeline: step fill animation, pulsing live dot.
- Buttons: press scale, loading morph to spinner with width preserved. Form fields: animated labels, error shake once.
- Counters on seller dashboard, charts draw-in, toast stack with swipe to dismiss.
- Acceptance: a short `/design-system/motion` catalog page lists each animation (linked from the footer only). A Playwright test confirms animations are disabled under reduced motion.

## 9. Global skills and tooling (install, verify, then use)
Honest constraints, follow them:
- Free only, no localhost services except where noted, no trials, no paid keys, Windows-safe. If a tool needs any of those, DO NOT install it. Write one line in docs/TOOLING.md: name, what it needs, "skipped because ...".
- Never install a whole 800-skill library into the agent skills folder: it burns context on every session. Use the two-tier method.

### 9.1 Tier 1: clone every repo into a global library (read-only reference)
Use a folder outside the project, e.g. `%USERPROFILE%\.agents\library\` (Windows) or `~/.agents/library/`. `git clone --depth 1` each of the 12 repos below into it. Nothing here is loaded into context automatically.
1. REA
2. claude-seo
3. replica-skill
4. awesome-design-md
5. stitch-skills
6. youtube-agent-skill
7. agentmemory
8. scientific-agent-skills
9. diagram-design (https://github.com/cathrynlavery/diagram-design)
10. anthropic-cybersecurity-skills
11. awesome-harness-engineering
12. OpenViking
(Use the exact GitHub URLs the owner gave in the earlier message; they are in docs/REQUIREMENTS_LOG.md.)

### 9.2 Tier 2: install only the skills this project needs, globally
Command pattern (works with skills CLI 1.7.4):
```
npx skills add <repo-url> --list
npx skills add <repo-url> -g -s <skill-name> -a <agent> -y --copy
npx skills list -g
```
- First run `npx skills add --help` and `--list` to see which agents the CLI supports. If Freebuff is not a supported agent, install to the generic `~/.agents/skills` location or copy the SKILL.md folders there, and say in docs/TOOLING.md exactly where they went.
- Install: diagram-design (all of it, 1 skill); replica-skill (use for UX analysis only, see rules); claude-seo (SEO-relevant skills only); anthropic-cybersecurity-skills (ONLY web-app, API, auth/session, OWASP, secrets, dependency-audit and CI/CD skills; at most 15 skills, list the chosen names in TOOLING.md); scientific-agent-skills (install NOTHING by default: it is off-topic for a store; log as skipped); youtube-agent-skill (skip unless it works with no API key; otherwise skip and log).
- Use as reference docs, not as installed skills: awesome-design-md (pick a DESIGN.md that fits "Editorial Heritage" and adapt it into docs/DESIGN.md), awesome-harness-engineering (ideas only, see 9.4).
- Special cases, decide and log:
  - REA (`npx rea-agents setup`): run it only if setup needs no account, no paid key and no admin rights. Otherwise skip and log.
  - stitch-skills: needs Google sign-in to the Stitch MCP. Skip unless it works free with no card; log the outcome.
  - agentmemory: runs a local daemon (localhost). This is the ONE allowed exception to "no localhost", for the developer machine only, and only if Freebuff is supported and it installs without admin rights on Windows. Otherwise skip and log. The repo's own docs/ memory files remain the source of truth.
  - OpenViking: AGPL license, needs a model provider and embedding model, mac/Linux installer. Skip and log. Never copy its code into this repo.
- Verification: run `npx skills list -g`, open each installed SKILL.md, confirm it loads, and write a table in docs/TOOLING.md: tool | installed? | where | version | reason if skipped. Report errors honestly. Do not claim success for anything you did not verify.
- "Install for me too": you can only install on this machine for the person running you. Also write a one-page `docs/TOOLING.md` "Reproduce on your machine" section with the exact commands so the owner can re-run them on any computer.

### 9.3 Use them in the project (this is the point)
- awesome-design-md + frontend-design: produce `docs/DESIGN.md` (tokens, type scale, spacing, motion rules) and make Tailwind tokens and components follow it. The Editorial Heritage identity stays; do not clone another brand.
- replica-skill: analyze a few real marketplaces for UX patterns (information architecture, filter behavior, checkout steps). Copy features and flows ONLY. Never copy assets, code, text or branding. Put findings in docs/research/ux-benchmarks.md.
- diagram-design: create architecture, checkout sequence, order-status state machine, ER diagram and CI pipeline diagrams. Export SVG (+PNG) to docs/diagrams/ and embed them in README, ARCHITECTURE.md and the case-study page.
- claude-seo: audit metadata, structured data (Product, Breadcrumb, Article, FAQ), sitemap, robots, canonical, Open Graph per product, hreflang EN/BN, Core Web Vitals. Fix findings; keep a short report in docs/reports/seo.md.
- cybersecurity skills: run a review of auth, sessions, CSRF, rate limits, IDOR on orders/tracking, file upload, secrets, dependency audit, headers (CSP). Fix findings; summary in docs/reports/security.md. Add `pnpm audit` and a secret scan to GitHub Actions.
- awesome-harness-engineering ideas: keep `docs/features.json` (id, description, acceptance, status pass/fail, evidence link). Only flip to pass after the Playwright test for it is green. Keep `docs/PROJECT_STATE.md` updated at the end of every session. Run the test gate before every push.

## 10. Roadmap for this revision (do in this order; one commit per logical change)
R1 Remove demo framing (section 1) → R2 Images pipeline + CI check (6) → R3 Real auth (2) → R4 Skeleton system (7) → R5 CMS (3) → R6 Guest checkout + order ID (4) → R7 Tracking (5) → R8 Animation pass (8) → R9 Tooling install + usage reports (9) → R10 README, llms.txt, PROJECT_FACTS.json, case study, screenshots refreshed; remove "demo" wording; 432 claim replaced with the real count.
After each phase: lint, typecheck, unit tests, Playwright, deploy to Vercel, open the live URL, then update docs/PROJECT_STATE.md and features.json.

## 11. Constraints that still apply
Free forever, no trials. Neon + Better Auth for this project. Only the `main` branch. Commits only under the owner's default git identity, no co-author trailers, no bot names. Small components, TSDoc plus "why" comments, no noise comments. Conventional commits. Bilingual EN/BN. Responsive 320px–1920px. Accessibility AA. Non-commercial use only (Vercel Hobby): no real payments, no real ads.