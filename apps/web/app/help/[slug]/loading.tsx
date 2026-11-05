import { ContentArticleSkeleton } from '../../../features/content/components/ContentArticleView';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/** Matches one article: banner, title, metadata and body text. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return <ContentArticleSkeleton label={copy.common.loadingLabel} />;
}
