import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { pageLayout } from '../../../shell/pageLayout';
import type { OrderRecord } from '../../../checkout/queries';
import { LiveStatus, type LiveStatusProps } from '../LiveStatus';
import { SellerPackage } from '../SellerPackage';

export interface OrderTrackingProps {
  order: OrderRecord;
  copy: Dictionary['checkout'];
  locale: Locale;
  /** The reference the live status follows, so the view updates without a reload. */
  live: LiveStatusProps['query'];
}

/**
 * Shared tracking view for the guest and signed-in routes. It lists one
 * timeline per seller package, so a buyer can see each seller's progress.
 */
export function OrderTracking({ order, copy, locale, live }: OrderTrackingProps) {
  return (
    <div className={pageLayout.wide}>
      <header className="border-b border-line pb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{copy.timelineTitle}</p>
        <h1 className="mt-1 font-serif text-title leading-tight text-ink">{order.number}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {copy.placedOn} {formatDate(order.placedAt, locale)}
        </p>
        <div className="mt-3">
          <LiveStatus query={live} copy={copy} />
        </div>
      </header>

      <div className="mt-8 space-y-5">
        {order.subOrders.map((subOrder) => (
          <SellerPackage
            key={subOrder.id}
            subOrder={subOrder}
            orderPlacedAt={order.placedAt}
            copy={copy}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
