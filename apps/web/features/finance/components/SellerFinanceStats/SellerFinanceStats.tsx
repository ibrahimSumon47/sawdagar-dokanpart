import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { SellerFinance } from '../../queries';
import { SellerStat } from '../../../seller/components/SellerStat';

export interface SellerFinanceStatsProps {
  finance: SellerFinance;
  copy: Dictionary['seller'];
  locale: Locale;
}

/** The four balance tiles at the top of the seller finance page. */
export function SellerFinanceStats({ finance, copy, locale }: SellerFinanceStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SellerStat
        label={copy.availableBalance}
        value={<Price amountMinor={finance.availableMinor} locale={locale} size="md" />}
      />
      <SellerStat
        label={copy.pendingPayouts}
        value={<Price amountMinor={finance.outstandingMinor} locale={locale} size="md" />}
      />
      <SellerStat
        label={copy.paidOut}
        value={<Price amountMinor={finance.paidOutMinor} locale={locale} size="md" />}
      />
      <SellerStat
        label={copy.commissionRate}
        value={`${(finance.commissionRateBps / 100).toFixed(1)}%`}
      />
    </div>
  );
}
