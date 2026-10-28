import type { Metadata } from 'next';
import { getSellerFinance } from '../../../features/finance/queries';
import { SellerFinanceView } from '../../../features/finance/components/SellerFinanceView';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { sellerNotice } from '../../../features/seller/notice';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.financeTitle };
}

interface SellerFinancePageProps {
  searchParams: Promise<{ requested?: string; error?: string }>;
}

/** Seller balance, payout requests, payout history and the delivered statement. */
export default async function SellerFinancePage({ searchParams }: SellerFinancePageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/finance');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const finance = await getSellerFinance(access.organizationId);
  const notice = sellerNotice(copy.seller, params);

  return (
    <SellerFinanceView
      finance={finance}
      copy={copy.seller}
      locale={locale}
      canManage={access.canManage}
      notice={notice}
    />
  );
}
