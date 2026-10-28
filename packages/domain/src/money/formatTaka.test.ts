import { describe, expect, it } from 'vitest';
import { formatTaka, toBanglaDigits } from './formatTaka';

describe('formatTaka', () => {
  it('groups whole taka amounts in the South Asian style', () => {
    expect(formatTaka(1_250_000)).toBe('৳12,500');
    expect(formatTaka(12_500_000)).toBe('৳1,25,000');
  });

  it('keeps poisha when the amount is not a whole taka', () => {
    expect(formatTaka(1_899_50)).toBe('৳1,899.50');
  });

  it('uses Bengali numerals for the Bangla locale', () => {
    expect(formatTaka(1_250_000, 'bn')).toBe('৳১২,৫০০');
    expect(formatTaka(12_500_000, 'bn')).toBe('৳১,২৫,০০০');
  });

  it('rejects negative and fractional poisha values', () => {
    expect(() => formatTaka(-1)).toThrow(RangeError);
    expect(() => formatTaka(10.5)).toThrow(RangeError);
  });
});

describe('toBanglaDigits', () => {
  it('converts only digits and leaves separators intact', () => {
    expect(toBanglaDigits('1,25,000.50')).toBe('১,২৫,০০০.৫০');
    expect(toBanglaDigits('ঢাকা 1207')).toBe('ঢাকা ১২০৭');
  });
});
