import type { Metadata } from 'next';
import { AccountOrdersList } from '../../../features/account/components/AccountOrdersList';
import { AccountSection } from '../../../features/account/components/AccountSection';
import { requireViewer } from '../../../features/auth/session';
import { getOrdersForUser } from '../../../features/reviews/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.account.ordersTitle };
}

/** Order history for the signed-in buyer. */
export default async function AccountOrdersPage() {
  const viewer = await requireViewer('/account/orders');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const orders = await getOrdersForUser(viewer.id);

  return (
    <AccountSection
      active="orders"
      title={copy.account.ordersTitle}
      description={copy.account.ordersDescription}
      copy={copy.account}
    >
      <AccountOrdersList
        orders={orders}
        copy={copy.account}
        checkoutCopy={copy.checkout}
        locale={locale}
      />
    </AccountSection>
  );
}
