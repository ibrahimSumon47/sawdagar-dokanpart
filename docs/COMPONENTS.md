# Components

Every component has one job, a typed props interface and a short TSDoc block. Shared pieces live in `packages/ui`; feature pieces live under `apps/web/features/<feature>/components`. Skeleton pairs sit in the same folder as the component they stand in for.

## Shared design system (`@sd/ui`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| AnnouncementBar | Thin moving strip for the demo notice; the moving copy is hidden from assistive technology and announced once. | `message`, `className` | [AnnouncementBar.tsx](../packages/ui/src/components/AnnouncementBar/AnnouncementBar.tsx) |
| Badge | Compact status label for sale flags and order states. | `tone` (`neutral`, `accent`, `success`, `warning`, `danger`), span attributes | [Badge.tsx](../packages/ui/src/components/Badge/Badge.tsx) |
| BrandMark | Original jamdani-inspired wordmark glyph drawn in the current text colour. | `className` | [BrandMark.tsx](../packages/ui/src/components/BrandMark/BrandMark.tsx) |
| Button | Action button in three variants and two sizes. | `variant`, `size`, button attributes | [Button.tsx](../packages/ui/src/components/Button/Button.tsx) |
| ButtonLink | Link that uses the button treatment. | `variant`, `size`, anchor attributes | [ButtonLink.tsx](../packages/ui/src/components/Button/ButtonLink.tsx) |
| EmptyState | Explains why a list has nothing to show and offers a next step. | `icon`, `title`, `description`, `action`, `className` | [EmptyState.tsx](../packages/ui/src/components/EmptyState/EmptyState.tsx) |
| ErrorState | Recoverable failure with a retry slot. | `title`, `description`, `action`, `className` | [ErrorState.tsx](../packages/ui/src/components/ErrorState/ErrorState.tsx) |
| JamdaniPattern | Decorative handloom motif used where product photography will sit. | `className` | [JamdaniPattern.tsx](../packages/ui/src/components/JamdaniPattern/JamdaniPattern.tsx) |
| MegaMenu | Click-opened desktop category panel that closes on Escape or outside press. | `label`, `links`, `className` | [MegaMenu.tsx](../packages/ui/src/components/MegaMenu/MegaMenu.tsx) |
| Price | Taka price with an optional struck-through original, English or Bangla numerals. | `amountMinor`, `compareAtMinor`, `locale`, `size`, `className` | [Price.tsx](../packages/ui/src/components/Price/Price.tsx) |
| ProductCard | Product summary: media, vendor, title, rating and price. | `product`, `locale`, `ratingLabel`, `saleLabel`, `className` | [ProductCard.tsx](../packages/ui/src/components/ProductCard/ProductCard.tsx) |
| ProductCardSkeleton | Reserves the product card layout while data loads. | `className` | [ProductCardSkeleton.tsx](../packages/ui/src/components/ProductCard/ProductCardSkeleton.tsx) |
| QuantityStepper | Accessible quantity control that clamps to a minimum and maximum. | `value`, `onChange`, `min`, `max`, `label`, `labels`, `className` | [QuantityStepper.tsx](../packages/ui/src/components/QuantityStepper/QuantityStepper.tsx) |
| RatingStars | Five-star rating with a partial fill overlay and a localised description. | `rating`, `reviewCount`, `label`, `size`, `className` | [RatingStars.tsx](../packages/ui/src/components/RatingStars/RatingStars.tsx) |
| SectionHeading | Section title with optional eyebrow, description and action. | `title`, `eyebrow`, `description`, `action`, `className` | [SectionHeading.tsx](../packages/ui/src/components/SectionHeading/SectionHeading.tsx) |
| Skeleton | Shimmering block that reserves space. | div attributes including `className` | [Skeleton.tsx](../packages/ui/src/components/Skeleton/Skeleton.tsx) |
| SkeletonText | Paragraph-shaped placeholder lines. | `lines`, `widths`, `className` | [SkeletonText.tsx](../packages/ui/src/components/Skeleton/SkeletonText.tsx) |
| VendorRow | Compact store summary with initials, location, follow count, rating and verification. | `name`, `location`, `rating`, `reviewCount`, `ratingLabel`, `meta`, `verified`, `className` | [VendorRow.tsx](../packages/ui/src/components/VendorRow/VendorRow.tsx) |
| VendorRowSkeleton | Reserves the vendor row layout while data loads. | `className` | [VendorRowSkeleton.tsx](../packages/ui/src/components/VendorRow/VendorRowSkeleton.tsx) |

