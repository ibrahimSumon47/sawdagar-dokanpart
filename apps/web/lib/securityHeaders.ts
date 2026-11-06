/** A response header as Next.js expects it in `headers()`. */
export interface SecurityHeader {
  key: string;
  value: string;
}

/**
 * Content Security Policy for every page.
 *
 * Scripts allow `'unsafe-inline'` because Next.js writes its hydration payload
 * inline and the JSON-LD blocks rely on it; nonces would force every page to
 * render dynamically and lose the static product pages. There is no `eval`,
 * and every third-party host is named, so an injected script cannot load code
 * from anywhere else. Review photos are stored as data URLs, hence `data:` in
 * `img-src`, and Cloudinary serves product and cover images.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.cloudinary.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/**
 * Headers added to every route.
 *
 * HSTS asks browsers to use HTTPS for a year, including subdomains. The
 * Permissions-Policy turns off features the store never uses, so a compromised
 * script cannot switch on the camera or microphone.
 */
export const SECURITY_HEADERS: readonly SecurityHeader[] = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
];
