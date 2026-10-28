import { Badge, Button } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { subOrderStatusLabel, statusTone } from '../../../checkout/labels';
import { advanceSubOrderAction } from '../../orderActions';
import type { SellerOrderDetail } from '../../queries';

export interface SellerFulfillmentPanelProps {
  order: SellerOrderDetail;
  copy: Dictionary['seller'];
  checkoutCopy: Dictionary['checkout'];
  locale: Locale;
}

const fieldClass =
  'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Current status, timestamps and the next allowed fulfillment action. */
export function SellerFulfillmentPanel({
  order,
  copy,
  checkoutCopy,
  locale,
}: SellerFulfillmentPanelProps) {
  const events = [
    { label: copy.confirmOrder, at: order.confirmedAt },
    { label: copy.markPacked, at: order.packedAt },
    { label: copy.markShipped, at: order.shippedAt },
    { label: copy.markDelivered, at: order.deliveredAt },
  ].filter((event) => event.at !== null);

  return (
    <section className="rounded-sm border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl text-ink">{copy.fulfillmentTitle}</h2>
        <Badge tone={statusTone(order.status)}>
          {subOrderStatusLabel(checkoutCopy, order.status)}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-ink-muted">{copy.fulfillmentDescription}</p>

      {events.length > 0 ? (
        <ol className="mt-4 space-y-1 text-sm text-ink-muted">
          {events.map((event) => (
            <li key={event.label}>
              {event.at ? `${event.label} · ${formatDate(event.at, locale)}` : null}
            </li>
          ))}
        </ol>
      ) : null}

      {order.courier ? (
        <p className="mt-3 text-sm text-ink-muted">
          {copy.courier}: {order.courier} · {copy.trackingNumber}: {order.trackingNumber}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {order.status === 'pending' ? (
          <form action={advanceSubOrderAction}>
            <input type="hidden" name="subOrderId" value={order.id} />
            <input type="hidden" name="status" value="confirmed" />
            <Button type="submit" size="sm">
              {copy.confirmOrder}
            </Button>
          </form>
        ) : null}

        {order.status === 'confirmed' ? (
          <form action={advanceSubOrderAction}>
            <input type="hidden" name="subOrderId" value={order.id} />
            <input type="hidden" name="status" value="packed" />
            <Button type="submit" size="sm">
              {copy.markPacked}
            </Button>
          </form>
        ) : null}

        {order.status === 'shipped' ? (
          <form action={advanceSubOrderAction}>
            <input type="hidden" name="subOrderId" value={order.id} />
            <input type="hidden" name="status" value="delivered" />
            <Button type="submit" size="sm">
              {copy.markDelivered}
            </Button>
          </form>
        ) : null}
      </div>

      {order.status === 'packed' ? (
        <form action={advanceSubOrderAction} className="mt-5 space-y-3 border-t border-line pt-5">
          <input type="hidden" name="subOrderId" value={order.id} />
          <input type="hidden" name="status" value="shipped" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="courier" className="text-xs font-semibold text-ink">
                {copy.courier}
              </label>
              <input id="courier" name="courier" required minLength={2} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="trackingNumber" className="text-xs font-semibold text-ink">
                {copy.trackingNumber}
              </label>
              <input
                id="trackingNumber"
                name="trackingNumber"
                required
                minLength={4}
                aria-describedby="tracking-hint"
                className={fieldClass}
              />
              <p id="tracking-hint" className="mt-1 text-xs text-ink-muted">
                {copy.trackingHint}
              </p>
            </div>
          </div>
          <Button type="submit" size="sm">
            {copy.markShipped}
          </Button>
        </form>
      ) : null}

      {order.status === 'pending' || order.status === 'confirmed' || order.status === 'packed' ? (
        <form action={advanceSubOrderAction} className="mt-5 border-t border-line pt-5">
          <input type="hidden" name="subOrderId" value={order.id} />
          <input type="hidden" name="status" value="cancelled" />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="border-danger/40 text-danger"
          >
            {copy.cancelOrder}
          </Button>
          <p className="mt-1 text-xs text-ink-muted">{copy.cancelHint}</p>
        </form>
      ) : null}
    </section>
  );
}
