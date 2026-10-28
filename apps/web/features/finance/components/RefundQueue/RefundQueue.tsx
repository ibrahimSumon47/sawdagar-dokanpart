import { Button, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { FinanceOverview } from '../../overviewQueries';
import { refundReturnAction } from '../../refundActions';

export interface RefundQueueProps {
  refundable: FinanceOverview['refundable'];
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Approved returns waiting for the finance team to issue the refund. */
export function RefundQueue({ refundable, copy, locale }: RefundQueueProps) {
  return (
    <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
      {refundable.map((request) => (
        <li
          key={request.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
        >
          <div>
            <p className="text-sm font-medium text-ink">
              {locale === 'bn' ? request.productTitleBn : request.productTitleEn}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {request.orderNumber} · {copy.buyer} {request.buyerName} ·{' '}
              {formatDate(request.approvedAt, locale)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Price amountMinor={request.amountMinor} locale={locale} size="sm" />
            <form action={refundReturnAction}>
              <input type="hidden" name="returnRequestId" value={request.id} />
              <Button type="submit" size="sm">
                {copy.issueRefund}
              </Button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
