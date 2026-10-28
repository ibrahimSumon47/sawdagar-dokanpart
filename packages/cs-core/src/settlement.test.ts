import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { planSettlement, wholeTaka } from './settlement';

interface SettlementFixture {
  cases: {
    minimumPoisha: number;
    amounts: number[];
    expected: { count: number; paidPoisha: number; carriedPoisha: number };
  }[];
}

const { cases } = JSON.parse(
  readFileSync(new URL('../fixtures/settlement.json', import.meta.url), 'utf8'),
) as SettlementFixture;

describe('settlement run', () => {
  it('matches the Java reference fixtures', () => {
    for (const item of cases) {
      const requests = item.amounts.map((amountPoisha, index) => ({
        id: `payout-${index}`,
        amountPoisha,
      }));
      const run = planSettlement(requests, item.minimumPoisha);
      expect(
        { count: run.count, paidPoisha: run.paidPoisha, carriedPoisha: run.carriedPoisha },
        JSON.stringify(item.amounts),
      ).toEqual(item.expected);
    }
  });

  it('rounds down to whole taka', () => {
    expect(wholeTaka(123_456)).toBe(123_400);
    expect(wholeTaka(123_400)).toBe(123_400);
    expect(wholeTaka(0)).toBe(0);
  });

  it('reports which payouts the run would pay', () => {
    const run = planSettlement([
      { id: 'below', amountPoisha: 50_000 },
      { id: 'above', amountPoisha: 120_000 },
    ]);
    expect(run.paidIds).toEqual(['above']);
  });
});
