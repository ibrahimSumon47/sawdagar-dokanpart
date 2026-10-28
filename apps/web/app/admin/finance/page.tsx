import { hasPermission } from '@sd/domain';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireArea } from '../../../features/auth/session';
import { FinanceOverviewView } from '../../../features/finance/components/FinanceOverviewView';
import { financeNotice } from '../../../features/finance/notice';
import { getFinanceOverview } from '../../../features/finance/overviewQueries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.financeTitle, description: copy.admin.financeDescription };
}

interface FinancePageProps {
  searchParams: Promise<{ saved?: string; refunded?: string; error?: string }>;
}

/** Platform finance queue: ledger balances, payouts and approved refunds. */
export default async function AdminFinancePage({ searchParams }: FinancePageProps) {
  const params = await searchParams;
  const { role } = await requireArea('admin', '/admin/finance');
  if (!hasPermission(role, 'admin:finance:read')) redirect('/forbidden');

  const locale = await getLocale();
  const copy = getDictionary(locale);
  const overview = await getFinanceOverview();
  const notice = financeNotice(copy.admin, params);

  return (
    <FinanceOverviewView overview={overview} copy={copy.admin} locale={locale} notice={notice} />
  );
}
