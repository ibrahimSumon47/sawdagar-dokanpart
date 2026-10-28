import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticleView } from '../../../features/content/components/ContentArticleView';
import { isFeatureEnabled } from '../../../features/content/flags';
import { getPublicContentEntry } from '../../../features/content/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

interface JournalPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const entry = await getPublicContentEntry('journal', slug);
  if (!entry) return { title: getDictionary(locale).content.journalTitle };

  const title = locale === 'bn' ? entry.seoTitleBn : entry.seoTitleEn;
  const description = locale === 'bn' ? entry.seoDescriptionBn : entry.seoDescriptionEn;
  return {
    title: title ?? (locale === 'bn' ? entry.titleBn : entry.titleEn),
    description: description ?? undefined,
  };
}

/** One published Journal post. */
export default async function JournalPostPage({ params }: JournalPostPageProps) {
  if (!(await isFeatureEnabled('journal_enabled'))) notFound();

  const { slug } = await params;
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const entry = await getPublicContentEntry('journal', slug);
  if (!entry) notFound();

  return <ContentArticleView entry={entry} kind="journal" copy={copy} locale={locale} />;
}
