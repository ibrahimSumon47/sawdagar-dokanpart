import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticleView } from '../../../features/content/components/ContentArticleView';
import { getPublicPage } from '../../../features/content/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

interface StaticContentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StaticContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const entry = await getPublicPage(slug);
  if (!entry) return { title: getDictionary(locale).meta.title };

  const title = locale === 'bn' ? entry.seoTitleBn : entry.seoTitleEn;
  const description = locale === 'bn' ? entry.seoDescriptionBn : entry.seoDescriptionEn;
  return {
    title: title ?? (locale === 'bn' ? entry.titleBn : entry.titleEn),
    description: description ?? undefined,
  };
}

/** One published static page managed in the CMS. */
export default async function StaticContentPage({ params }: StaticContentPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const entry = await getPublicPage(slug);
  if (!entry) notFound();

  return <ContentArticleView entry={entry} kind="page" copy={copy} locale={locale} />;
}
