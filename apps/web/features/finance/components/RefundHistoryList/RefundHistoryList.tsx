import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { RefundRecord } from '../../queries';

export interface RefundHistoryListProps {
  refunds: readonly RefundRecord[];
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Refunds issued against a store's delivered sales, newest first. */
export function RefundHistoryList({ refunds, copy, locale }: RefundHistoryListProps) {
  return (
    <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
      {refunds.map((refund) => (
        <li key={refund.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">{refund.orderNumber}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {formatDate(refund.createdAt, locale)} · {copy.commission}{' '}
              <Price amountMinor={refund.commissionMinor} locale={locale} size="sm" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted">{copy.refundedToBuyer}</span>
            <Price amountMinor={refund.amountMinor} locale={locale} size="sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}