Layout constants shared by the product card and its skeleton live in [productCardLayout.ts](../packages/ui/src/components/ProductCard/productCardLayout.ts). Theme tokens live in [theme.css](../packages/ui/src/theme.css).

## Authentication (`apps/web/features/auth`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| SubmitButton | Submit control that reports its pending state through `useFormStatus`. | `label`, `pendingLabel`, `size`, `className` | [SubmitButton.tsx](../apps/web/features/auth/components/SubmitButton/SubmitButton.tsx) |
| DemoAccountCard | One allowlisted demo login form with role badge and email. | `email`, `name`, `roleLabel`, `next`, `labels` | [DemoAccountCard.tsx](../apps/web/features/auth/components/DemoAccountCard/DemoAccountCard.tsx) |
| SetupNotice | Explains missing database or auth secrets and names the variables. | `title`, `body`, `hint` | [SetupNotice.tsx](../apps/web/features/auth/components/SetupNotice/SetupNotice.tsx) |
| SignInPanel | Sign-in page body with the eight demo cards or the setup notice. | `copy`, `next`, `configured`, `error` | [SignInPanel.tsx](../apps/web/features/auth/components/SignInPanel/SignInPanel.tsx) |
| RoleBadge | Role label with a tone for buyer, vendor or admin areas. | `role`, `label` | [RoleBadge.tsx](../apps/web/features/auth/components/RoleBadge/RoleBadge.tsx) |

## Account (`apps/web/features/account`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| FormField | Label, hint and control wrapper for the profile form. | `htmlFor`, `label`, `hint`, `children` | [FormField.tsx](../apps/web/features/account/components/FormField/FormField.tsx) |
| ProfileForm | Editable name, phone, district and bio with server validation feedback. | `initial`, `copy` | [ProfileForm.tsx](../apps/web/features/account/components/ProfileForm/ProfileForm.tsx) |
| SignOutButton | Form that revokes the session and returns home. | `label` | [SignOutButton.tsx](../apps/web/features/account/components/SignOutButton/SignOutButton.tsx) |
| AccountHeader | Avatar initials, identity, role, demo flag and account actions. | `viewer`, `copy`, `roleLabel`, `locale`, `links` | [AccountHeader.tsx](../apps/web/features/account/components/AccountHeader/AccountHeader.tsx) |
| MembershipCard | One vendor store membership with role and join date. | `name`, `slug`, `joinedAt`, `roleLabel`, `copy`, `locale` | [MembershipCard.tsx](../apps/web/features/account/components/MembershipCard/MembershipCard.tsx) |
| AccountPanel | Account page layout: tabs, identity, profile form and memberships. | `viewer`, `profile`, `memberships`, `copy`, `locale` | [AccountPanel.tsx](../apps/web/features/account/components/AccountPanel/AccountPanel.tsx) |
| AccountTabs | Section switcher shared by every account page, with `aria-current` on the active tab. | `active`, `copy` | [AccountTabs.tsx](../apps/web/features/account/components/AccountTabs/AccountTabs.tsx) |
| AccountSection | Account sub-page frame: heading, description, tabs and content. | `active`, `title`, `description`, `copy`, `children` | [AccountSection.tsx](../apps/web/features/account/components/AccountSection/AccountSection.tsx) |
| AccountOrdersList | Order history rows with status, total and receipt link, or an empty state. | `orders`, `copy`, `checkoutCopy`, `locale` | [AccountOrdersList.tsx](../apps/web/features/account/components/AccountOrdersList/AccountOrdersList.tsx) |
| AccountReviewsPanel | Delivered items awaiting a review, then the buyer's published reviews. | `awaiting`, `published`, `copy`, `reviewsCopy`, `locale` | [AccountReviewsPanel.tsx](../apps/web/features/account/components/AccountReviewsPanel/AccountReviewsPanel.tsx) |
| AccountQuestionsPanel | The buyer's questions with product links and seller answers. | `questions`, `copy`, `questionsCopy`, `locale` | [AccountQuestionsPanel.tsx](../apps/web/features/account/components/AccountQuestionsPanel/AccountQuestionsPanel.tsx) |
| AccountReturnsPanel | Returnable delivered lines, then the requests already opened. | `items`, `requests`, `copy`, `locale` | [AccountReturnsPanel.tsx](../apps/web/features/account/components/AccountReturnsPanel/AccountReturnsPanel.tsx) |

