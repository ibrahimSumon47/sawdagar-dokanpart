import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticleView } from '../../../features/content/components/ContentArticleView';
import { isFeatureEnabled } from '../../../features/content/flags';
import { getPublicContentEntry } from '../../../features/content/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

interface HelpArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const entry = await getPublicContentEntry('help', slug);
  if (!entry) return { title: getDictionary(locale).content.helpTitle };

  const title = locale === 'bn' ? entry.seoTitleBn : entry.seoTitleEn;
  const description = locale === 'bn' ? entry.seoDescriptionBn : entry.seoDescriptionEn;
  return {
    title: title ?? (locale === 'bn' ? entry.titleBn : entry.titleEn),
    description: description ?? undefined,
  };
}

/** One published Help Center article. */
export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  if (!(await isFeatureEnabled('help_center_enabled'))) notFound();

  const { slug } = await params;
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const entry = await getPublicContentEntry('help', slug);
  if (!entry) notFound();

  return <ContentArticleView entry={entry} kind="help" copy={copy} locale={locale} />;
}
