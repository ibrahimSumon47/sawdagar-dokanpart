import { Badge, Button } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { resolveReturnAction } from '../../orderActions';
import type { SellerReturnRecord } from '../../queries';

export interface SellerReturnListProps {
  returns: readonly SellerReturnRecord[];
  copy: Dictionary['seller'];
  /** Buyer-facing return copy, used to translate the stored reason code. */
  returnsCopy: Dictionary['returns'];
  locale: Locale;
}

function statusTone(status: string): 'warning' | 'success' | 'danger' {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'danger';
  return 'warning';
}

/** Return requests with approve and reject controls while they are open. */
export function SellerReturnList({ returns, copy, returnsCopy, locale }: SellerReturnListProps) {
  const label = (status: string) =>
    status === 'approved'
      ? copy.returnApproved
      : status === 'rejected'
        ? copy.returnRejected
        : copy.returnRequested;

  return (
    <ul className="space-y-4">
      {returns.map((request) => (
        <li key={request.id} className="rounded-sm border border-line bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink">
                {locale === 'bn' ? request.productTitleBn : request.productTitleEn} ×{' '}
                {request.quantity}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {request.orderNumber} · {request.buyerName} ·{' '}
                {formatDate(request.createdAt, locale)}
              </p>
            </div>
            <Badge tone={statusTone(request.status)}>{label(request.status)}</Badge>
          </div>

          <p className="mt-3 text-sm text-ink">
            {returnsCopy.reasons[request.reason as keyof typeof returnsCopy.reasons] ??
              request.reason}
          </p>
          {request.note ? <p className="mt-1 text-sm text-ink-muted">{request.note}</p> : null}

          {request.status === 'requested' ? (
            <form action={resolveReturnAction} className="mt-4 space-y-3 border-t border-line pt-4">
              <input type="hidden" name="returnRequestId" value={request.id} />
              <div>
                <label
                  htmlFor={`resolution-${request.id}`}
                  className="text-xs font-semibold text-ink"
                >
                  {copy.resolutionNote}
                </label>
                <input
                  id={`resolution-${request.id}`}
                  name="note"
                  maxLength={300}
                  className="mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" name="decision" value="approved" size="sm">
                  {copy.approve}
                </Button>
                <Button
                  type="submit"
                  name="decision"
                  value="rejected"
                  variant="secondary"
                  size="sm"
                  className="border-danger/40 text-danger"
                >
                  {copy.reject}
                </Button>
              </div>
            </form>
          ) : request.resolutionNote ? (
            <p className="mt-3 text-sm text-ink-muted">
              {copy.resolutionNote}: {request.resolutionNote}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
