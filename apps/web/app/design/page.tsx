import type { Metadata } from 'next';
import { DesignGallery } from '../../features/design/components/DesignGallery';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  // Developer page: kept out of search results and the sitemap.
  return {
    title: copy.design.title,
    description: copy.design.description,
    robots: { index: false, follow: true },
  };
}

/** Component gallery for the design system. */
export default async function DesignPage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);

  return <DesignGallery copy={copy} locale={locale} />;
}
