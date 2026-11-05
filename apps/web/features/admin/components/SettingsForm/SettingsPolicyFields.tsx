import type { Dictionary } from '../../../../i18n';
import type { SiteSettingsRecord } from '../../../content/settingsTypes';
import { area, hint, label } from './fieldStyles';

export interface SettingsPolicyFieldsProps {
  /** Saved settings, or null before the first save. */
  settings: SiteSettingsRecord | null;
  copy: Dictionary['admin'];
}

/** Shipping and return text published on the policies page. */
export function SettingsPolicyFields({ settings, copy }: SettingsPolicyFieldsProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-lg text-ink">{copy.settingsPoliciesTitle}</h2>
      <p className={hint}>{copy.settingsPoliciesHint}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.shippingPolicyEnLabel}
          <textarea
            name="shippingPolicyEn"
            maxLength={1200}
            rows={5}
            defaultValue={settings?.shippingPolicyEn ?? ''}
            className={area}
          />
        </label>
        <label className={label}>
          {copy.shippingPolicyBnLabel}
          <textarea
            name="shippingPolicyBn"
            maxLength={1200}
            rows={5}
            defaultValue={settings?.shippingPolicyBn ?? ''}
            className={area}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.returnsPolicyEnLabel}
          <textarea
            name="returnsPolicyEn"
            maxLength={1200}
            rows={5}
            defaultValue={settings?.returnsPolicyEn ?? ''}
            className={area}
          />
        </label>
        <label className={label}>
          {copy.returnsPolicyBnLabel}
          <textarea
            name="returnsPolicyBn"
            maxLength={1200}
            rows={5}
            defaultValue={settings?.returnsPolicyBn ?? ''}
            className={area}
          />
        </label>
      </div>
    </section>
  );
}
