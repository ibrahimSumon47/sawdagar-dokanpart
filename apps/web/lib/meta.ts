/** Longest meta description Lighthouse and search snippets display without truncation. */
export const META_DESCRIPTION_LIMIT = 160;

/**
 * Collapses whitespace and shortens free text to a search-snippet length,
 * preferring a word boundary and marking a cut with an ellipsis. Product and
 * CMS descriptions are written for the page, so they are often too long to use
 * as a meta description unchanged.
 */
export function metaDescription(text: string, limit = META_DESCRIPTION_LIMIT): string {
  const normalised = text.replace(/\s+/g, ' ').trim();
  if (normalised.length <= limit) return normalised;

  const cut = normalised.slice(0, limit - 1);
  const boundary = cut.lastIndexOf(' ');
  const head = boundary > limit * 0.6 ? cut.slice(0, boundary) : cut;
  return `${head.trimEnd()}…`;
}
