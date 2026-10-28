import type { Metadata } from 'next';
import { Fraunces, Inter, Noto_Sans_Bengali } from 'next/font/google';
import type { ReactNode } from 'react';
import { getViewer } from '../features/auth/session';
import { getTheme } from '../features/preferences/getTheme';
import { SiteFooter } from '../features/shell/components/SiteFooter';
import { SiteHeader } from '../features/shell/components/SiteHeader';
import { getDictionary } from '../i18n';
import { getLocale } from '../i18n/getLocale';
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
  const copy = getDictionary(await getLocale());

  return {
    title: { default: copy.meta.title, template: `%s · ${copy.meta.title}` },
    description: copy.meta.description,
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

/** Renders the shell, theme attributes and language for every route. */
export default async function RootLayout({ children }: RootLayoutProps) {
  const [locale, theme, viewer] = await Promise.all([getLocale(), getTheme(), getViewer()]);
  const copy = getDictionary(locale);

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${inter.variable} ${fraunces.variable} ${notoSansBengali.variable}`}
    >
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-background"
        >
          {copy.common.skipToContent}
        </a>
        <div className="flex min-h-svh flex-col">
          <SiteHeader
            copy={copy}
            locale={locale}
            theme={theme}
            viewer={viewer ? { name: viewer.name, role: viewer.role } : null}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter copy={copy} />
        </div>
      </body>
    </html>
  );
}
