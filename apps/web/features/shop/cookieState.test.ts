import { describe, expect, it } from 'vitest';
import {
  COMPARE_LIMIT,
  parseCompareIds,
  serialiseCompareIds,
  toggleCompareId,
} from './cookieState';

describe('compare cookie', () => {
  it('reads valid unique ids and drops invalid values', () => {
    expect(parseCompareIds(undefined)).toEqual([]);
    expect(parseCompareIds('not json')).toEqual([]);
    expect(parseCompareIds('{"id":"prd_1"}')).toEqual([]);
    expect(parseCompareIds(JSON.stringify(['prd_1', 'prd_1', '../../etc', 12, 'prd_2']))).toEqual([
      'prd_1',
      'prd_2',
    ]);
  });

  it('caps the list at four products', () => {
    const ids = ['prd_1', 'prd_2', 'prd_3', 'prd_4', 'prd_5'];
    expect(parseCompareIds(JSON.stringify(ids))).toHaveLength(COMPARE_LIMIT);
    expect(serialiseCompareIds(ids)).toBe(JSON.stringify(ids.slice(0, COMPARE_LIMIT)));
  });

  it('adds, removes and refuses a fifth product', () => {
    expect(toggleCompareId([], 'prd_1')).toEqual({
      ids: ['prd_1'],
      added: true,
      limitReached: false,
    });
    expect(toggleCompareId(['prd_1', 'prd_2'], 'prd_1')).toEqual({
      ids: ['prd_2'],
      added: false,
      limitReached: false,
    });

    const full = ['prd_1', 'prd_2', 'prd_3', 'prd_4'];
    expect(toggleCompareId(full, 'prd_5')).toEqual({
      ids: full,
      added: false,
      limitReached: true,
    });
  });
});
