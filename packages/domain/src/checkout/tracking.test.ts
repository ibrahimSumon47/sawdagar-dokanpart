import { describe, expect, it } from 'vitest';
import { normalizeTrackingCode, normalizeTrackingContact } from './tracking';

describe('normalizeTrackingContact', () => {
  it('reads a phone the same way checkout does', () => {
    expect(normalizeTrackingContact('01712 345678')).toEqual({
      kind: 'phone',
      value: '+8801712345678',
    });
  });

  it('lower-cases and trims an email', () => {
    expect(normalizeTrackingContact('  Buyer@Example.COM ')).toEqual({
      kind: 'email',
      value: 'buyer@example.com',
    });
  });

  it('rejects values that fit neither shape', () => {
    expect(normalizeTrackingContact('not a contact')).toBeNull();
    expect(normalizeTrackingContact('@broken')).toBeNull();
    expect(normalizeTrackingContact('0123456789')).toBeNull();
  });
});

describe('normalizeTrackingCode', () => {
  it('accepts a code typed in lower case with spaces', () => {
    expect(normalizeTrackingCode(' sd-261105-k7qm ')).toBe('SD-261105-K7QM');
  });

  it('rejects a code with a look-alike character', () => {
    expect(normalizeTrackingCode('SD-261105-K7Q0')).toBeNull();
  });
});