## Reviews, questions and returns

| Component | Purpose | Props | Path |
|---|---|---|---|
| ProductReviews | Review summary and the latest published reviews, or the no-review state. | `summary`, `reviews`, `copy`, `locale` | [ProductReviews.tsx](../apps/web/features/reviews/components/ProductReviews/ProductReviews.tsx) |
| ReviewSummary | Average score and five distribution bars. | `summary`, `copy` | [ReviewSummary.tsx](../apps/web/features/reviews/components/ReviewSummary/ReviewSummary.tsx) |
| ReviewCard | One review with author initials, stars, verified badge, text and photos. | `review`, `copy`, `locale` | [ReviewCard.tsx](../apps/web/features/reviews/components/ReviewCard/ReviewCard.tsx) |
| ReviewForm | Collapsed form for one delivered line, with stars, text and photos. | `item`, `labels`, `locale` | [ReviewForm.tsx](../apps/web/features/reviews/components/ReviewForm/ReviewForm.tsx) |
| RatingInput | Five-star radio group with a visible selected state. | `label`, `hint`, `defaultValue` | [RatingInput.tsx](../apps/web/features/reviews/components/RatingInput/RatingInput.tsx) |
| ReviewPhotoPicker | Chooses up to three photos, resizes them in the browser and posts data URLs. | `labels` | [ReviewPhotoPicker.tsx](../apps/web/features/reviews/components/ReviewPhotoPicker/ReviewPhotoPicker.tsx) |
| ProductQuestions | Public questions and seller answers, with the ask form or a sign-in link. | `productId`, `productSlug`, `questions`, `copy`, `signInLabel`, `signedIn`, `locale` | [ProductQuestions.tsx](../apps/web/features/questions/components/ProductQuestions/ProductQuestions.tsx) |
| AskQuestionForm | Signed-in buyer's question form with validation feedback. | `productId`, `copy` | [AskQuestionForm.tsx](../apps/web/features/questions/components/AskQuestionForm/AskQuestionForm.tsx) |
| ReturnForm | Reason, note and submit action for one delivered line. | `orderItemId`, `copy` | [ReturnForm.tsx](../apps/web/features/returns/components/ReturnForm/ReturnForm.tsx) |

## Seller (`apps/web/features/seller`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| StoreCard | Store identity and the viewer's owner or staff role. | `name`, `slug`, `joinedAt`, `roleLabel`, `copy`, `locale` | [StoreCard.tsx](../apps/web/features/seller/components/StoreCard/StoreCard.tsx) |
| TeamMemberRow | One store team member with role and join date. | `name`, `email`, `roleLabel`, `joinedLabel`, `joinedAt` | [TeamMemberRow.tsx](../apps/web/features/seller/components/TeamMemberRow/TeamMemberRow.tsx) |
| SellerEmpty | Shown when a vendor account has no store membership. | `copy` | [SellerEmpty.tsx](../apps/web/features/seller/components/SellerEmpty/SellerEmpty.tsx) |
| SellerPanel | Read-only store summary and team list. | `membership`, `copy`, `locale` | [SellerPanel.tsx](../apps/web/features/seller/components/SellerPanel/SellerPanel.tsx) |

