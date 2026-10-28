import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIndexView } from '../../features/content/components/ContentIndexView';
import { isFeatureEnabled } from '../../features/content/flags';
import { getPublicContentList } from '../../features/content/queries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.content.journalTitle, description: copy.content.journalDescription };
}

/** Published Journal posts, newest first. */
export default async function JournalPage() {
  if (!(await isFeatureEnabled('journal_enabled'))) notFound();

  const locale = await getLocale();
  const copy = getDictionary(locale);
  const entries = await getPublicContentList('journal');

  return <ContentIndexView kind="journal" entries={entries} copy={copy} locale={locale} />;
}
