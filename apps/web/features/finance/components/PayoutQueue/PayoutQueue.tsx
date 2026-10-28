import { Badge, Button, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { processPayoutAction } from '../../actions';
import type { PayoutRecord } from '../../queries';

export interface PayoutQueueProps {
  payouts: readonly PayoutRecord[];
  copy: Dictionary['admin'];
  locale: Locale;
}

function tone(status: string): 'warning' | 'success' | 'danger' | 'neutral' {
  if (status === 'paid') return 'success';
  if (status === 'rejected') return 'danger';
  if (status === 'approved' || status === 'requested') return 'warning';
  return 'neutral';
}

/** Finance queue with approve, pay and reject controls per payout. */
export function PayoutQueue({ payouts, copy, locale }: PayoutQueueProps) {
  const label = (status: string) =>
    status === 'requested'
      ? copy.payoutRequestedStatus
      : status === 'approved'
        ? copy.payoutApprovedStatus
        : status === 'paid'
          ? copy.payoutPaidStatus
          : copy.payoutRejectedStatus;

  return (
    <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
      {payouts.map((payout) => (
        <li key={payout.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-ink">
              {payout.number}
              {payout.organizationName ? ` · ${payout.organizationName}` : ''}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {copy.requested} {formatDate(payout.requestedAt, locale)}
              {payout.note ? ` · ${payout.note}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={tone(payout.status)}>{label(payout.status)}</Badge>
            <Price amountMinor={payout.amountMinor} locale={locale} size="sm" />
            {payout.status === 'requested' ? (
              <>
                <form action={processPayoutAction}>
                  <input type="hidden" name="payoutId" value={payout.id} />
                  <input type="hidden" name="decision" value="approve" />
                  <Button type="submit" size="sm">
                    {copy.approve}
                  </Button>
                </form>
                <form action={processPayoutAction}>
                  <input type="hidden" name="payoutId" value={payout.id} />
                  <input type="hidden" name="decision" value="reject" />
                  <Button type="submit" variant="secondary" size="sm">
                    {copy.reject}
                  </Button>
                </form>
              </>
            ) : null}
            {payout.status === 'approved' ? (
              <>
                <form action={processPayoutAction}>
                  <input type="hidden" name="payoutId" value={payout.id} />
                  <input type="hidden" name="decision" value="pay" />
                  <Button type="submit" size="sm">
                    {copy.pay}
                  </Button>
                </form>
                <form action={processPayoutAction}>
                  <input type="hidden" name="payoutId" value={payout.id} />
                  <input type="hidden" name="decision" value="reject" />
                  <Button type="submit" variant="secondary" size="sm">
                    {copy.reject}
                  </Button>
                </form>
              </>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
