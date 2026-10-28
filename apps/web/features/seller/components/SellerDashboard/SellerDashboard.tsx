import { Badge, ButtonLink, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { subOrderStatusLabel, statusTone } from '../../../checkout/labels';
import type { SellerDashboard as DashboardData, SellerStoreRecord } from '../../queries';
import { SellerSection } from '../SellerSection';
import { SellerStat } from '../SellerStat';

export interface SellerDashboardProps {
  store: SellerStoreRecord;
  dashboard: DashboardData;
  copy: Dictionary['seller'];
  checkoutCopy: Dictionary['checkout'];
  locale: Locale;
}

const kycNoticeKey = {
  not_started: 'kycNoticeNotStarted',
  pending: 'kycNoticePending',
  approved: 'kycNoticeApproved',
  rejected: 'kycNoticeRejected',
} as const;

/** Seller home: store status, sales totals and the newest sub-orders. */
export function SellerDashboard({
  store,
  dashboard,
  copy,
  checkoutCopy,
  locale,
}: SellerDashboardProps) {
  const notice =
    copy[kycNoticeKey[store.kycStatus as keyof typeof kycNoticeKey] ?? 'kycNoticeNotStarted'];

  return (
    <SellerSection active="dashboard" title={copy.title} description={copy.description} copy={copy}>
      <section className="rounded-sm border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-ink">{store.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">/store/{store.slug}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={store.status === 'approved' ? 'success' : 'warning'}>
              {
                copy[
                  store.status === 'approved'
                    ? 'statusApproved'
                    : store.status === 'rejected'
                      ? 'statusRejected'
                      : store.status === 'suspended'
                        ? 'statusSuspended'
                        : 'statusPending'
                ]
              }
            </Badge>
            <ButtonLink href={`/store/${store.slug}`} variant="secondary" size="sm">
              {copy.viewStore}
            </ButtonLink>
          </div>
        </div>
        <p className="mt-3 text-sm text-ink-muted">{notice}</p>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SellerStat
          label={copy.revenueDelivered}
          value={<Price amountMinor={dashboard.deliveredMinor} locale={locale} size="md" />}
        />
        <SellerStat
          label={copy.revenuePipeline}
          value={<Price amountMinor={dashboard.pipelineMinor} locale={locale} size="md" />}
        />
        <SellerStat label={copy.ordersToPack} value={String(dashboard.ordersToPack)} />
        <SellerStat label={copy.openQuestions} value={String(dashboard.openQuestions)} />
        <SellerStat label={copy.openReturns} value={String(dashboard.openReturns)} />
        <SellerStat label={copy.lowStock} value={String(dashboard.lowStock)} />
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-ink">{copy.recentOrders}</h2>
          <ButtonLink href="/seller/orders" variant="secondary" size="sm">
            {copy.viewAll}
          </ButtonLink>
        </div>
        {dashboard.recentOrders.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noOrders}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
            {dashboard.recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{order.number}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {order.buyerName} · {copy.items} {order.itemCount} ·{' '}
                    {formatDate(order.createdAt, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone(order.status)}>
                    {subOrderStatusLabel(checkoutCopy, order.status)}
                  </Badge>
                  <Price amountMinor={order.totalMinor} locale={locale} size="sm" />
                  <ButtonLink href={`/seller/orders/${order.id}`} variant="secondary" size="sm">
                    {copy.openOrder}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SellerSection>
  );
}
