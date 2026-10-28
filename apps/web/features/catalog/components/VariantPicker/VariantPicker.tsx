'use client';

import { Badge, Price } from '@sd/ui';
import { useState } from 'react';
import type { Dictionary, Locale } from '../../../../i18n';
import type { ProductDetail } from '../../queries';

export interface VariantPickerProps {
  variants: ProductDetail['variants'];
  locale: Locale;
  copy: Dictionary['catalog'];
}

/** Variant radios with the selected SKU, price, compare-at price and stock. */
export function VariantPicker({ variants, locale, copy }: VariantPickerProps) {
  const [selectedId, setSelectedId] = useState(
    variants.find((variant) => variant.isDefault)?.id ?? variants[0]?.id,
  );
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0];

  if (!selected) return null;

  const stockTone = selected.stock === 0 ? 'danger' : selected.stock <= 5 ? 'warning' : 'success';
  const stockLabel =
    selected.stock === 0 ? copy.stockOut : selected.stock <= 5 ? copy.stockLow : copy.stockIn;

  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-semibold text-ink">{copy.chooseVariant}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {variants.map((variant) => (
          <label
            key={variant.id}
            className={`flex cursor-pointer flex-col gap-1 rounded-sm border p-3 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${
              variant.id === selected.id
                ? 'border-accent bg-accent/5 text-ink'
                : 'border-line bg-surface text-ink-muted hover:border-accent'
            }`}
          >
            <input
              type="radio"
              name="variant"
              value={variant.id}
              checked={variant.id === selected.id}
              onChange={() => setSelectedId(variant.id)}
              className="sr-only"
            />
            <span className="font-medium">{variant.name[locale]}</span>
            <Price
              amountMinor={variant.priceMinor}
              compareAtMinor={variant.compareAtMinor}
              locale={locale}
              size="sm"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Price
          amountMinor={selected.priceMinor}
          compareAtMinor={selected.compareAtMinor}
          locale={locale}
          size="lg"
        />
        <Badge tone={stockTone}>{stockLabel}</Badge>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {copy.sku}: {selected.sku}
      </p>
      <p className="mt-4 rounded-sm border border-dashed border-line bg-surface px-3 py-2 text-sm text-ink-muted">
        {copy.cartNote}
      </p>
    </fieldset>
  );
}
