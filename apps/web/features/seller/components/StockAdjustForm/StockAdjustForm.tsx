import { Button } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { adjustStockAction } from '../../inventoryActions';
import type { SellerInventoryRow } from '../../queries';

export interface StockAdjustFormProps {
  variants: readonly SellerInventoryRow[];
  copy: Dictionary['seller'];
  locale: Locale;
}

const fieldClass =
  'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Signed stock change with a reason, recorded against one variant. */
export function StockAdjustForm({ variants, copy, locale }: StockAdjustFormProps) {
  return (
    <form
      action={adjustStockAction}
      className="space-y-4 rounded-sm border border-line bg-surface p-5"
    >
      <div>
        <label htmlFor="variantId" className="text-xs font-semibold text-ink">
          {copy.chooseVariant}
        </label>
        <select id="variantId" name="variantId" required className={fieldClass}>
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {locale === 'bn' ? variant.productTitleBn : variant.productTitleEn} ·{' '}
              {locale === 'bn' ? variant.nameBn : variant.nameEn} ({variant.stock})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="delta" className="text-xs font-semibold text-ink">
            {copy.delta}
          </label>
          <input
            id="delta"
            name="delta"
            type="number"
            step="1"
            min="-1000"
            max="1000"
            required
            aria-describedby="delta-hint"
            className={fieldClass}
          />
          <p id="delta-hint" className="mt-1 text-xs text-ink-muted">
            {copy.deltaHint}
          </p>
        </div>
        <div>
          <label htmlFor="reason" className="text-xs font-semibold text-ink">
            {copy.reason}
          </label>
          <select id="reason" name="reason" className={fieldClass}>
            <option value="restock">{copy.reasonRestock}</option>
            <option value="correction">{copy.reasonCorrection}</option>
            <option value="damage">{copy.reasonDamage}</option>
            <option value="return">{copy.reasonReturn}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="note" className="text-xs font-semibold text-ink">
          {copy.note}
        </label>
        <input id="note" name="note" maxLength={200} className={fieldClass} />
      </div>

      <Button type="submit">{copy.apply}</Button>
    </form>
  );
}
