import { describe, expect, it } from 'vitest';
import { formatOrderNumber, formatSubOrderNumber } from './orderNumber';

describe('order numbers', () => {
  it('formats a UTC date and an upper-case suffix', () => {
    expect(formatOrderNumber(new Date('2026-10-28T23:30:00.000Z'), '7f3a9c')).toBe(
      'SD-20261028-7F3A9C',
    );
  });

  it('rejects a suffix that could not be part of a safe number', () => {
    expect(() => formatOrderNumber(new Date(), 'ab')).toThrow(RangeError);
    expect(() => formatOrderNumber(new Date(), 'abcd-ef')).toThrow(RangeError);
  });

  it('appends a two-digit seller sequence', () => {
    expect(formatSubOrderNumber('SD-20261028-7F3A9C', 1)).toBe('SD-20261028-7F3A9C-01');
    expect(() => formatSubOrderNumber('SD-20261028-7F3A9C', 100)).toThrow(RangeError);
  });
});
