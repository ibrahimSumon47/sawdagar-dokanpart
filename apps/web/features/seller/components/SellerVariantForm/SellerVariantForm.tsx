import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { saveVariantAction } from '../../inventoryActions';

export interface SellerVariantFormProps {
  variant: {
    id: string;
    sku: string;
    nameEn: string;
    nameBn: string;
    priceMinor: number;
    stock: number;
  };
  copy: Dictionary['seller'];
}

const fieldClass =
  'block w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Inline price and stock editor for one variant row. */
export function SellerVariantForm({ variant, copy }: SellerVariantFormProps) {
  return (
    <form action={saveVariantAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="variantId" value={variant.id} />
      <div className="min-w-24">
        <label htmlFor={`price-${variant.id}`} className="text-xs text-ink-muted">
          {copy.variantPrice}
        </label>
        <input
          id={`price-${variant.id}`}
          name="price"
          type="number"
          min="1"
          step="1"
          required
          defaultValue={Math.round(variant.priceMinor / 100)}
          className={fieldClass}
        />
      </div>
      <div className="min-w-20">
        <label htmlFor={`stock-${variant.id}`} className="text-xs text-ink-muted">
          {copy.variantStock}
        </label>
        <input
          id={`stock-${variant.id}`}
          name="stock"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={variant.stock}
          className={fieldClass}
        />
      </div>
      <Button type="submit" variant="secondary" size="sm">
        {copy.saveVariant}
      </Button>
    </form>
  );
}
