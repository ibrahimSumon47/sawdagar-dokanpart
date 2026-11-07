const DEFAULT_NEXT = '/account';

/**
 * Accepts only an internal path for post-sign-in navigation, so a crafted
 * `next` value cannot turn the form into an open redirect.
 */
export function safeNextPath(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_NEXT;
  // Control characters, whitespace and percent-encoded slashes are how a
  // `//evil.test` value slips past a naive prefix check; decode first, then
  // apply the same rule to the decoded form.
  const decoded = (() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return '\u0000';
    }
  })();
  for (const candidate of [value, decoded]) {
    if (!candidate.startsWith('/')) return DEFAULT_NEXT;
    if (candidate.startsWith('//') || candidate.startsWith('/\\')) return DEFAULT_NEXT;
    if (/[\r\n\t\u0000]/.test(candidate)) return DEFAULT_NEXT;
  }
  return value;
}
