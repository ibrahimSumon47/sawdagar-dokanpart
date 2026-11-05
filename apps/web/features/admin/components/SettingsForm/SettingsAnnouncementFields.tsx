import type { Dictionary } from '../../../../i18n';
import type { SiteSettingsRecord } from '../../../content/settingsTypes';
import { control, hint, label } from './fieldStyles';

export interface SettingsAnnouncementFieldsProps {
  /** Saved settings, or null before the first save. */
  settings: SiteSettingsRecord | null;
  copy: Dictionary['admin'];
}

/** Switch, text and optional link for the bar under the header. */
export function SettingsAnnouncementFields({ settings, copy }: SettingsAnnouncementFieldsProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-lg text-ink">{copy.settingsAnnouncementTitle}</h2>
      <p className={hint}>{copy.settingsAnnouncementHint}</p>

      <label className="mt-4 flex items-start gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="announcementEnabled"
          defaultChecked={settings?.announcementEnabled ?? false}
          className="mt-0.5 size-4 rounded-sm border border-line accent-accent"
        />
        <span>{copy.announcementEnabledLabel}</span>
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.announcementEnLabel}
          <input
            type="text"
            name="announcementEn"
            maxLength={160}
            defaultValue={settings?.announcementEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.announcementBnLabel}
          <input
            type="text"
            name="announcementBn"
            maxLength={160}
            defaultValue={settings?.announcementBn ?? ''}
            className={control}
          />
        </label>
      </div>

      <label className={`${label} mt-4 block`}>
        {copy.announcementHrefLabel}
        <input
          type="text"
          name="announcementHref"
          maxLength={300}
          defaultValue={settings?.announcementHref ?? ''}
          className={control}
        />
      </label>
    </section>
  );
}
