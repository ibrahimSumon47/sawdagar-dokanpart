import type { ReactNode } from 'react';
import { getViewer } from '../../../auth/session';
import { getCatalogCategories } from '../../../catalog/queries';
import { localisedLinks } from '../../../content/settingsLinks';
import { getPublicSettings } from '../../../content/settingsQueries';
import { getDictionary, type Locale } from '../../../../i18n';
import { SiteHeader } from '../SiteHeader';
import type { Theme } from '../../../preferences/theme';

export interface ShellHeaderProps {
  locale: Locale;
  theme: Theme;
}

/**
 * The site header with its data: categories, navigation links and the visitor's
 * account links. It is rendered inside a Suspense boundary by the root layout, so
 * the page shell is not held back by these database reads.
 */
export async function ShellHeader({ locale, theme }: ShellHeaderProps): Promise<ReactNode> {
  const [viewer, categories, settings] = await Promise.all([
    getViewer(),
    getCatalogCategories(),
    getPublicSettings(),
  ]);
  const copy = getDictionary(locale);
  const headerCategories = categories.map((category) => ({
    slug: category.slug,
    label: category.name[locale],
  }));

  return (
    <SiteHeader
      copy={copy}
      locale={locale}
      theme={theme}
      viewer={viewer ? { name: viewer.name, role: viewer.role } : null}
      categories={headerCategories}
      extraLinks={localisedLinks(settings.navigation, locale)}
    />
  );
}
