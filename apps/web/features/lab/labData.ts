import {
  demandSignal,
  planSettlement,
  scoreDocument,
  scoreInWasm,
  skuCheckCharacter,
  normalizeSku,
  isValidSku,
} from '@sd/cs-core';
import type { DemandInput } from '@sd/cs-core';

/** One query/document pair scored by both implementations. */
export interface ScoreRow {
  query: string;
  doc: string;
  wasm: number | null;
  port: number;
}

const scoreSamples: [string, string][] = [
  ['jamdani', 'Jamdani Saree'],
  ['jamdni', 'Jamdani Saree'],
  ['jam', 'Jamdani Saree'],
  ['শাড়ি', 'ঢাকাই শাড়ি'],
  ['cotton kurta', 'Cotton Kurta'],
  ['leather', 'Silk Panjabi'],
];

export const scoreRows: ScoreRow[] = scoreSamples.map(([query, doc]) => ({
  query,
  doc,
  wasm: scoreInWasm(query, doc),
  port: scoreDocument(query, doc),
}));

/** One SKU through normalization, validation and the check character. */
export interface SkuRow {
  input: string;
  normalized: string;
  valid: boolean;
  check: string;
}

const skuSamples = [' sd - 0001/1 ', 'sd/0002/2', 'XX-0001-1', 'এসডি-১'];

export const skuRows: SkuRow[] = skuSamples.map((input) => {
  const normalized = normalizeSku(input);
  return {
    input,
    normalized,
    valid: isValidSku(normalized),
    check: skuCheckCharacter(normalized),
  };
});

/** One demand signal example. */
export interface InsightRow {
  units30: number;
  units90: number;
  stock: number;
  signal: string;
  daysOfCover: number;
  restockUnits: number;
}

const insightSamples: DemandInput[] = [
  { units30: 12, units90: 30, stock: 4 },
  { units30: 30, units90: 90, stock: 2 },
  { units30: 6, units90: 90, stock: 40 },
  { units30: 5, units90: 0, stock: 0 },
];

export const insightRows: InsightRow[] = insightSamples.map((input) => {
  const signal = demandSignal(input);
  return {
    ...input,
    signal: signal.signal,
    daysOfCover: signal.daysOfCover,
    restockUnits: signal.restockUnits,
  };
});

/** One settlement run over a small payout queue. */
export interface SettlementRow {
  amountMinor: number;
  status: 'paid' | 'carried';
}

const settlementSamples = [150_000, 99_999, 100_000, 123_456];

export const settlementRows: SettlementRow[] = settlementSamples.map((amountMinor) => ({
  amountMinor,
  status: amountMinor >= 100_000 ? 'paid' : 'carried',
}));

export const settlementRun = planSettlement(
  settlementSamples.map((amountPoisha, index) => ({ id: `sample-${index}`, amountPoisha })),
);
