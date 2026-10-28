/** The three content areas the admin CMS edits. */
export const contentKinds = ['page', 'help', 'journal'] as const;

export type ContentKind = (typeof contentKinds)[number];

/** Narrows a route parameter or form value to a content area. */
export function isContentKind(value: unknown): value is ContentKind {
  return typeof value === 'string' && (contentKinds as readonly string[]).includes(value);
}

/** Draft, scheduled for a future date, or visible now. */
export const contentStatuses = ['draft', 'scheduled', 'published'] as const;

export type ContentStatus = (typeof contentStatuses)[number];

/** Editable fields copied into a version snapshot. */
export interface ContentSnapshot {
  titleEn: string;
  titleBn: string;
  excerptEn: string | null;
  excerptBn: string | null;
  bodyEn: string;
  bodyBn: string;
  seoTitleEn: string | null;
  seoTitleBn: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionBn: string | null;
}
