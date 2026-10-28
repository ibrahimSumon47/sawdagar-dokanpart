import { Badge, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { PayoutRecord } from '../../queries';

export interface PayoutHistoryListProps {
  payouts: readonly PayoutRecord[];
  copy: Dictionary['seller'];
  locale: Locale;
}

function tone(status: string): 'warning' | 'success' | 'danger' {
  if (status === 'paid') return 'success';
  if (status === 'rejected') return 'danger';
  return 'warning';
}

/** A store's withdrawal requests with their current state. */
export function PayoutHistoryList({ payouts, copy, locale }: PayoutHistoryListProps) {
  const label = (status: string) =>
    status === 'requested'
      ? copy.payoutStatusRequested
      : status === 'approved'
        ? copy.payoutStatusApproved
        : status === 'paid'
          ? copy.payoutStatusPaid
          : copy.payoutStatusRejected;

  return (
    <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
      {payouts.map((payout) => (
        <li key={payout.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">{payout.number}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {formatDate(payout.requestedAt, locale)}
              {payout.note ? ` · ${payout.note}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={tone(payout.status)}>{label(payout.status)}</Badge>
            <Price amountMinor={payout.amountMinor} locale={locale} size="sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}
