import { Badge, Price } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ReturnRequestRecord, ReturnableItem } from '../../../returns/queries';
import { ReturnForm } from '../../../returns/components/ReturnForm';

export interface AccountReturnsPanelProps {
  items: ReturnableItem[];
  requests: ReturnRequestRecord[];
  copy: Dictionary['returns'];
  locale: Locale;
}

function returnStatusLabel(copy: Dictionary['returns'], status: string): string {
  switch (status) {
    case 'approved':
      return copy.statusApproved;
    case 'rejected':
      return copy.statusRejected;
    case 'refunded':
      return copy.statusRefunded;
    default:
      return copy.statusRequested;
  }
}

/** Returnable delivered lines, then the requests the buyer already opened. */
export function AccountReturnsPanel({ items, requests, copy, locale }: AccountReturnsPanelProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-xl text-ink">{copy.request}</h2>
        {items.length === 0 ? (
          <p className="mt-2 rounded-sm border border-dashed border-line bg-surface px-4 py-5 text-sm text-ink-muted">
            {copy.noItems}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
            {items.map((item) => (
              <li key={item.orderItemId} className="px-4 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {locale === 'bn' ? item.productTitleBn : item.productTitleEn}
                  </Link>
                  <Price amountMinor={item.lineTotalMinor} locale={locale} size="sm" />
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {item.vendorName} · {item.orderNumber} · {copy.deliveredOn}{' '}
                  {formatDate(item.deliveredAt, locale)}
                </p>
                <ReturnForm orderItemId={item.orderItemId} copy={copy} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">{copy.myRequests}</h2>
        {requests.length === 0 ? (
          <p className="mt-2 rounded-sm border border-dashed border-line bg-surface px-4 py-5 text-sm text-ink-muted">
            {copy.noRequests}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
            {requests.map((request) => (
              <li key={request.id} className="px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/product/${request.productSlug}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {locale === 'bn' ? request.productTitleBn : request.productTitleEn}
                  </Link>
                  <Badge
                    tone={
                      request.status === 'refunded'
                        ? 'success'
                        : request.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {returnStatusLabel(copy, request.status)}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {request.orderNumber} ·{' '}
                  {copy.reasons[request.reason as keyof typeof copy.reasons] ?? request.reason} ·{' '}
                  {formatDate(request.createdAt, locale)}
                </p>
                {request.note ? (
                  <p className="mt-1 text-sm text-ink-muted">{request.note}</p>
                ) : null}
                {request.resolutionNote ? (
                  <p className="mt-1 text-sm text-ink">
                    {copy.resolution}: {request.resolutionNote}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
