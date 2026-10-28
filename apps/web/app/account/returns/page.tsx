import type { Metadata } from 'next';
import { AccountReturnsPanel } from '../../../features/account/components/AccountReturnsPanel';
import { AccountSection } from '../../../features/account/components/AccountSection';
import { requireViewer } from '../../../features/auth/session';
import { getReturnableItems, getUserReturns } from '../../../features/returns/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.account.returnsTitle };
}

/** Seven-day return requests for delivered items, with their status. */
export default async function AccountReturnsPage() {
  const viewer = await requireViewer('/account/returns');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const [items, requests] = await Promise.all([
    getReturnableItems(viewer.id),
    getUserReturns(viewer.id),
  ]);

  return (
    <AccountSection
      active="returns"
      title={copy.account.returnsTitle}
      description={copy.account.returnsDescription}
      copy={copy.account}
    >
      <AccountReturnsPanel items={items} requests={requests} copy={copy.returns} locale={locale} />
    </AccountSection>
  );
}
