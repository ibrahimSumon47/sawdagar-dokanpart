import { getPrisma } from '../../lib/prisma';
import type { ContentKind, ContentSnapshot, ContentStatus } from './contentTypes';

export interface CmsEntryRecord extends ContentSnapshot {
  id: string;
  kind: ContentKind;
  slug: string;
  status: ContentStatus;
  publishAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CmsVersionRecord {
  id: string;
  version: number;
  note: string | null;
  createdAt: Date;
}

const entryFields = {
  id: true,
  kind: true,
  slug: true,
  titleEn: true,
  titleBn: true,
  excerptEn: true,
  excerptBn: true,
  bodyEn: true,
  bodyBn: true,
  seoTitleEn: true,
  seoTitleBn: true,
  seoDescriptionEn: true,
  seoDescriptionBn: true,
  status: true,
  publishAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

/** Every CMS entry, newest edit first. */
export async function getCmsEntries(): Promise<CmsEntryRecord[]> {
  const rows = await getPrisma().cmsEntry.findMany({
    orderBy: { updatedAt: 'desc' },
    select: entryFields,
  });
  return rows as CmsEntryRecord[];
}

/** One entry with its version history, or null. */
export async function getCmsEntry(
  id: string,
): Promise<{ entry: CmsEntryRecord; versions: CmsVersionRecord[] } | null> {
  const row = await getPrisma().cmsEntry.findUnique({
    where: { id },
    select: { ...entryFields, versions: { orderBy: { version: 'desc' } } },
  });
  if (!row) return null;

  const { versions, ...entry } = row;
  return {
    entry: entry as CmsEntryRecord,
    versions: versions.map((version) => ({
      id: version.id,
      version: version.version,
      note: version.note,
      createdAt: version.createdAt,
    })),
  };
}

/** Entries a visitor may see: published, or scheduled with the date reached. */
function visibleWhere(kind?: ContentKind) {
  return {
    ...(kind ? { kind } : {}),
    OR: [{ status: 'published' }, { status: 'scheduled', publishAt: { lte: new Date() } }],
  };
}

/** Visible entries for a public index, newest first. */
export async function getPublicContentList(kind: ContentKind): Promise<CmsEntryRecord[]> {
  const rows = await getPrisma().cmsEntry.findMany({
    where: visibleWhere(kind),
    orderBy: [{ publishAt: 'desc' }, { updatedAt: 'desc' }],
    select: entryFields,
  });
  return rows as CmsEntryRecord[];
}

/** One visible entry by kind and slug, or null. */
export async function getPublicContentEntry(
  kind: ContentKind,
  slug: string,
): Promise<CmsEntryRecord | null> {
  const row = await getPrisma().cmsEntry.findFirst({
    where: { ...visibleWhere(kind), slug },
    select: entryFields,
  });
  return row as CmsEntryRecord | null;
}

/** One visible static page by slug. */
export async function getPublicPage(slug: string): Promise<CmsEntryRecord | null> {
  return getPublicContentEntry('page', slug);
}
