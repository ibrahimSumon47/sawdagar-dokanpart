import { Badge } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { buildTimeline } from '../../timeline';
import { subOrderStatusLabel, statusTone } from '../../../checkout/labels';
import type { SubOrderRecord } from '../../../checkout/queries';
import { TrackingTimeline } from '../TrackingTimeline';

export interface SellerPackageProps {
  subOrder: SubOrderRecord;
  /** When the parent order was placed; a package's first step is the order date. */
  orderPlacedAt: Date;
  copy: Dictionary['checkout'];
  locale: Locale;
}

/**
 * One seller's package inside an order: its status timeline, courier and
 * tracking number, and the items it carries. Used on both tracking routes.
 */
export function SellerPackage({ subOrder, orderPlacedAt, copy, locale }: SellerPackageProps) {
  const { steps, terminal } = buildTimeline({
    status: subOrder.status,
    placedAt: orderPlacedAt,
    confirmedAt: subOrder.confirmedAt,
    packedAt: subOrder.packedAt,
    shippedAt: subOrder.shippedAt,
    deliveredAt: subOrder.deliveredAt,
    cancelledAt: subOrder.cancelledAt,
  });
  const itemCount = subOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="rounded-sm border border-line bg-surface p-5" aria-labelledby={subOrder.id}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={subOrder.id} className="font-serif text-lg text-ink">
            {copy.timelineSellerPackage.replace('{seller}', subOrder.vendorName)}
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            {subOrder.number} · {copy.timelineItems.replace('{count}', String(itemCount))}
          </p>
        </div>
        <Badge tone={statusTone(subOrder.status)}>
          {subOrderStatusLabel(copy, subOrder.status)}
        </Badge>
      </header>

      <div className="mt-5 grid gap-6 md:grid-cols-[1fr_1fr]">
        <TrackingTimeline steps={steps} terminal={terminal} copy={copy} locale={locale} />

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">{copy.timelineCourier}</dt>
            <dd className="font-medium text-ink">{subOrder.courier ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">{copy.timelineTrackingNote}</dt>
            <dd className="font-mono text-ink">
              {subOrder.trackingNumber ?? copy.timelineNoUpdates}
            </dd>
          </div>
          <ul className="space-y-1 pt-2 text-ink-muted">
            {subOrder.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {locale === 'bn' ? item.titleBn : item.titleEn} × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </dl>
      </div>
    </section>
  );
}
