import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { isValidSku, normalizeSku, skuCheckCharacter, withCheckCharacter } from './skuKit';
import { isValidSkuInWasm, normalizeSkuInWasm, skuCheckInWasm } from './wasmModules';

interface SkuFixture {
  cases: { input: string; normalized: string; valid: boolean; check: string }[];
}

const { cases } = JSON.parse(
  readFileSync(new URL('../fixtures/sku.json', import.meta.url), 'utf8'),
) as SkuFixture;

describe('sku kit', () => {
  it('runs the compiled module in this environment', () => {
    expect(normalizeSkuInWasm('sd-1')).not.toBeNull();
  });

  it('normalizes, validates and checks every fixture case identically', () => {
    for (const item of cases) {
      expect(normalizeSku(item.input), item.input).toBe(item.normalized);
      expect(normalizeSkuInWasm(item.input), item.input).toBe(item.normalized);
      expect(isValidSku(item.normalized), item.input).toBe(item.valid);
      expect(isValidSkuInWasm(item.normalized), item.input).toBe(item.valid);
      if (item.check) {
        const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        expect(skuCheckCharacter(item.normalized), item.input).toBe(item.check);
        expect(alphabet[skuCheckInWasm(item.normalized) ?? -1], item.input).toBe(item.check);
      }
    }
  });

  it('appends a check character to a generated base', () => {
    const sku = withCheckCharacter('SD-4F2A91C7');
    expect(sku).toMatch(/^SD-4F2A91C7-[0-9A-Z]$/);
    expect(sku).toHaveLength(13);
  });
});