## Admin (`apps/web/features/admin`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| StatTile | Count tile for the admin overview. | `label`, `value` | [StatTile.tsx](../apps/web/features/admin/components/StatTile/StatTile.tsx) |
| UserList | Newest accounts with role and demo flag. | `users`, `copy`, `locale` | [UserList.tsx](../apps/web/features/admin/components/UserList/UserList.tsx) |
| AuditList | Newest audit entries with actor and time. | `entries`, `copy`, `locale` | [AuditList.tsx](../apps/web/features/admin/components/AuditList/AuditList.tsx) |
| PermissionList | Permission codes held by the signed-in admin role. | `permissions`, `copy` | [PermissionList.tsx](../apps/web/features/admin/components/PermissionList/PermissionList.tsx) |
| AdminPanel | Admin layout whose panels follow role permissions. | `role`, `permissions`, `totalUsers`, `demoUsers`, `users`, `auditEntries`, `canReadUsers`, `canReadAudit`, `copy`, `locale` | [AdminPanel.tsx](../apps/web/features/admin/components/AdminPanel/AdminPanel.tsx) |

## Shell (`apps/web/features/shell`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| SiteHeader | Sticky storefront header with notice strip, wordmark, role-aware links and preferences. | `copy`, `locale`, `theme`, `viewer` | [SiteHeader.tsx](../apps/web/features/shell/components/SiteHeader/SiteHeader.tsx) |
| MobileMenu | Disclosure navigation for narrow screens; closes with Escape or a chosen link. | `links`, `labels`, `className` | [MobileMenu.tsx](../apps/web/features/shell/components/SiteHeader/MobileMenu.tsx) |
| SiteFooter | Footer with the project notice, explore links and demo disclaimer. | `copy` | [SiteFooter.tsx](../apps/web/features/shell/components/SiteFooter/SiteFooter.tsx) |
| TrustStrip | Three short promises under the home hero. | `points` | [TrustStrip.tsx](../apps/web/features/shell/components/TrustStrip/TrustStrip.tsx) |

## Preferences (`apps/web/features/preferences`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| ThemeToggle | Sun/moon form button that stores the opposite theme in a cookie. | `theme`, `labels` | [ThemeToggle.tsx](../apps/web/features/preferences/components/ThemeToggle/ThemeToggle.tsx) |
| LocaleSwitcher | EN/বাংলা control that stores the chosen language in a cookie. | `locale`, `label` | [LocaleSwitcher.tsx](../apps/web/features/preferences/components/LocaleSwitcher/LocaleSwitcher.tsx) |

