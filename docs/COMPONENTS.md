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
| AccountPanel | Account page layout: identity, profile form and memberships. | `viewer`, `profile`, `memberships`, `copy`, `locale` | [AccountPanel.tsx](../apps/web/features/account/components/AccountPanel/AccountPanel.tsx) |

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
