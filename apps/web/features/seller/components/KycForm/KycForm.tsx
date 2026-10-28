import { districts } from '@sd/domain';
import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { SellerStoreRecord } from '../../queries';
import { submitKycAction } from '../../storeActions';

export interface KycFormProps {
  store: SellerStoreRecord;
  copy: Dictionary['seller'];
}

const fieldClass =
  'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Business details a vendor submits for marketplace KYC review. */
export function KycForm({ store, copy }: KycFormProps) {
  return (
    <form
      action={submitKycAction}
      className="space-y-4 rounded-sm border border-line bg-surface p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="legalName" className="text-xs font-semibold text-ink">
            {copy.legalName}
          </label>
          <input
            id="legalName"
            name="legalName"
            required
            minLength={2}
            maxLength={120}
            defaultValue={store.legalName ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="businessType" className="text-xs font-semibold text-ink">
            {copy.businessType}
          </label>
          <select
            id="businessType"
            name="businessType"
            defaultValue={store.businessType ?? 'sole_proprietor'}
            className={fieldClass}
          >
            <option value="sole_proprietor">{copy.businessSole}</option>
            <option value="partnership">{copy.businessPartnership}</option>
            <option value="company">{copy.businessCompany}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tradeLicense" className="text-xs font-semibold text-ink">
            {copy.tradeLicense}
          </label>
          <input
            id="tradeLicense"
            name="tradeLicense"
            required
            minLength={4}
            maxLength={40}
            defaultValue={store.tradeLicense ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="payoutPhone" className="text-xs font-semibold text-ink">
            {copy.payoutPhone}
          </label>
          <input
            id="payoutPhone"
            name="payoutPhone"
            type="tel"
            required
            defaultValue={store.payoutPhone ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="district" className="text-xs font-semibold text-ink">
          {copy.district}
        </label>
        <select
          id="district"
          name="district"
          defaultValue={store.district ?? 'Dhaka'}
          className={fieldClass}
        >
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit">{copy.submitKyc}</Button>
    </form>
  );
}