## Catalog (`apps/web/features/catalog`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| HomeCatalog | Home departments from the live category tree, then featured products. | `categories`, `featured`, `locale`, `copy` | [HomeCatalog.tsx](../apps/web/features/catalog/components/HomeCatalog/HomeCatalog.tsx) |
| CategoryTiles | Compact department grid; each tile opens the catalog filtered to that category. | `categories` (`CategoryTile[]`: `slug`, `name`), `locale` | [CategoryTiles.tsx](../apps/web/features/catalog/components/CategoryTiles/CategoryTiles.tsx) |
| CategoryNav | Department chips and, when one is active, its leaf-category row with product counts. | `categories`, `filters`, `locale`, `copy` | [CategoryNav.tsx](../apps/web/features/catalog/components/CategoryNav/CategoryNav.tsx) |
| CatalogSearch | GET search form that carries the active facets in hidden fields. | `filters`, `copy` | [CatalogSearch.tsx](../apps/web/features/catalog/components/CatalogSearch/CatalogSearch.tsx) |
| CatalogFilters | Price, rating, stock and sort facets as a plain GET form, so every value stays in the URL. | `filters`, `copy` | [CatalogFilters.tsx](../apps/web/features/catalog/components/CatalogFilters/CatalogFilters.tsx) |
| CatalogView | Full listing body shared by search, category and vendor views; owns the results heading, grid, empty state and pagination. | `filters`, `categories`, `category`, `vendor`, `result`, `copy`, `locale` | [CatalogView.tsx](../apps/web/features/catalog/components/CatalogView/CatalogView.tsx) |
| ProductGrid | Responsive one-to-four-column product grid with wishlist hearts; accepts plain labels so it also renders inside client views. | `products`, `locale`, `labels` (`sale`, `soldOut`, `ratingLabels`) | [ProductGrid.tsx](../apps/web/features/catalog/components/ProductGrid/ProductGrid.tsx) |
| ProductGridSkeleton | Matches the responsive columns of `ProductGrid` while the page loads. | `count`, `label` | [ProductGridSkeleton.tsx](../apps/web/features/catalog/components/ProductGrid/ProductGridSkeleton.tsx) |
| Pagination | Previous/next pagination that keeps every active filter in the URL. | `filters`, `page`, `pageCount`, `locale`, `copy` | [Pagination.tsx](../apps/web/features/catalog/components/Pagination/Pagination.tsx) |
| ProductDetail | Product page body: breadcrumbs, media, title, rating, variants, shipping, description, vendor, reviews, questions and related products. | `product`, `related`, `reviews`, `reviewSummary`, `questions`, `signedIn`, `locale`, `copy` | [ProductDetail.tsx](../apps/web/features/catalog/components/ProductDetail/ProductDetail.tsx) |
| ProductBreadcrumbs | Home, catalog, department, category and product trail. | `category`, `productTitle`, `locale`, `copy` | [ProductBreadcrumbs.tsx](../apps/web/features/catalog/components/ProductBreadcrumbs/ProductBreadcrumbs.tsx) |
| ProductMedia | Original SVG pattern that stands in for photography, toned per product. | `tone`, `className` | [ProductMedia.tsx](../apps/web/features/catalog/components/ProductMedia/ProductMedia.tsx) |
| ProductVendorCard | Vendor summary with district, rating, verification and product count; links to the vendor-filtered catalog. | `vendor`, `locale`, `copy` | [ProductVendorCard.tsx](../apps/web/features/catalog/components/ProductVendorCard/ProductVendorCard.tsx) |
| VariantPicker | Controlled variant radios; the buy box owns selection and renders price, SKU and stock. | `variants`, `selectedId`, `onSelect`, `name`, `locale`, `label` | [VariantPicker.tsx](../apps/web/features/catalog/components/VariantPicker/VariantPicker.tsx) |
| ProductJsonLd | Schema.org Product structured data with escaped text for a script context. | `product`, `locale` | [ProductJsonLd.tsx](../apps/web/features/catalog/components/ProductJsonLd/ProductJsonLd.tsx) |

