import { mediaCredits } from './mediaCredits';

/** A department photograph and the crop that suits a given product. */
export interface DepartmentPhoto {
  src: string;
  alt: string;
  objectPosition: string;
}

const bySlug = new Map(mediaCredits.map((credit) => [credit.slug, credit]));
const crops = ['50% 42%', '50% 58%', '50% 50%'] as const;

function seedValue(seed: string): number {
  let value = 7;
  for (const character of seed) {
    value = (value * 31 + character.charCodeAt(0)) % 997;
  }
  return value;
}

/**
 * Picks the representative photograph for a department. Products share one
 * department photo, and the crop shifts per product so a grid does not repeat
 * the same framing. Returns null when a department has no licensed photo.
 */
export function departmentPhoto(
  departmentSlug: string | undefined,
  seed: string,
): DepartmentPhoto | null {
  if (!departmentSlug) return null;
  const credit = bySlug.get(departmentSlug);
  if (!credit) return null;

  return {
    src: credit.file,
    alt: `${credit.label} photograph`,
    objectPosition: crops[seedValue(seed) % crops.length] ?? '50% 50%',
  };
}
