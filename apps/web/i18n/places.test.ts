import { districts, divisions } from '@sd/domain';
import { describe, expect, it } from 'vitest';
import { placeName } from './places';

describe('Bangladesh place names', () => {
  it('localizes every configured division and district while preserving English identifiers', () => {
    for (const name of [...districts, ...divisions.map((division) => division.name)]) {
      expect(placeName(name, 'bn'), name).toMatch(/[\u0980-\u09ff]/);
      expect(placeName(name, 'en')).toBe(name);
    }
    expect(placeName('Bangladesh', 'bn')).toBe('বাংলাদেশ');
    expect(placeName("Cox's Bazar", 'bn')).toBe('কক্সবাজার');
  });

  it('leaves unrecognized user-entered values unchanged', () => {
    expect(placeName('Custom place', 'bn')).toBe('Custom place');
    expect(placeName('constructor', 'bn')).toBe('constructor');
  });
});
