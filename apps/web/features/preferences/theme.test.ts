import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, isTheme } from './theme';

describe('theme guard', () => {
  it('accepts only the two supported themes', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('system')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it('defaults to light', () => {
    expect(DEFAULT_THEME).toBe('light');
  });
});
