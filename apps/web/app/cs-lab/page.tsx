import type { Metadata } from 'next';
import { CsLabView } from '../../features/lab/components/CsLabView';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  // Developer page: kept out of search results and the sitemap.
  return {
    title: copy.csLab.title,
    description: copy.csLab.description,
    robots: { index: false, follow: true },
  };
}

/** Developer page showing the CS core modules' real output. */
export default async function CsLabPage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);

  return <CsLabView copy={copy.csLab} locale={locale} />;
}
