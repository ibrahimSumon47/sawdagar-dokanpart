import type { Metadata } from 'next';
import { MediaCreditsView } from '../../features/content/components/MediaCreditsView';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.credits.title, description: copy.credits.description };
}

/** Public attribution page for the catalog photography. */
export default async function CreditsPage() {
  const copy = getDictionary(await getLocale());

  return <MediaCreditsView copy={copy.credits} />;
}
