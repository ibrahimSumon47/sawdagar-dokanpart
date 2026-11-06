'use client';

import { districtsForDivision, divisions, upazilasByDistrict } from '@sd/domain';
import type { Dictionary, Locale } from '../../../../i18n';
import { placeName } from '../../../../i18n/places';

/** Address values as the checkout form holds them before submission. */
export interface AddressDraft {
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  area: string;
  addressLine: string;
  postcode: string;
  landmark: string;
}

export interface AddressFieldsProps {
  value: AddressDraft;
  onChange: (next: AddressDraft) => void;
  copy: Dictionary['checkout'];
  locale: Locale;
}

const inputClass =
  'mt-1 min-h-11 w-full rounded-sm border border-line bg-background px-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const labelClass = 'text-sm font-medium text-ink';

/**
 * The delivery address fields shared by checkout and future account pages.
 * Division, district and upazila are chosen from lists; changing a parent
 * level clears the child so a stale pair can never be submitted.
 */
export function AddressFields({ value, onChange, copy, locale }: AddressFieldsProps) {
  const set = (field: keyof AddressDraft, next: string) => onChange({ ...value, [field]: next });
  const districts = districtsForDivision(value.division);
  const upazilas = upazilasByDistrict[value.district] ?? [];

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
            onChange({ ...value, division, district: firstDistrict, upazila: '' });
          }}
          required
          className={inputClass}
        >
          {divisions.map((division) => (
            <option key={division.name} value={division.name}>
              {placeName(division.name, locale)}
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
          onChange={(event) => onChange({ ...value, district: event.target.value, upazila: '' })}
          required
          className={inputClass}
        >
          {districts.map((district) => (
            <option key={district} value={district}>
              {placeName(district, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="checkout-upazila" className={labelClass}>
          {copy.upazila}
        </label>
        <select
          id="checkout-upazila"
          name="upazila"
          value={value.upazila}
          onChange={(event) => set('upazila', event.target.value)}
          required
          className={inputClass}
        >
          <option value="">{copy.upazilaPlaceholder}</option>
          {upazilas.map((upazila) => (
            <option key={upazila} value={upazila}>
              {upazila}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="checkout-postcode" className={labelClass}>
          {copy.postcode}
        </label>
        <input
          id="checkout-postcode"
          name="postcode"
          value={value.postcode}
          onChange={(event) => set('postcode', event.target.value)}
          inputMode="numeric"
          autoComplete="postal-code"
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
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

      <div className="sm:col-span-2">
        <label htmlFor="checkout-landmark" className={labelClass}>
          {copy.landmark}
        </label>
        <input
          id="checkout-landmark"
          name="landmark"
          value={value.landmark}
          onChange={(event) => set('landmark', event.target.value)}
          className={inputClass}
        />
      </div>
    </div>
  );
}
