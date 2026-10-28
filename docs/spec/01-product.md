# 01 Product specification: Sawdagar Dokanpat

## Name and pitch
"Sawdagar" means merchant and "Dokanpat" means shops. Sawdagar Dokanpat is a multi-vendor marketplace where independent Bangladeshi sellers run their own storefronts inside one shared platform: one cart, split orders per seller, commissions, payouts, reviews and a full admin back office. Tagline: "Every dokan, one marketplace."

## Purpose
A portfolio-grade, industry-level full stack project demonstrating real marketplace engineering: catalog with variants, stock integrity under concurrency, multi-vendor checkout, order state machines, a double-entry finance ledger, role-based dashboards, CMS tooling, localization (English and Bangla) and CS fundamentals. It is a DEMO store: payments are sandbox only, all data is seeded demo data, and a visible notice says so.

## Who uses it (roles)
| Role | Purpose | Main areas |
|---|---|---|
| Guest | Browse, search, view stores | Storefront, product pages |
| Buyer | Shop, pay, track, review, return | Cart, checkout, account |
| Vendor Owner | Runs a store | Seller Center, full store control, staff, finance |
| Vendor Staff | Works for a store, limited by permission set (Catalog, Orders, Support) | Seller Center subsets |
| Support Agent (platform) | Helps buyers and vendors | Orders, disputes, tickets |
| Moderator (platform) | Keeps content clean | Products, reviews, Q&A, reports |
| Finance Admin (platform) | Money operations | Ledger, payouts, refunds, commissions |
| Content Editor (platform) | Site content | Storefront CMS, Help Center CMS |
| Super Admin | Everything | All admin areas, roles, feature flags, audit log |
Total: 1 anonymous role + 8 authenticated roles. Every role has a one-click "Try demo" login on the sign-in page (demo accounts cannot change email/password or delete themselves; demo data resets nightly).

## Profiles (4 types)
1. **Buyer Account profile** (private): header card with avatar (upload + crop), name, member-since, order and review counts. Tabs: Overview (stat tiles, recent orders, quick reorder), Orders, Addresses (Bangladesh division > district > upazila + area + phone), Wishlist, Reviews, Returns, Notifications, Security (password, two-factor, active sessions with sign-out), Preferences (language, theme, currency display). Desktop: left rail tabs; mobile: horizontally scrollable segmented tabs.
2. **Vendor Public Store profile** (public): wide cover banner, logo overlapping the banner, verified badge, rating and follower count, Follow button, tabs (Products, About, Policies, Reviews), featured collection, store announcement strip, share button. Accent color per store from a safe palette.
3. **Vendor Business profile** (Seller Center, private): business info, verification (KYC) status stepper with document uploads, payout accounts (display only), staff members table with role and permission editing, store settings (policies, shipping origin, holiday mode, return policy).
4. **Staff/Admin profile** (internal): compact page with avatar, role badge, permissions list (read only), sessions and two-factor, activity history from the audit log.

## CMS modules (4 distinct)
1. **Storefront CMS** (Content Editor, Super Admin): homepage section builder (hero carousel, flash sale with countdown, category tiles, featured vendors, collections, editorial banner, trust strip), announcement bar (marquee), navigation and mega menu editor, footer editor, static pages (About, Terms, Privacy, Returns, Shipping) with rich text, SEO fields per page.
2. **Catalog CMS** (Vendors for own items; Moderators and admins for all): products, variants, attributes and attribute sets, categories tree, brands, collections, media library, bulk CSV import/export, moderation queue.
3. **Vendor Store CMS** (Vendor Owner): store page builder (banner, about, featured products, policies, FAQ blocks), accent color, announcement text, collections for the store.
4. **Help Center and Journal CMS** (Content Editor): FAQ categories and articles, journal posts (seller stories, buying guides), tags, related articles.
How every CMS must look and behave: left sidebar + top bar with command palette (Ctrl/Cmd+K); list views are data tables (sticky header, column visibility, saved views, filters, bulk actions, keyboard navigation, density toggle); editors use a split layout with a live preview pane; block-based builders use drag and drop (dnd-kit); autosave with "Saved" indicator; Draft / Scheduled / Published states with publish scheduling; version history with diff and restore; role-gated actions; every change recorded in the audit log; the same design tokens as the storefront but a denser, calmer layout.

## Feature scope
### Storefront and buyer
- Home: announcement marquee, hero carousel, flash sales with countdown, category tiles, featured vendors, trending, recently viewed, "customers also bought".
- Catalog: 3-level category tree (12 top-level, 80+ subcategories), mega menu, search with autosuggest, typo tolerance and Bangla/English matching (for example "saree" finds "শাড়ি"), facet filters (price range, rating, brand, vendor, category-specific attributes, free shipping, in stock, discount), sorting, URL-synced filters, cursor pagination.
- Product page: variants as SKUs (own price, stock, images), gallery with zoom and swipe, reviews with photos and helpful votes, rating distribution, Q&A, vendor card, shipping estimate by district, related products, share, sticky mobile add-to-cart bar, JSON-LD Product schema.
- Wishlist, compare (up to 4), cart (guest cart merged on login), coupons (percent, fixed, free shipping; limits; vendor-scoped or global).
- Checkout: saved addresses, shipping fee per zone and vendor, per-vendor sub-orders, payment selection (Cash on Delivery, MockPay demo gateway, SSLCommerz sandbox, Stripe test mode), VAT display, order summary, success page.
- Orders: per-sub-order timeline, cancel before shipping, return/refund request with reason and photos, PDF invoice, reorder, in-app notifications and email.
- Follow vendors; reviews only after delivery (verified purchase).

### Vendor (Seller Center)
- Onboarding wizard with KYC documents (pending > approved / rejected / suspended).
- Dashboard (revenue, orders, conversion, top products, low stock, pending actions).
- Products: create/edit with variants and attributes, rich description, multi-image, draft/active/archived, bulk CSV import/export, low-stock alerts, inventory adjustments with history.
- Orders: confirmed > packed > shipped (courier + tracking id) > delivered; bulk actions; packing slip PDF; returns handling; review replies; Q&A answers.
- Promotions: coupons and timed price discounts.
- Finance: earnings ledger, commission breakdown, pending vs available balance, payout requests and history, statements.
- Analytics with date ranges; staff management.

### Admin
- Vendor approvals, users and roles, bans, categories/attributes, commission rules (global, per category, per vendor), order oversight, disputes, refunds, payouts, moderation queues, CMS modules, feature flags, platform analytics (GMV, take rate, active vendors, cohorts), audit log viewer, settings (shipping zones, VAT rate, return window).

## Business rules (seeded defaults, all configurable by Super Admin)
Commission 8% default (tiers per category); VAT shown at 15%; shipping zones: Inside Dhaka, Outside Dhaka, Remote; Cash on Delivery available for orders up to a configured limit; stock reservation held 15 minutes during checkout; return window 7 days after delivery; payout threshold and weekly cycle; coupon stacking: one coupon per order plus one free-shipping coupon.

## Localization (Bangladesh)
English and Bangla (next-intl). BDT with the ৳ sign and Bangla numerals in the Bangla locale. Dhaka time zone. Phone validation for Bangladesh mobile numbers (01X, 11 digits, +880 form). Festival campaigns (Eid, Pohela Boishakh, 11.11) in seed data and CMS banners.