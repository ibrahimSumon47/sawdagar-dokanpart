import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ContentArticleView } from '../../../features/content/components/ContentArticleView';
import { HelpfulVote } from '../../../features/content/components/HelpfulVote';
import { isFeatureEnabled } from '../../../features/content/flags';
import {
  HELP_VISITOR_COOKIE,
  getHelpVoteSummary,
  isHelpVisitorId,
} from '../../../features/content/helpVotes';
import { getPublicContentEntry } from '../../../features/content/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';
import { publicPageMetadata } from '../../../lib/meta';

interface HelpArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const path = `/help/${slug}`;
  const entry = await getPublicContentEntry('help', slug);
  if (!entry) return publicPageMetadata({ title: getDictionary(locale).content.helpTitle, path });

  const title = locale === 'bn' ? entry.seoTitleBn : entry.seoTitleEn;
  const description = locale === 'bn' ? entry.seoDescriptionBn : entry.seoDescriptionEn;
  return publicPageMetadata({
    title: title ?? (locale === 'bn' ? entry.titleBn : entry.titleEn),
    description,
    path,
  });
}

/** One published Help Center article. */
export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  if (!(await isFeatureEnabled('help_center_enabled'))) notFound();

  const { slug } = await params;
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const entry = await getPublicContentEntry('help', slug);
  if (!entry) notFound();

  const storedVisitor = (await cookies()).get(HELP_VISITOR_COOKIE)?.value;
  const visitorId = isHelpVisitorId(storedVisitor) ? storedVisitor : null;
  const summary = await getHelpVoteSummary(entry.id, visitorId);

  return (
    <ContentArticleView entry={entry} kind="help" copy={copy} locale={locale}>
      <HelpfulVote entryId={entry.id} slug={entry.slug} summary={summary} copy={copy.content} />
    </ContentArticleView>
  );
}
