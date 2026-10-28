import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIndexView } from '../../features/content/components/ContentIndexView';
import { isFeatureEnabled } from '../../features/content/flags';
import { getPublicContentList } from '../../features/content/queries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.content.helpTitle, description: copy.content.helpDescription };
}

/** Published Help Center articles, newest first. */
export default async function HelpPage() {
  if (!(await isFeatureEnabled('help_center_enabled'))) notFound();

  const locale = await getLocale();
  const copy = getDictionary(locale);
  const entries = await getPublicContentList('help');

  return <ContentIndexView kind="help" entries={entries} copy={copy} locale={locale} />;
}
