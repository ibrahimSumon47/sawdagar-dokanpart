import { describe, expect, it } from 'vitest';
import { safeNextPath } from './safeNextPath';

describe('safeNextPath', () => {
  it('keeps internal destinations', () => {
    expect(safeNextPath('/account')).toBe('/account');
    expect(safeNextPath('/seller?tab=team')).toBe('/seller?tab=team');
  });

  it('rejects protocol-relative and absolute destinations', () => {
    expect(safeNextPath('//evil.example')).toBe('/account');
    expect(safeNextPath('/\\evil.example')).toBe('/account');
    expect(safeNextPath('https://evil.example')).toBe('/account');
  });

  it('falls back for empty or malformed values', () => {
    expect(safeNextPath(undefined)).toBe('/account');
    expect(safeNextPath('/account\r\nLocation: https://evil.example')).toBe('/account');
  });
});
