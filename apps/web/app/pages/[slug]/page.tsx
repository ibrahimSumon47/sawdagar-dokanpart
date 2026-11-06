import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentArticleView } from '../../../features/content/components/ContentArticleView';
import { getPublicPage } from '../../../features/content/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';
import { publicPageMetadata } from '../../../lib/meta';

interface StaticContentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StaticContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const path = `/pages/${slug}`;
  const entry = await getPublicPage(slug);
  if (!entry) return publicPageMetadata({ title: getDictionary(locale).meta.title, path });

  const title = locale === 'bn' ? entry.seoTitleBn : entry.seoTitleEn;
  const description = locale === 'bn' ? entry.seoDescriptionBn : entry.seoDescriptionEn;
  return publicPageMetadata({
    title: title ?? (locale === 'bn' ? entry.titleBn : entry.titleEn),
    description,
    path,
  });
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
