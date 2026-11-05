import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIndexView } from '../../features/content/components/ContentIndexView';
import { isFeatureEnabled } from '../../features/content/flags';
import { tagFilterSchema } from '../../features/content/inputs';
import { getPublicContentList, getPublicContentTags } from '../../features/content/queries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.content.journalTitle, description: copy.content.journalDescription };
}

interface JournalPageProps {
  searchParams: Promise<{ tag?: string | string[] }>;
}

/** Published Journal posts, newest first, optionally narrowed to one tag. */
export default async function JournalPage({ searchParams }: JournalPageProps) {
  if (!(await isFeatureEnabled('journal_enabled'))) notFound();

  const { tag } = await searchParams;
  const parsedTag = tagFilterSchema.safeParse(Array.isArray(tag) ? tag[0] : tag);
  const activeTag = parsedTag.success ? parsedTag.data : null;

  const locale = await getLocale();
  const copy = getDictionary(locale);
  const [entries, tags] = await Promise.all([
    getPublicContentList('journal', activeTag ? { tag: activeTag } : {}),
    getPublicContentTags('journal'),
  ]);

  return (
    <ContentIndexView
      kind="journal"
      entries={entries}
      copy={copy}
      locale={locale}
      tags={tags}
      activeTag={activeTag}
    />
  );
}
