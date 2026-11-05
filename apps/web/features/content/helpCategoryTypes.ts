/** Editable fields of a Help Center category. */
export interface HelpCategorySnapshot {
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string | null;
  descriptionBn: string | null;
}

/** The language a visitor reads a category name in. */
export type CategoryLanguage = 'en' | 'bn';

/** Picks the visitor's language, falling back to the other one when it is empty. */
export function categoryName(
  category: { nameEn: string; nameBn: string },
  language: CategoryLanguage,
): string {
  if (language === 'bn') return category.nameBn.trim() || category.nameEn;
  return category.nameEn.trim() || category.nameBn;
}
