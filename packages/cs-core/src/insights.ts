/**
 * TypeScript port of `python/insights.py`.
 *
 * The Python module is the readable reference: it documents the demand signal
 * in plain steps and is exercised against the shared fixtures in CI. The
 * Seller Center calls this port on every best-seller row.
 */

export type DemandTrend = 'idle' | 'new' | 'stalled' | 'rising' | 'steady' | 'falling';

/** One product's recent unit sales and current stock, in whole units. */
export interface DemandInput {
  units30: number;
  units90: number;
  stock: number;
}

/** What the Seller Center shows next to a product. */
export interface DemandSignal {
  /** Units sold per day, multiplied by 1000 to keep the value an integer. */
  velocityMilli: number;
  /** Recent pace against the 90-day pace: 10000 is flat, 12000 is 20% faster. */
  trendBps: number;
  signal: DemandTrend;
  /** Days the current stock lasts at the 30-day pace, capped at 999. */
  daysOfCover: number;
  /** Units needed to reach 45 days of cover. */
  restockUnits: number;
}

const COVER_CAP_DAYS = 999;
const TARGET_COVER_DAYS = 45;
const RISING_BPS = 12_000;
const FALLING_BPS = 8_000;

function classify(units30: number, units90: number): { signal: DemandTrend; trendBps: number } {
  if (units90 === 0) {
    return { signal: units30 > 0 ? 'new' : 'idle', trendBps: 0 };
  }
  if (units30 === 0) return { signal: 'stalled', trendBps: 0 };

  const trendBps = Math.floor((units30 * 30_000) / units90);
  if (trendBps >= RISING_BPS) return { signal: 'rising', trendBps };
  if (trendBps <= FALLING_BPS) return { signal: 'falling', trendBps };
  return { signal: 'steady', trendBps };
}

/** Turns recent sales and stock into a trend label, cover and restock amount. */
export function demandSignal({ units30, units90, stock }: DemandInput): DemandSignal {
  const velocityMilli = Math.floor((units30 * 1000) / 30);
  const { signal, trendBps } = classify(units30, units90);

  const daysOfCover =
    units30 === 0
      ? stock > 0
        ? COVER_CAP_DAYS
        : 0
      : Math.min(COVER_CAP_DAYS, Math.floor((stock * 30) / units30));

  const targetUnits = Math.ceil((units30 * TARGET_COVER_DAYS) / 30);
  const restockUnits = Math.max(0, targetUnits - stock);

  return { velocityMilli, trendBps, signal, daysOfCover, restockUnits };
}
