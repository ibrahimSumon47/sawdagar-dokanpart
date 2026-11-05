import type { Dictionary } from '../../../../i18n';
import type { SiteSettingsRecord } from '../../../content/settingsTypes';
import { area, control, hint, label } from './fieldStyles';

export interface SettingsSeoFieldsProps {
  /** Saved settings, or null before the first save. */
  settings: SiteSettingsRecord | null;
  copy: Dictionary['admin'];
}

/** Default title and description for pages that set none of their own. */
export function SettingsSeoFields({ settings, copy }: SettingsSeoFieldsProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-lg text-ink">{copy.settingsSeoTitle}</h2>
      <p className={hint}>{copy.settingsSeoHint}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.seoTitleEnLabel}
          <input
            type="text"
            name="seoTitleEn"
            maxLength={70}
            defaultValue={settings?.seoTitleEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.seoTitleBnLabel}
          <input
            type="text"
            name="seoTitleBn"
            maxLength={70}
            defaultValue={settings?.seoTitleBn ?? ''}
            className={control}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.seoDescriptionEnLabel}
          <textarea
            name="seoDescriptionEn"
            maxLength={160}
            rows={3}
            defaultValue={settings?.seoDescriptionEn ?? ''}
            className={area}
          />
        </label>
        <label className={label}>
          {copy.seoDescriptionBnLabel}
          <textarea
            name="seoDescriptionBn"
            maxLength={160}
            rows={3}
            defaultValue={settings?.seoDescriptionBn ?? ''}
            className={area}
          />
        </label>
      </div>
    </section>
  );
}
