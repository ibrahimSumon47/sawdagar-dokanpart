import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { PlatformAnalytics as PlatformAnalyticsData } from '../../analyticsQueries';
import { StatTile } from '../StatTile';

export interface PlatformAnalyticsProps {
  analytics: PlatformAnalyticsData;
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Marketplace-wide totals from orders, the ledger and the work queues. */
export function PlatformAnalytics({ analytics, copy, locale }: PlatformAnalyticsProps) {
  const number = (value: number) =>
    new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB').format(value);
  const money = (minor: number) => <Price amountMinor={minor} locale={locale} size="md" />;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-ink-muted">{copy.gmvMetric}</p>
          <p className="mt-1">{money(analytics.gmvMinor)}</p>
        </div>
        <div className="rounded-sm border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-ink-muted">{copy.deliveredMetric}</p>
          <p className="mt-1">{money(analytics.deliveredMinor)}</p>
        </div>
        <div className="rounded-sm border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            {copy.commissionMetric}
          </p>
          <p className="mt-1">{money(analytics.commissionMinor)}</p>
        </div>
        <div className="rounded-sm border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-ink-muted">{copy.refundedMetric}</p>
          <p className="mt-1">{money(analytics.refundedMinor)}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={copy.ordersMetric} value={number(analytics.orderCount)} />
        <StatTile label={copy.activeVendorsMetric} value={number(analytics.activeVendors)} />
        <StatTile label={copy.pendingVendorsMetric} value={number(analytics.pendingVendors)} />
        <StatTile label={copy.buyersMetric} value={number(analytics.buyerCount)} />
        <StatTile label={copy.activeProductsMetric} value={number(analytics.activeProducts)} />
        <StatTile label={copy.reviewsMetric} value={number(analytics.publishedReviews)} />
        <StatTile label={copy.openReturnsMetric} value={number(analytics.openReturns)} />
      </div>
    </div>
  );
}
