import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { SellerAnalytics } from '../../queries';
import { SellerSection } from '../SellerSection';
import { SellerStat } from '../SellerStat';

export interface SellerAnalyticsViewProps {
  analytics: SellerAnalytics;
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Ninety-day totals, best-selling products and low-stock variants. */
export function SellerAnalyticsView({ analytics, copy, locale }: SellerAnalyticsViewProps) {
  return (
    <SellerSection
      active="analytics"
      title={copy.analyticsTitle}
      description={copy.analyticsDescription}
      copy={copy}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SellerStat
          label={copy.revenueDelivered}
          value={<Price amountMinor={analytics.sales.deliveredMinor} locale={locale} size="md" />}
          hint={copy.last90Days}
        />
        <SellerStat
          label={copy.revenuePipeline}
          value={<Price amountMinor={analytics.sales.pipelineMinor} locale={locale} size="md" />}
          hint={copy.last90Days}
        />
        <SellerStat label={copy.tabOrders} value={String(analytics.sales.orders)} />
        <SellerStat label={copy.unitsSold} value={String(analytics.sales.units)} />
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.topProducts}</h2>
        {analytics.topProducts.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noSales}
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-sm border border-line bg-surface">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
                  <th scope="col" className="px-4 py-3 font-medium">
                    {copy.productName}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    {copy.unitsSold}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    {copy.revenueDelivered}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {analytics.topProducts.map((product) => (
                  <tr key={product.titleEn}>
                    <td className="px-4 py-3 text-ink">
                      {locale === 'bn' ? product.titleBn : product.titleEn}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                      {product.units}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Price amountMinor={product.revenueMinor} locale={locale} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.lowStockTitle}</h2>
        {analytics.lowStock.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noLowStock}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
            {analytics.lowStock.map((variant) => (
              <li
                key={variant.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="text-ink">
                  {locale === 'bn' ? variant.nameBn : variant.nameEn}
                </span>
                <span className="font-mono text-xs text-ink-muted">{variant.sku}</span>
                <span className="text-ink-muted">
                  {copy.stock}: {variant.stock}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SellerSection>
  );
}
