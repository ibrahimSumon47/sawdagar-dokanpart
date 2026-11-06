import type { Metadata } from 'next';
import { Fraunces, Inter, Noto_Sans_Bengali } from 'next/font/google';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { getPublicSettings } from '../features/content/settingsQueries';
import { getTheme } from '../features/preferences/getTheme';
import { ShopProvider } from '../features/shop/components/ShopProvider';
import { PageEnter } from '../features/shell/components/PageEnter';
import { ShellAnnouncement, ShellFooter } from '../features/shell/components/ShellSettings';
import { ShellHeader } from '../features/shell/components/ShellHeader';
import { getDictionary } from '../i18n';
import { getLocale } from '../i18n/getLocale';
import { site } from '../lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-bengali',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, settings] = await Promise.all([getLocale(), getPublicSettings()]);
  const copy = getDictionary(locale);
  const bangla = locale === 'bn';
  const title =
    (bangla
      ? settings.seoTitleBn || settings.seoTitleEn
      : settings.seoTitleEn || settings.seoTitleBn) || copy.meta.title;
  const description =
    (bangla
      ? settings.seoDescriptionBn || settings.seoDescriptionEn
      : settings.seoDescriptionEn || settings.seoDescriptionBn) || copy.meta.description;

  return {
    metadataBase: new URL(site.demoUrl),
    applicationName: site.name,
    title: { default: title, template: `%s · ${title}` },
    description,
    openGraph: {
      type: 'website',
      siteName: site.name,
      url: site.demoUrl,
      locale: bangla ? 'bn_BD' : 'en_US',
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Renders the shell, theme attributes and language for every route.
 * Only the cookie reads (locale and theme) run here. The header, announcement and
 * footer read the database inside Suspense, so the shell streams without waiting
 * on those queries.
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  const copy = getDictionary(locale);

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${inter.variable} ${fraunces.variable} ${notoSansBengali.variable}`}
    >
      <head>
        {/* Opens the image host's connection early, so the product photo (the LCP image) starts sooner. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-background"
        >
          {copy.common.skipToContent}
        </a>
        <ShopProvider locale={locale} copy={copy.shop}>
          <div className="flex min-h-svh flex-col">
            {/* One boundary for the announcement and header, so the top bar arrives as one block
                instead of two separate shifts that push the page down. */}
            {/* The fallback reserves the header's real height at each breakpoint (it wraps to
                two rows below lg), so the top bar does not push the page down when it arrives. */}
            <Suspense
              fallback={<div className="h-[178px] border-b border-line lg:h-16" aria-hidden />}
            >
              <ShellAnnouncement locale={locale} />
              <ShellHeader locale={locale} theme={theme} />
            </Suspense>
            <main id="main" className="flex-1">
              <PageEnter>{children}</PageEnter>
            </main>
            <Suspense fallback={<div className="min-h-48 border-t border-line" aria-hidden />}>
              <ShellFooter locale={locale} />
            </Suspense>
          </div>
        </ShopProvider>
      </body>
    </html>
  );
}
