# Features

| Feature | Implementation | Status |
|---|---|---|
| Editorial Heritage design tokens, light and dark themes | [theme.css](../packages/ui/src/theme.css), [token test](../packages/ui/src/theme.test.ts) | Phase 1 |
| Shared component library with skeleton pairs | [components](../packages/ui/src/components), [ProductCard parity test](../packages/ui/src/components/ProductCard/ProductCard.test.tsx) | Phase 1 |
| Server-rendered theme choice stored in a cookie | [getTheme](../apps/web/features/preferences/getTheme.ts), [setTheme](../apps/web/features/preferences/actions.ts), [ThemeToggle](../apps/web/features/preferences/components/ThemeToggle/ThemeToggle.tsx) | Phase 1 |
| English and Bangla copy with a cookie-backed switcher | [messages](../apps/web/i18n/messages), [getLocale](../apps/web/i18n/getLocale.ts), [LocaleSwitcher](../apps/web/features/preferences/components/LocaleSwitcher/LocaleSwitcher.tsx) | Phase 1 |
| Storefront shell: notice strip, header, mobile menu, footer, trust strip | [SiteHeader](../apps/web/features/shell/components/SiteHeader/SiteHeader.tsx), [SiteFooter](../apps/web/features/shell/components/SiteFooter/SiteFooter.tsx), [TrustStrip](../apps/web/features/shell/components/TrustStrip/TrustStrip.tsx) | Phase 1 |
| Component gallery in both themes and at six widths | [/design page](../apps/web/app/design/page.tsx), [DesignGallery](../apps/web/features/design/components/DesignGallery/DesignGallery.tsx) | Phase 1 |
| Original jamdani brand mark and pattern | [BrandMark](../packages/ui/src/components/BrandMark/BrandMark.tsx), [JamdaniPattern](../packages/ui/src/components/JamdaniPattern/JamdaniPattern.tsx) | Phase 1 |
| Quality gates across three operating systems | [CI workflow](../.github/workflows/ci.yml), [formatting configuration](../.prettierrc.json) | Phase 0 |
