import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

const date = new Date('2026-10-28T12:00:00Z');

describe('formatDate', () => {
  it('uses an English date for the English locale', () => {
    expect(formatDate(date, 'en')).toBe('28 Oct 2026');
  });

  it('uses Bengali digits for the Bangla locale', () => {
    expect(formatDate(date, 'bn')).toMatch(/[০-৯]/);
  });
});
