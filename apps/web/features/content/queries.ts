import { getPrisma } from '../../lib/prisma';
import type { ContentKind, ContentSnapshot, ContentStatus } from './contentTypes';

export interface CmsEntryRecord extends ContentSnapshot {
  id: string;
  kind: ContentKind;
  slug: string;
  helpCategoryId: string | null;
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

/** Columns every content list and editor reads; help queries reuse them. */
export const cmsEntryFields = {
  id: true,
  kind: true,
  slug: true,
  helpCategoryId: true,
  titleEn: true,
  titleBn: true,
  excerptEn: true,
  excerptBn: true,
  bodyEn: true,
  bodyBn: true,
  coverImageUrl: true,
  coverImageAltEn: true,
  coverImageAltBn: true,
  tags: true,
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
    select: cmsEntryFields,
  });
  return rows as CmsEntryRecord[];
}

/** One entry with its version history, or null. */
export async function getCmsEntry(
  id: string,
): Promise<{ entry: CmsEntryRecord; versions: CmsVersionRecord[] } | null> {
  const row = await getPrisma().cmsEntry.findUnique({
    where: { id },
    select: { ...cmsEntryFields, versions: { orderBy: { version: 'desc' } } },
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

/**
 * Visible entries for a public index, newest first. Pass a `tag` to keep only entries carrying
 * that tag slug.
 */
export async function getPublicContentList(
  kind: ContentKind,
  options: { tag?: string } = {},
): Promise<CmsEntryRecord[]> {
  const rows = await getPrisma().cmsEntry.findMany({
    where: { ...visibleWhere(kind), ...(options.tag ? { tags: { has: options.tag } } : {}) },
    orderBy: [{ publishAt: 'desc' }, { updatedAt: 'desc' }],
    select: cmsEntryFields,
  });
  return rows as CmsEntryRecord[];
}

/** Tag slugs used by the visible entries of one kind, most used first. */
export async function getPublicContentTags(
  kind: ContentKind,
): Promise<{ tag: string; count: number }[]> {
  const rows = await getPrisma().cmsEntry.findMany({
    where: visibleWhere(kind),
    select: { tags: true },
  });
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const tag of row.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** One visible entry by kind and slug, or null. */
export async function getPublicContentEntry(
  kind: ContentKind,
  slug: string,
): Promise<CmsEntryRecord | null> {
  const row = await getPrisma().cmsEntry.findFirst({
    where: { ...visibleWhere(kind), slug },
    select: cmsEntryFields,
  });
  return row as CmsEntryRecord | null;
}

/** One visible static page by slug. */
export async function getPublicPage(slug: string): Promise<CmsEntryRecord | null> {
  return getPublicContentEntry('page', slug);
}
