import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { rankDocuments, scoreDocument } from './searchCore';
import { scoreInWasm } from './wasmModules';

interface SearchFixture {
  queries: string[];
  docs: string[];
}

const fixture = JSON.parse(
  readFileSync(new URL('../fixtures/search.json', import.meta.url), 'utf8'),
) as SearchFixture;

describe('search ranking', () => {
  it('runs the compiled module in this environment', () => {
    expect(scoreInWasm('jamdani', 'Jamdani Saree')).not.toBeNull();
  });

  it('scores every fixture pair identically in WebAssembly and TypeScript', () => {
    for (const query of fixture.queries) {
      for (const doc of fixture.docs) {
        expect(scoreInWasm(query, doc), `${query} / ${doc}`).toBe(scoreDocument(query, doc));
      }
    }
  });

  it('ranks exact tokens above prefixes and fuzzy hits', () => {
    const exact = scoreDocument('jamdani', 'Jamdani');
    const prefix = scoreDocument('jam', 'Jamdani Saree');
    const fuzzy = scoreDocument('jamdni', 'Jamdani Saree');
    const miss = scoreDocument('leather', 'Silk Panjabi');

    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(fuzzy);
    expect(fuzzy).toBeGreaterThan(miss);
    expect(miss).toBe(0);
  });

  it('matches a Bangla query against Bangla titles', () => {
    expect(scoreDocument('শাড়ি', 'ঢাকাই শাড়ি')).toBeGreaterThan(
      scoreDocument('শাড়ি', 'Silk Panjabi'),
    );
  });

  it('keeps coverage ahead of a single strong token', () => {
    expect(scoreDocument('jamdani saree', 'Jamdani Saree')).toBeGreaterThan(
      scoreDocument('jamdani saree', 'Jamdani Kurta'),
    );
  });

  it('orders ties by the original position', () => {
    const items = ['Silk Panjabi', 'Silk Saree'];
    expect(rankDocuments('cotton', items, (item) => item)).toEqual(items);
  });
});
