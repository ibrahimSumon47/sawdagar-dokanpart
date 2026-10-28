import { describe, expect, it } from 'vitest';
import { dictionaries, getDictionary, isLocale } from './index';

function collectEntries(value: unknown, path = ''): [string, unknown][] {
  if (typeof value !== 'object' || value === null) return [[path, value]];
  return Object.entries(value).flatMap(([key, child]) =>
    collectEntries(child, path ? `${path}.${key}` : key),
  );
}

describe('message catalogs', () => {
  it('has the same keys in English and Bangla', () => {
    const englishKeys = collectEntries(dictionaries.en).map(([key]) => key);
    const banglaKeys = collectEntries(dictionaries.bn).map(([key]) => key);

    expect(banglaKeys).toEqual(englishKeys);
  });

  it('has no empty strings or arrays in either language', () => {
    for (const dictionary of Object.values(dictionaries)) {
      for (const [key, value] of collectEntries(dictionary)) {
        if (typeof value === 'string') expect(value.trim(), key).not.toBe('');
        if (Array.isArray(value)) expect(value.length, key).toBeGreaterThan(0);
      }
    }
  });

  it('writes Bangla copy in Bengali script', () => {
    const banglaStrings = collectEntries(dictionaries.bn).flatMap(([, value]) =>
      typeof value === 'string' ? [value] : [],
    );
    const withScript = banglaStrings.filter((value) => /[\u0980-\u09FF]/.test(value));

    expect(withScript.length).toBeGreaterThan(20);
  });

  it('formats sentence templates in the requested language', () => {
    expect(dictionaries.en.design.ratingLabel('4.8', 64)).toContain('Rated 4.8 out of 5');
    expect(dictionaries.bn.design.ratingLabel('৪.৮', 64)).toContain('রেটিং');
  });

  it('narrows supported locales only', () => {
    expect(isLocale('bn')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(getDictionary('en')).toBeTypeOf('object');
  });
});
