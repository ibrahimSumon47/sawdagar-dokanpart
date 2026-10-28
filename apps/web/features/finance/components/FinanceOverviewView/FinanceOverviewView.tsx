import { Badge, ButtonLink, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { FinanceOverview } from '../../overviewQueries';
import { SellerNotice } from '../../../seller/components/SellerNotice';
import type { SellerNoticeResult } from '../../../seller/notice';
import { PayoutQueue } from '../PayoutQueue';
import { RefundQueue } from '../RefundQueue';

export interface FinanceOverviewViewProps {
  overview: FinanceOverview;
  copy: Dictionary['admin'];
  locale: Locale;
  notice: SellerNoticeResult | null;
}

/** Platform finance page: balances, payout queue, refunds and recent history. */
export function FinanceOverviewView({ overview, copy, locale, notice }: FinanceOverviewViewProps) {
  const refundStatus = (status: string) =>
    status === 'paid' ? copy.refundPaid : copy.refundPending;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <header className="max-w-2xl">
          <h1 className="font-serif text-title leading-tight text-ink">{copy.financeTitle}</h1>
          <p className="mt-2 text-ink-muted">{copy.financeDescription}</p>
        </header>
        <ButtonLink href="/admin" variant="secondary" size="sm">
          Admin
        </ButtonLink>
      </div>

      <div className="mt-6">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-sm border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">{copy.cashBalance}</p>
          <p className="mt-2 font-serif text-2xl text-ink">
            <Price amountMinor={overview.cashMinor} locale={locale} size="md" />
          </p>
        </div>
        <div className="rounded-sm border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">{copy.commissionEarned}</p>
          <p className="mt-2 font-serif text-2xl text-ink">
            <Price amountMinor={overview.commissionMinor} locale={locale} size="md" />
          </p>
        </div>
        <div className="rounded-sm border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">{copy.sellerPayable}</p>
          <p className="mt-2 font-serif text-2xl text-ink">
            <Price amountMinor={overview.sellerPayableMinor} locale={locale} size="md" />
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.payoutQueue}</h2>
        <p className="mt-1 text-sm text-ink-muted">{copy.payoutQueueDescription}</p>
        {overview.payouts.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noPayoutQueue}
          </p>
        ) : (
          <PayoutQueue payouts={overview.payouts} copy={copy} locale={locale} />
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.refundQueue}</h2>
        <p className="mt-1 text-sm text-ink-muted">{copy.refundQueueDescription}</p>
        {overview.refundable.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noRefundQueue}
          </p>
        ) : (
          <RefundQueue refundable={overview.refundable} copy={copy} locale={locale} />
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.recentRefunds}</h2>
        {overview.refunds.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noRefunds}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
            {overview.refunds.map((refund) => (
              <li
                key={refund.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{refund.orderNumber}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatDate(refund.createdAt, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={refund.status === 'paid' ? 'success' : 'warning'}>
                    {refundStatus(refund.status)}
                  </Badge>
                  <Price amountMinor={refund.amountMinor} locale={locale} size="sm" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
