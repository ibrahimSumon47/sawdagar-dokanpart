const DEFAULT_NEXT = '/account';

/**
 * Accepts only an internal path for post-sign-in navigation, so a crafted
 * `next` value cannot turn the form into an open redirect.
 */
export function safeNextPath(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_NEXT;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return DEFAULT_NEXT;
  }
  if (/[\r\n]/.test(value)) return DEFAULT_NEXT;
  return value;
}
