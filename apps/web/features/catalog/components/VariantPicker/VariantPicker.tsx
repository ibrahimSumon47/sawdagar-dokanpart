import { Price } from '@sd/ui';
import type { Locale } from '../../../../i18n';
import type { ProductDetail } from '../../queries';

export interface VariantPickerProps {
  variants: ProductDetail['variants'];
  selectedId: string;
  onSelect: (variantId: string) => void;
  name: string;
  locale: Locale;
  label: string;
}

/** Variant radios; the selected price and stock are rendered by the buy box. */
export function VariantPicker({
  variants,
  selectedId,
  onSelect,
  name,
  locale,
  label,
}: VariantPickerProps) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-semibold text-ink">{label}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {variants.map((variant) => (
          <label
            key={variant.id}
            className={`flex cursor-pointer flex-col gap-1 rounded-sm border p-3 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${
              variant.id === selectedId
                ? 'border-accent bg-accent/5 text-ink'
                : 'border-line bg-surface text-ink-muted hover:border-accent'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={variant.id}
              checked={variant.id === selectedId}
              onChange={() => onSelect(variant.id)}
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
    </fieldset>
  );
}
