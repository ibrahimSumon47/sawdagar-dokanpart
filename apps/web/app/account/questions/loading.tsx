import { AccountSectionSkeleton } from '../../../features/account/components/AccountSection';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/** Matches the shared account sub-page frame while its data loads. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return <AccountSectionSkeleton label={copy.common.loadingLabel} />;
}
