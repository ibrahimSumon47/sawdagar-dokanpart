import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HelpCenterView } from '../../features/content/components/HelpCenterView';
import { isFeatureEnabled } from '../../features/content/flags';
import {
  countPublicHelpArticles,
  getPublicHelpArticles,
  getPublicHelpCategories,
} from '../../features/content/helpCategoryQueries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';
import { publicPageMetadata } from '../../lib/meta';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return publicPageMetadata({
    title: copy.content.helpTitle,
    description: copy.content.helpDescription,
    path: '/help',
  });
}

interface HelpPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

/** Help Center articles with a category filter and a search box. */
export default async function HelpPage({ searchParams }: HelpPageProps) {
  if (!(await isFeatureEnabled('help_center_enabled'))) notFound();

  const params = await searchParams;
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const query = typeof params.q === 'string' ? params.q.slice(0, 80) : '';
  const categorySlug = typeof params.category === 'string' ? params.category : '';

  const [categories, totalCount] = await Promise.all([
    getPublicHelpCategories(),
    countPublicHelpArticles(),
  ]);
  const activeCategory = categories.find((category) => category.slug === categorySlug) ?? null;
  const articles = await getPublicHelpArticles({ categorySlug, query });

  return (
    <HelpCenterView
      articles={articles}
      categories={categories}
      activeCategory={activeCategory}
      query={query}
      totalCount={totalCount}
      copy={copy}
      locale={locale}
    />
  );
}
