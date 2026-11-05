import { AccountPanelSkeleton } from '../../features/account/components/AccountPanel';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the account overview: heading, tabs, identity card and the profile form. */
export default async function AccountLoading() {
  const copy = getDictionary(await getLocale());

  return <AccountPanelSkeleton label={copy.common.loadingLabel} />;
}
