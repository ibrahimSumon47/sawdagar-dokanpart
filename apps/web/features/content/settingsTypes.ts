/** One editor-defined link, with a label in each storefront language. */
export interface SiteLink {
  labelEn: string;
  labelBn: string;
  href: string;
}

/** Everything the settings editor can change, as stored. */
export interface SettingsSnapshot {
  announcementEnabled: boolean;
  announcementEn: string | null;
  announcementBn: string | null;
  announcementHref: string | null;
  seoTitleEn: string | null;
  seoTitleBn: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionBn: string | null;
  shippingPolicyEn: string | null;
  shippingPolicyBn: string | null;
  returnsPolicyEn: string | null;
  returnsPolicyBn: string | null;
  navigation: SiteLink[];
  footerLinks: SiteLink[];
}

/** The settings row plus who touched it last. */
export interface SiteSettingsRecord extends SettingsSnapshot {
  id: string;
  /** Null until an editor saves the settings for the first time. */
  updatedAt: Date | null;
  updatedByUserId: string | null;
}

/** How many links each menu may hold, so the header and footer stay readable. */
export const linkLimits = { navigation: 6, footer: 5 } as const;

/**
 * Settings used before an editor saves anything: no announcement, no extra
 * links, and the built-in metadata and policy copy left in charge.
 */
export function defaultSettings(): SettingsSnapshot {
  return {
    announcementEnabled: false,
    announcementEn: null,
    announcementBn: null,
    announcementHref: null,
    seoTitleEn: null,
    seoTitleBn: null,
    seoDescriptionEn: null,
    seoDescriptionBn: null,
    shippingPolicyEn: null,
    shippingPolicyBn: null,
    returnsPolicyEn: null,
    returnsPolicyBn: null,
    navigation: [],
    footerLinks: [],
  };
}
