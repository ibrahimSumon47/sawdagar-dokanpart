import { describe, expect, it } from 'vitest';
import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from './securityHeaders';

/** Looks up one header value by name, so tests do not depend on list order. */
function headerValue(key: string): string | undefined {
  return SECURITY_HEADERS.find((header) => header.key === key)?.value;
}

describe('SECURITY_HEADERS', () => {
  it('forbids framing and MIME sniffing', () => {
    expect(headerValue('X-Frame-Options')).toBe('DENY');
    expect(headerValue('X-Content-Type-Options')).toBe('nosniff');
  });

  it('sends HSTS for a year including subdomains', () => {
    expect(headerValue('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
  });

  it('ships the CSP header with the same policy string', () => {
    expect(headerValue('Content-Security-Policy')).toBe(CONTENT_SECURITY_POLICY);
  });
});

describe('CONTENT_SECURITY_POLICY', () => {
  it('blocks plugins, base-tag injection and foreign form posts', () => {
    expect(CONTENT_SECURITY_POLICY).toContain("object-src 'none'");
    expect(CONTENT_SECURITY_POLICY).toContain("base-uri 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("form-action 'self'");
  });

  it('defaults every resource type to same-origin and names only Cloudinary', () => {
    expect(CONTENT_SECURITY_POLICY.startsWith("default-src 'self'")).toBe(true);
    expect(CONTENT_SECURITY_POLICY).not.toMatch(/\*/);
    expect(CONTENT_SECURITY_POLICY).toContain('https://res.cloudinary.com');
  });
});
