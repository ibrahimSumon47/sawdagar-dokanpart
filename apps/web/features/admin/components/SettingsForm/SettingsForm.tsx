import type { Dictionary } from '../../../../i18n';
import { SubmitButton } from '../../../auth/components/SubmitButton';
import { saveSettingsAction } from '../../../content/settingsActions';
import { linkLimits, type SiteSettingsRecord } from '../../../content/settingsTypes';
import { SettingsLinksEditor } from '../SettingsLinksEditor';
import { SettingsAnnouncementFields } from './SettingsAnnouncementFields';
import { SettingsPolicyFields } from './SettingsPolicyFields';
import { SettingsSeoFields } from './SettingsSeoFields';

export interface SettingsFormProps {
  /** Saved settings, or null before the first save. */
  settings: SiteSettingsRecord | null;
  copy: Dictionary['admin'];
}

/** Everything the settings editor can change, saved in one post. */
export function SettingsForm({ settings, copy }: SettingsFormProps) {
  const linkCopy = {
    title: copy.settingsNavigationTitle,
    description: copy.settingsNavigationHint,
    empty: copy.noLinks,
    add: copy.addLink,
    remove: copy.removeLink,
    labelEn: copy.linkLabelEn,
    labelBn: copy.linkLabelBn,
    href: copy.linkHref,
  };

  return (
    <form action={saveSettingsAction} className="space-y-5">
      <SettingsAnnouncementFields settings={settings} copy={copy} />
      <SettingsSeoFields settings={settings} copy={copy} />
      <SettingsPolicyFields settings={settings} copy={copy} />
      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsLinksEditor
          name="navigation"
          initialLinks={settings?.navigation ?? []}
          max={linkLimits.navigation}
          copy={linkCopy}
        />
        <SettingsLinksEditor
          name="footerLinks"
          initialLinks={settings?.footerLinks ?? []}
          max={linkLimits.footer}
          copy={{
            ...linkCopy,
            title: copy.settingsFooterTitle,
            description: copy.settingsFooterHint,
          }}
        />
      </div>
      <SubmitButton label={copy.saveSettings} pendingLabel={copy.settingsSaving} />
    </form>
  );
}