## Shop (`apps/web/features/shop`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| ShopProvider | One client boundary for cart, coupons, wishlist, comparison, drawer and toast; receives the server-rendered cart, coupon and saved ids. | `children`, `initialItems`, `initialCoupon`, `initialWishlistIds`, `initialCompareIds`, `signedIn`, `locale`, `copy` | [ShopProvider.tsx](../apps/web/features/shop/components/ShopProvider/ShopProvider.tsx) |
| ShopToast | Bottom notification with an action link and optional undo callback. | none; reads `useShop` | [ShopToast.tsx](../apps/web/features/shop/components/ShopToast/ShopToast.tsx) |
| CartTrigger | Header cart button with a count badge and a short bump when the count grows. | none; reads `useShop` | [CartTrigger.tsx](../apps/web/features/shop/components/CartTrigger/CartTrigger.tsx) |
| CompareTrigger | Header comparison shortcut with its count, shown only while products are selected. | none; reads `useShop` | [CompareTrigger.tsx](../apps/web/features/shop/components/CompareTrigger/CompareTrigger.tsx) |
| CartDrawer | Native modal drawer on desktop and bottom sheet on phones; owns the empty state and vendor groups. | none; reads `useShop` | [CartDrawer.tsx](../apps/web/features/shop/components/CartDrawer/CartDrawer.tsx) |
| CartGroup | One vendor's heading, shipping origin and cart rows. | `group` (`vendor`, `items`, `subtotalMinor`) | [CartGroup.tsx](../apps/web/features/shop/components/CartDrawer/CartGroup.tsx) |
| CartLineItem | Thumbnail, title, variant, quantity stepper, line price, save-for-later and remove with inline stock errors. | `line` (`CartLine`) | [CartLineItem.tsx](../apps/web/features/shop/components/CartDrawer/CartLineItem.tsx) |
| CartSummary | Free-delivery progress, coupon entry, subtotal, delivery, discount, estimated total and the disabled checkout note. | none; reads `useShop` | [CartSummary.tsx](../apps/web/features/shop/components/CartDrawer/CartSummary.tsx) |
| CouponForm | Coupon code field with inline validation, the applied code and a remove action. | none; reads `useShop` | [CouponForm.tsx](../apps/web/features/shop/components/CouponForm/CouponForm.tsx) |
| AddToCartButton | Adds the selected variant through idle, spinner and check states, with an inline error. | `variantId`, `quantity`, `disabled`, `className` | [AddToCartButton.tsx](../apps/web/features/shop/components/AddToCartButton/AddToCartButton.tsx) |
| WishlistButton | Heart that saves or removes one product and prompts guests to sign in. | `productId`, `showLabel`, `className` | [WishlistButton.tsx](../apps/web/features/shop/components/WishlistButton/WishlistButton.tsx) |
| CompareButton | Adds or removes one product from the four-product comparison. | `productId`, `className` | [CompareButton.tsx](../apps/web/features/shop/components/CompareButton/CompareButton.tsx) |
| ProductBuyBox | Variant picker, price, stock, quantity, add-to-cart, wishlist and compare actions. | `productId`, `variants`, `locale`, `stockLabels` | [ProductBuyBox.tsx](../apps/web/features/shop/components/ProductBuyBox/ProductBuyBox.tsx) |
| WishlistView | Saved-product grid filtered live as hearts are switched off. | `products`, `locale`, `labels`, `empty` | [WishlistView.tsx](../apps/web/features/shop/components/WishlistView/WishlistView.tsx) |
| CompareView | Comparison page body with empty state, single-item notice, clear action and the table. | `products`, `locale`, `labels` | [CompareView.tsx](../apps/web/features/shop/components/CompareView/CompareView.tsx) |
| CompareTable | Accessible side-by-side attribute table with one removable column per product. | `products`, `locale`, `labels` (`title`, `remove`, rows, stock labels, rating labels) | [CompareTable.tsx](../apps/web/features/shop/components/CompareView/CompareTable.tsx) |
| CompareRow | One labelled attribute across every compared product. | `label`, `values` | [CompareRow.tsx](../apps/web/features/shop/components/CompareView/CompareRow.tsx) |

