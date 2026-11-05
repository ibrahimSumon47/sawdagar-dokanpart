import type { Prisma } from '../../generated/prisma/client';
import { getPrisma } from '../../lib/prisma';
import { cmsEntryFields, type CmsEntryRecord } from './queries';
import type { HelpCategorySnapshot } from './helpCategoryTypes';

/** A Help Center category as stored. */
export interface HelpCategoryRecord extends HelpCategorySnapshot {
  id: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/** One category plus how many visible articles are filed under it. */
export interface HelpCategoryWithCount extends HelpCategoryRecord {
  articleCount: number;
}

/** One saved category snapshot in the history panel. */
export interface HelpCategoryVersionRecord {
  id: string;
  version: number;
  note: string | null;
  createdAt: Date;
}

/** A visible Help article with the category it belongs to, when it has one. */
export interface HelpArticleRecord extends CmsEntryRecord {
  category: { slug: string; nameEn: string; nameBn: string } | null;
}

const categoryFields = {
  id: true,
  slug: true,
  nameEn: true,
  nameBn: true,
  descriptionEn: true,
  descriptionBn: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

const categorySummary = { select: { slug: true, nameEn: true, nameBn: true } } as const;

/** Published or scheduled-and-due Help articles. */
function visibleHelpWhere(): Prisma.CmsEntryWhereInput {
  return {
    kind: 'help',
    OR: [{ status: 'published' }, { status: 'scheduled', publishAt: { lte: new Date() } }],
  };
}

/** Every category in display order, with its visible article count. */
export async function getHelpCategories(): Promise<HelpCategoryWithCount[]> {
  const rows = await getPrisma().helpCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      ...categoryFields,
      _count: { select: { entries: { where: visibleHelpWhere() } } },
    },
  });
  return rows.map(({ _count, ...category }) => ({ ...category, articleCount: _count.entries }));
}

/** The categories a visitor sees, in display order. */
export async function getPublicHelpCategories(): Promise<HelpCategoryWithCount[]> {
  return getHelpCategories();
}

/** One category with its ten most recent versions, or null. */
export async function getHelpCategory(
  id: string,
): Promise<{ category: HelpCategoryRecord; versions: HelpCategoryVersionRecord[] } | null> {
  const row = await getPrisma().helpCategory.findUnique({
    where: { id },
    select: {
      ...categoryFields,
      versions: {
        orderBy: { version: 'desc' },
        take: 10,
        select: { id: true, version: true, note: true, createdAt: true },
      },
    },
  });
  if (!row) return null;

  const { versions, ...category } = row;
  return { category: category as HelpCategoryRecord, versions };
}

/**
 * Builds the article filter for a category slug and a search phrase. Every
 * condition is ANDed so a search never widens the visible set to drafts.
 */
function helpArticleWhere(
  categorySlug: string | null,
  query: string | null,
): Prisma.CmsEntryWhereInput {
  const trimmed = query?.trim() ?? '';
  const filters: Prisma.CmsEntryWhereInput[] = [visibleHelpWhere()];

  if (trimmed.length >= 2) {
    filters.push({
      OR: [
        { titleEn: { contains: trimmed, mode: 'insensitive' } },
        { titleBn: { contains: trimmed, mode: 'insensitive' } },
        { excerptEn: { contains: trimmed, mode: 'insensitive' } },
        { excerptBn: { contains: trimmed, mode: 'insensitive' } },
        { bodyEn: { contains: trimmed, mode: 'insensitive' } },
        { bodyBn: { contains: trimmed, mode: 'insensitive' } },
      ],
    });
  }
  if (categorySlug) filters.push({ helpCategory: { slug: categorySlug } });

  return { AND: filters };
}

/** How many Help articles are visible, ignoring filters. */
export async function countPublicHelpArticles(): Promise<number> {
  return getPrisma().cmsEntry.count({ where: visibleHelpWhere() });
}

/** Visible Help articles, filtered by category and search phrase. */
export async function getPublicHelpArticles(params: {
  categorySlug?: string | null;
  query?: string | null;
}): Promise<HelpArticleRecord[]> {
  const rows = await getPrisma().cmsEntry.findMany({
    where: helpArticleWhere(params.categorySlug ?? null, params.query ?? null),
    orderBy: [{ publishAt: 'desc' }, { updatedAt: 'desc' }],
    select: { ...cmsEntryFields, helpCategory: categorySummary },
  });
  return rows.map(({ helpCategory, ...entry }) => ({
    ...(entry as CmsEntryRecord),
    category: helpCategory,
  }));
}
