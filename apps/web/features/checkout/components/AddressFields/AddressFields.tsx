'use client';

import { districtsForDivision, divisions } from '@sd/domain';
import type { Dictionary } from '../../../../i18n';

export interface AddressDraft {
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  area: string;
  addressLine: string;
}

export interface AddressFieldsProps {
  value: AddressDraft;
  onChange: (next: AddressDraft) => void;
  copy: Dictionary['checkout'];
}

const inputClass =
  'mt-1 min-h-11 w-full rounded-sm border border-line bg-background px-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const labelClass = 'text-sm font-medium text-ink';

/** The address form fields shared by checkout and future account pages. */
export function AddressFields({ value, onChange, copy }: AddressFieldsProps) {
  const set = (field: keyof AddressDraft, next: string) => onChange({ ...value, [field]: next });
  const districts = districtsForDivision(value.division);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="checkout-name" className={labelClass}>
          {copy.recipientName}
        </label>
        <input
          id="checkout-name"
          name="recipientName"
          value={value.recipientName}
          onChange={(event) => set('recipientName', event.target.value)}
          autoComplete="name"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="checkout-phone" className={labelClass}>
          {copy.phone}
        </label>
        <input
          id="checkout-phone"
          name="phone"
          value={value.phone}
          onChange={(event) => set('phone', event.target.value)}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01712345678"
          aria-describedby="checkout-phone-hint"
          required
          className={inputClass}
        />
        <p id="checkout-phone-hint" className="mt-1 text-xs text-ink-muted">
          {copy.phoneHint}
        </p>
      </div>

      <div>
        <label htmlFor="checkout-division" className={labelClass}>
          {copy.division}
        </label>
        <select
          id="checkout-division"
          name="division"
          value={value.division}
          onChange={(event) => {
            const division = event.target.value;
            const firstDistrict = districtsForDivision(division)[0] ?? '';
            onChange({ ...value, division, district: firstDistrict });
          }}
          required
          className={inputClass}
        >
          {divisions.map((division) => (
            <option key={division.name} value={division.name}>
              {division.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="checkout-district" className={labelClass}>
          {copy.district}
        </label>
        <select
          id="checkout-district"
          name="district"
          value={value.district}
          onChange={(event) => set('district', event.target.value)}
          required
          className={inputClass}
        >
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="checkout-upazila" className={labelClass}>
          {copy.upazila}
        </label>
        <input
          id="checkout-upazila"
          name="upazila"
          value={value.upazila}
          onChange={(event) => set('upazila', event.target.value)}
          autoComplete="address-level2"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="checkout-area" className={labelClass}>
          {copy.area}
        </label>
        <input
          id="checkout-area"
          name="area"
          value={value.area}
          onChange={(event) => set('area', event.target.value)}
          autoComplete="address-level3"
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="checkout-line" className={labelClass}>
          {copy.addressLine}
        </label>
        <input
          id="checkout-line"
          name="addressLine"
          value={value.addressLine}
          onChange={(event) => set('addressLine', event.target.value)}
          autoComplete="street-address"
          aria-describedby="checkout-line-hint"
          required
          className={inputClass}
        />
        <p id="checkout-line-hint" className="mt-1 text-xs text-ink-muted">
          {copy.addressLineHint}
        </p>
      </div>
    </div>
  );
}
