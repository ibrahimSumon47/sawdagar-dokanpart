import { localisedLinks } from '../../../content/settingsLinks';
import { getPublicSettings } from '../../../content/settingsQueries';
import { getDictionary, type Locale } from '../../../../i18n';
import { SiteAnnouncement } from '../SiteAnnouncement';
import { SiteFooter } from '../SiteFooter';

export interface ShellSettingsProps {
  locale: Locale;
}

/**
 * The announcement bar, which sits above the header, reads the saved settings.
 * It renders inside its own Suspense boundary so the shell is not held back by it.
 */
export async function ShellAnnouncement({ locale }: ShellSettingsProps) {
  const settings = await getPublicSettings();
  const copy = getDictionary(locale);
  const bangla = locale === 'bn';
  const announcement = bangla
    ? settings.announcementBn || settings.announcementEn
    : settings.announcementEn || settings.announcementBn;

  if (!settings.announcementEnabled || !announcement) return null;

  return (
    <SiteAnnouncement
      text={announcement}
      href={settings.announcementHref}
      label={copy.common.announcementLabel}
    />
  );
}

/** The footer reads the saved footer links, so it streams in its own Suspense boundary. */
export async function ShellFooter({ locale }: ShellSettingsProps) {
  const settings = await getPublicSettings();
  const copy = getDictionary(locale);
  return <SiteFooter copy={copy} extraLinks={localisedLinks(settings.footerLinks, locale)} />;
}
