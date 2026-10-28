import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { demandSignal, type DemandInput, type DemandSignal } from './insights';

interface InsightsFixture {
  cases: { input: DemandInput; expected: DemandSignal }[];
}

const { cases } = JSON.parse(
  readFileSync(new URL('../fixtures/insights.json', import.meta.url), 'utf8'),
) as InsightsFixture;

describe('demand signal', () => {
  it('matches the Python reference fixtures', () => {
    for (const item of cases) {
      expect(demandSignal(item.input), JSON.stringify(item.input)).toEqual(item.expected);
    }
  });

  it('labels a product with no sales history as idle', () => {
    expect(demandSignal({ units30: 0, units90: 0, stock: 12 }).signal).toBe('idle');
  });

  it('caps days of cover for a product with stock and no recent sales', () => {
    expect(demandSignal({ units30: 0, units90: 12, stock: 12 }).daysOfCover).toBe(999);
  });
});
