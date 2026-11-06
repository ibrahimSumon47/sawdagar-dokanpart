import type { Metadata } from 'next';

/** Longest meta description Lighthouse and search snippets display without truncation. */
export const META_DESCRIPTION_LIMIT = 160;

interface PublicPageMetadataInput {
  title: string;
  description?: string | null;
  /** Path of the page, for example `/help/returns`. Resolved against `metadataBase`. */
  path: string;
}

/**
 * Builds the canonical, Open Graph and Twitter fields for a public page. The
 * root layout's Open Graph block is replaced by any page that sets its own, so
 * each page must state its own URL and title. Otherwise every page would share
 * the home page's URL in social previews.
 */
export function publicPageMetadata({
  title,
  description,
  path,
}: PublicPageMetadataInput): Metadata {
  const summary = description ? metaDescription(description) : undefined;
  return {
    title,
    description: summary,
    alternates: { canonical: path },
    openGraph: { type: 'website', title, description: summary, url: path },
    twitter: { card: 'summary_large_image', title, description: summary },
  };
}

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
