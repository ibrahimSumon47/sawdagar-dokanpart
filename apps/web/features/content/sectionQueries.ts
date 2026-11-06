import { revalidateTag, unstable_cache } from 'next/cache';
import { getPrisma } from '../../lib/prisma';
import type { SectionKind, SectionSnapshot, SectionStatus } from './sectionTypes';

/**
 * Cache tag for the visitor-facing homepage sections. CMS actions purge it on
 * every save, publish, archive or reorder; the 60-second revalidate covers
 * scheduled sections whose publish time is reached without an edit.
 */
export const PUBLISHED_SECTIONS_TAG = 'published-sections';

/** Drops the cached homepage sections; call after any CMS section write. */
export function purgePublishedSections(): void {
  revalidateTag(PUBLISHED_SECTIONS_TAG, { expire: 0 });
}

/** A homepage section as stored. */
export interface CmsSectionRecord extends SectionSnapshot {
  id: string;
  kind: SectionKind;
  status: SectionStatus;
  publishAt: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/** One saved section snapshot in the history panel. */
export interface CmsSectionVersionRecord {
  id: string;
  version: number;
  note: string | null;
  createdAt: Date;
}

const sectionFields = {
  id: true,
  kind: true,
  titleEn: true,
  titleBn: true,
  bodyEn: true,
  bodyBn: true,
  imageUrl: true,
  ctaLabelEn: true,
  ctaLabelBn: true,
  ctaHref: true,
  status: true,
  publishAt: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

/** Every section in display order, drafts and archived ones included. */
export async function getCmsSections(): Promise<CmsSectionRecord[]> {
  const rows = await getPrisma().cmsSection.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: sectionFields,
  });
  return rows as CmsSectionRecord[];
}

/** One section with its ten most recent versions, or null. */
export async function getCmsSection(
  id: string,
): Promise<{ section: CmsSectionRecord; versions: CmsSectionVersionRecord[] } | null> {
  const row = await getPrisma().cmsSection.findUnique({
    where: { id },
    select: {
      ...sectionFields,
      versions: {
        orderBy: { version: 'desc' },
        take: 10,
        select: { id: true, version: true, note: true, createdAt: true },
      },
    },
  });
  if (!row) return null;

  const { versions, ...section } = row;
  return { section: section as CmsSectionRecord, versions };
}

/** Sections a visitor may see: published, or scheduled with the date reached. */
export const getPublishedSections = unstable_cache(loadPublishedSections, ['published-sections'], {
  tags: [PUBLISHED_SECTIONS_TAG],
  revalidate: 60,
});

async function loadPublishedSections(): Promise<CmsSectionRecord[]> {
  const rows = await getPrisma().cmsSection.findMany({
    where: {
      OR: [{ status: 'published' }, { status: 'scheduled', publishAt: { lte: new Date() } }],
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: sectionFields,
  });
  return rows as CmsSectionRecord[];
}

/** The published hero the storefront opens with, or null to use the dictionary copy. */
export async function getPublishedHero(): Promise<CmsSectionRecord | null> {
  const sections = await getPublishedSections();
  return sections.find((section) => section.kind === 'hero') ?? null;
}
