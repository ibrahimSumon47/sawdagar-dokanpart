import { ContentIndexSkeleton } from '../../features/content/components/ContentIndexView';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the article index: heading, lead paragraph and the card grid. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return <ContentIndexSkeleton label={copy.common.loadingLabel} />;
}
