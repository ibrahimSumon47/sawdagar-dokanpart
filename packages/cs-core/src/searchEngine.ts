import { scoreDocument } from './searchCore';
import { getSearchCore, scoreInWasm } from './wasmModules';

/** Which implementation produced the result, shown on the CS lab page. */
export type SearchEngine = 'wasm' | 'typescript';

/** Relevance ordering plus the engine that handled it. */
export interface RankResult<T> {
  items: T[];
  engine: SearchEngine;
}

/**
 * Re-ranks catalog matches: WebAssembly first, the TypeScript port when the
 * module or the runtime is unavailable. Ties keep their original order.
 */
export function rankCatalogMatches<T>(
  query: string,
  items: readonly T[],
  textOf: (item: T) => string,
): RankResult<T> {
  const trimmed = query.trim();
  const wasmAvailable = getSearchCore() !== null && scoreInWasm(trimmed, trimmed) !== null;

  if (trimmed.length === 0 || items.length === 0) {
    return { items: [...items], engine: wasmAvailable ? 'wasm' : 'typescript' };
  }

  const scored = items.map((item, index) => ({
    item,
    index,
    score:
      (wasmAvailable ? scoreInWasm(trimmed, textOf(item)) : null) ??
      scoreDocument(trimmed, textOf(item)),
  }));

  scored.sort((a, b) => b.score - a.score || a.index - b.index);

  return {
    items: scored.map((entry) => entry.item),
    engine: wasmAvailable ? 'wasm' : 'typescript',
  };
}
