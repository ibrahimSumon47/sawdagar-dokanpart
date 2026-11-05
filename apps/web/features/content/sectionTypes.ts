/** Homepage blocks an editor can add, reorder and schedule in the CMS. */
export const sectionKinds = ['hero', 'collections', 'banner'] as const;

/** A homepage section type: the opening hero, a collection teaser or a banner. */
export type SectionKind = (typeof sectionKinds)[number];

/** Lifecycle of a section. Archived sections stay in the list but never render. */
export const sectionStatuses = ['draft', 'scheduled', 'published', 'archived'] as const;

/** One of the four section states an editor can choose. */
export type SectionStatus = (typeof sectionStatuses)[number];

/** Bilingual copy and optional link carried by a homepage section. */
export interface SectionSnapshot {
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  imageUrl: string | null;
  ctaLabelEn: string | null;
  ctaLabelBn: string | null;
  ctaHref: string | null;
}

/** Narrows an untrusted value to a section kind. */
export function isSectionKind(value: unknown): value is SectionKind {
  return typeof value === 'string' && (sectionKinds as readonly string[]).includes(value);
}
