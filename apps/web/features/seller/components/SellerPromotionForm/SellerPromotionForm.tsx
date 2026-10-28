import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { savePromotionAction } from '../../storeActions';

export interface SellerPromotionFormProps {
  copy: Dictionary['seller'];
}

const fieldClass =
  'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Creates or updates a store coupon by code. */
export function SellerPromotionForm({ copy }: SellerPromotionFormProps) {
  return (
    <form
      action={savePromotionAction}
      className="space-y-4 rounded-sm border border-line bg-surface p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="code" className="text-xs font-semibold text-ink">
            {copy.code}
          </label>
          <input
            id="code"
            name="code"
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9-]+"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="type" className="text-xs font-semibold text-ink">
            {copy.type}
          </label>
          <select id="type" name="type" className={fieldClass}>
            <option value="percent">{copy.percent}</option>
            <option value="fixed">{copy.fixed}</option>
            <option value="free_shipping">{copy.freeShipping}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="value" className="text-xs font-semibold text-ink">
            {copy.value}
          </label>
          <input
            id="value"
            name="value"
            type="number"
            min="0"
            step="1"
            defaultValue={0}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="minSubtotal" className="text-xs font-semibold text-ink">
            {copy.minSubtotal}
          </label>
          <input
            id="minSubtotal"
            name="minSubtotal"
            type="number"
            min="0"
            step="1"
            defaultValue={0}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="endsAt" className="text-xs font-semibold text-ink">
            {copy.endsAt}
          </label>
          <input id="endsAt" name="endsAt" type="date" className={fieldClass} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="active" defaultChecked className="size-4 accent-accent" />
        {copy.active}
      </label>

      <Button type="submit">{copy.createPromotion}</Button>
    </form>
  );
}
