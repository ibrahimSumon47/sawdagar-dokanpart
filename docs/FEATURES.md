# Features

| Feature | Implementation | Status |
|---|---|---|
| Better Auth email/password sessions on Neon | [auth.ts](../apps/web/lib/auth.ts), [route handler](../apps/web/app/api/auth/%5B...all%5D/route.ts) | Phase 2 |
| One-click demo sign-in for eight roles | [demo accounts](../packages/domain/src/auth/demoAccounts.ts), [action](../apps/web/features/auth/actions.ts), [sign-in page](../apps/web/app/sign-in/page.tsx) | Phase 2 |
| Server-enforced role areas and permissions | [roles.ts](../packages/domain/src/auth/roles.ts), [session guards](../apps/web/features/auth/session.ts) | Phase 2 |
| Account profile with validated phone, district and bio | [account page](../apps/web/app/account/page.tsx), [profile action](../apps/web/features/account/actions.ts) | Phase 2 |
| Vendor store membership and team view | [seller page](../apps/web/app/seller/page.tsx), [SellerPanel](../apps/web/features/seller/components/SellerPanel/SellerPanel.tsx) | Phase 2 |
| Permission-filtered admin overview and audit log | [admin page](../apps/web/app/admin/page.tsx), [AdminPanel](../apps/web/features/admin/components/AdminPanel/AdminPanel.tsx) | Phase 2 |
| Audit trail for demo sign-in and profile changes | [audit.ts](../apps/web/features/auth/audit.ts), [migration](../apps/web/prisma/migrations/20261028090000_init/migration.sql) | Phase 2 |
| Editorial Heritage design tokens, light and dark themes | [theme.css](../packages/ui/src/theme.css), [token test](../packages/ui/src/theme.test.ts) | Phase 1 |
| Shared component library with skeleton pairs | [components](../packages/ui/src/components), [ProductCard parity test](../packages/ui/src/components/ProductCard/ProductCard.test.tsx) | Phase 1 |
| Server-rendered theme choice stored in a cookie | [getTheme](../apps/web/features/preferences/getTheme.ts), [setTheme](../apps/web/features/preferences/actions.ts), [ThemeToggle](../apps/web/features/preferences/components/ThemeToggle/ThemeToggle.tsx) | Phase 1 |
| English and Bangla copy with a cookie-backed switcher | [messages](../apps/web/i18n/messages), [getLocale](../apps/web/i18n/getLocale.ts), [LocaleSwitcher](../apps/web/features/preferences/components/LocaleSwitcher/LocaleSwitcher.tsx) | Phase 1 |
| Storefront shell: notice strip, header, mobile menu, footer, trust strip | [SiteHeader](../apps/web/features/shell/components/SiteHeader/SiteHeader.tsx), [SiteFooter](../apps/web/features/shell/components/SiteFooter/SiteFooter.tsx), [TrustStrip](../apps/web/features/shell/components/TrustStrip/TrustStrip.tsx) | Phase 1 |
| Component gallery in both themes and at six widths | [/design page](../apps/web/app/design/page.tsx), [DesignGallery](../apps/web/features/design/components/DesignGallery/DesignGallery.tsx) | Phase 1 |
| Original jamdani brand mark and pattern | [BrandMark](../packages/ui/src/components/BrandMark/BrandMark.tsx), [JamdaniPattern](../packages/ui/src/components/JamdaniPattern/JamdaniPattern.tsx) | Phase 1 |
| Quality gates across three operating systems | [CI workflow](../.github/workflows/ci.yml), [formatting configuration](../.prettierrc.json) | Phase 0 |