## Checkout and orders (`apps/web/features/checkout`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| CheckoutView | Client checkout form with saved-address choice, new-address fields, payment selection and live totals. | `items`, `coupon`, `addresses`, `copy`, `locale` | [CheckoutView.tsx](../apps/web/features/checkout/components/CheckoutView/CheckoutView.tsx) |
| AddressFields | Name, phone, division, district, upazila, area and street fields with district options from the selected division. | `value`, `onChange`, `copy` | [AddressFields.tsx](../apps/web/features/checkout/components/AddressFields/AddressFields.tsx) |
| PaymentOptions | Accessible radio cards for cash on delivery and MockPay. | `value`, `onChange`, `copy` | [PaymentOptions.tsx](../apps/web/features/checkout/components/PaymentOptions/PaymentOptions.tsx) |
| CheckoutSummary | Server-priced subtotal, shipping, coupon, included VAT and total beside the form. | `totals`, `count`, `couponCode`, `locale`, `copy` | [CheckoutSummary.tsx](../apps/web/features/checkout/components/CheckoutSummary/CheckoutSummary.tsx) |
| MockPayPanel | The sandbox gateway page with pay and cancel actions. | `paymentId`, `token`, `orderNumber`, `amountMinor`, `locale`, `copy` | [MockPayPanel.tsx](../apps/web/features/checkout/components/MockPayPanel/MockPayPanel.tsx) |
| OrderConfirmation | Receipt with placed/payment banners, seller groups, totals, address and invoice link. | `order`, `copy`, `locale`, `placed`, `paymentNotice`, `paymentHref` | [OrderConfirmation.tsx](../apps/web/features/checkout/components/OrderConfirmation/OrderConfirmation.tsx) |
| OrderItems | Seller sub-orders with item thumbnails, variant, SKU, quantity and line totals. | `order`, `copy`, `locale` | [OrderItems.tsx](../apps/web/features/checkout/components/OrderItems/OrderItems.tsx) |
| OrderTotals | Subtotal, shipping, coupon, included VAT and total for a stored order. | `order`, `copy`, `locale`, `className` | [OrderTotals.tsx](../apps/web/features/checkout/components/OrderTotals/OrderTotals.tsx) |
| InvoiceView | Printable invoice with bill-to, payment state, item table and totals. | `order`, `copy`, `locale` | [InvoiceView.tsx](../apps/web/features/checkout/components/InvoiceView/InvoiceView.tsx) |
| PrintButton | Opens the browser print dialog and hides itself in print. | `label` | [PrintButton.tsx](../apps/web/features/checkout/components/PrintButton/PrintButton.tsx) |
| MailOutboxList | Read-only list of in-app confirmation messages with their order links. | `messages`, `copy`, `locale` | [MailOutboxList.tsx](../apps/web/features/checkout/components/MailOutboxList/MailOutboxList.tsx) |

## Design gallery (`apps/web/features/design`)

| Component | Purpose | Props | Path |
|---|---|---|---|
| DesignGallery | Composes the Phase 1 gallery: tokens, components, states, themes, widths, skeletons and navigation. | `copy`, `locale` | [DesignGallery.tsx](../apps/web/features/design/components/DesignGallery/DesignGallery.tsx) |
| GallerySection | Consistent titled section with an anchor id. | `id`, `title`, `description`, `children` | [GallerySection.tsx](../apps/web/features/design/components/GallerySection/GallerySection.tsx) |
| TokenSection | Colour tokens and type specimens in the active theme. | `copy` | [TokenSection.tsx](../apps/web/features/design/components/TokenSection/TokenSection.tsx) |
| ActionSection | Buttons, badges, prices, ratings and the quantity demo. | `copy`, `locale` | [ActionSection.tsx](../apps/web/features/design/components/ActionSection/ActionSection.tsx) |
| FeedbackSection | Designed empty and error states. | `copy` | [FeedbackSection.tsx](../apps/web/features/design/components/FeedbackSection/FeedbackSection.tsx) |
| ThemeSection | The same component set on light and dark canvases. | `copy`, `locale`, `brand` | [ThemeSection.tsx](../apps/web/features/design/components/ThemeSection/ThemeSection.tsx) |
| WidthSection | Header and product grid frames at 360, 640, 768, 1024, 1280 and 1536 px. | `copy`, `locale`, `brand` | [WidthSection.tsx](../apps/web/features/design/components/WidthSection/WidthSection.tsx) |
| SkeletonSection | Loaded and loading pairs for the product card and vendor row. | `copy`, `locale` | [SkeletonSection.tsx](../apps/web/features/design/components/SkeletonSection/SkeletonSection.tsx) |
| NavigationSection | Mega menu demo and the category list its links point at. | `copy`, `locale` | [NavigationSection.tsx](../apps/web/features/design/components/NavigationSection/NavigationSection.tsx) |
| QuantityDemo | Client wrapper that holds quantity state for the gallery. | `label`, `decrease`, `increase` | [QuantityDemo.tsx](../apps/web/features/design/components/QuantityDemo/QuantityDemo.tsx) |
