import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'p',
  'br',
  'hr',
  'h2',
  'h3',
  'strong',
  'em',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'a',
];

const options: sanitizeHtml.IOptions = {
  allowedTags,
  allowedAttributes: { a: ['href', 'title', 'rel'] },
  allowedSchemes: ['https', 'mailto'],
  // A Journal post already has the page h1, so a pasted h1 becomes a section heading.
  transformTags: {
    h1: 'h2',
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

/**
 * Cleans HTML produced by the Journal editor before it is stored or rendered: only the tags the
 * editor can create survive, links keep their address and gain `rel`, and scripts, styles,
 * iframes, images and event handlers are dropped.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, options).trim();
}

/** True when the HTML still holds visible text, so an empty editor cannot be saved. */
export function hasRichTextContent(html: string): boolean {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim().length > 0;
}
