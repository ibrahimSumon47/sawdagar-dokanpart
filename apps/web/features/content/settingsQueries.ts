import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getPrisma } from '../../lib/prisma';
import {
  defaultSettings,
  type SettingsSnapshot,
  type SiteLink,
  type SiteSettingsRecord,
} from './settingsTypes';

/** The settings row is a singleton, so it always has this id. */
export const SETTINGS_ID = 'site';

/** One saved settings snapshot in the history panel. */
export interface SettingsVersionRecord {
  id: string;
  version: number;
  note: string | null;
  createdAt: Date;
}

const settingsFields = {
  id: true,
  announcementEnabled: true,
  announcementEn: true,
  announcementBn: true,
  announcementHref: true,
  seoTitleEn: true,
  seoTitleBn: true,
  seoDescriptionEn: true,
  seoDescriptionBn: true,
  shippingPolicyEn: true,
  shippingPolicyBn: true,
  returnsPolicyEn: true,
  returnsPolicyBn: true,
  navigation: true,
  footerLinks: true,
  updatedAt: true,
  updatedByUserId: true,
} as const;

/** Reads a link list column, discarding anything that is not a finished link. */
function parseLinks(value: unknown): SiteLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const link = item as Record<string, unknown>;
    const { labelEn, labelBn, href } = link;
    if (typeof labelEn !== 'string' || typeof href !== 'string') return [];
    return [{ labelEn, labelBn: typeof labelBn === 'string' ? labelBn : labelEn, href }];
  });
}

/** The saved settings row, or null before any editor has saved one. */
export const getSiteSettings = cache(async (): Promise<SiteSettingsRecord | null> => {
  const row = await getPrisma().siteSettings.findUnique({
    where: { id: SETTINGS_ID },
    select: settingsFields,
  });
  if (!row) return null;
  return {
    ...row,
    navigation: parseLinks(row.navigation),
    footerLinks: parseLinks(row.footerLinks),
  };
});

/** Cache tag shared by the settings actions, so a save or restore refreshes the storefront at once. */
export const SETTINGS_CACHE_TAG = 'site-settings';

/*
 * The storefront reads settings on every page (header, footer, metadata).
 * Caching them keeps those pages off the database; the 60-second window is a
 * fallback in case a save path is ever missed, the tag is the normal refresh.
 */
const loadPublicSettings = unstable_cache(
  async (): Promise<SiteSettingsRecord> => {
    const saved = await getSiteSettings();
    return (
      saved ?? { ...defaultSettings(), id: SETTINGS_ID, updatedAt: null, updatedByUserId: null }
    );
  },
  ['public-settings'],
  { tags: [SETTINGS_CACHE_TAG], revalidate: 60 },
);

/** Settings for the storefront, falling back to the built-in defaults. */
export async function getPublicSettings(): Promise<SiteSettingsRecord> {
  const settings = await loadPublicSettings();
  // The cache stores JSON, so dates come back as strings; restore them.
  return {
    ...settings,
    updatedAt: settings.updatedAt ? new Date(settings.updatedAt) : null,
  };
}

/** The saved settings with their ten most recent versions. */
export async function getSettingsForAdmin(): Promise<{
  settings: SiteSettingsRecord | null;
  versions: SettingsVersionRecord[];
}> {
  const row = await getPrisma().siteSettings.findUnique({
    where: { id: SETTINGS_ID },
    select: {
      ...settingsFields,
      versions: {
        orderBy: { version: 'desc' },
        take: 10,
        select: { id: true, version: true, note: true, createdAt: true },
      },
    },
  });
  if (!row) return { settings: null, versions: [] };

  const { versions, ...rest } = row;
  const settings: SiteSettingsRecord = {
    ...rest,
    navigation: parseLinks(rest.navigation),
    footerLinks: parseLinks(rest.footerLinks),
  };
  return { settings, versions };
}

/** Turns a snapshot back into the shape the queries return. */
export function snapshotRecord(
  snapshot: SettingsSnapshot,
  updatedAt: Date | null,
  updatedByUserId: string | null,
): SiteSettingsRecord {
  return { ...snapshot, id: SETTINGS_ID, updatedAt, updatedByUserId };
}
