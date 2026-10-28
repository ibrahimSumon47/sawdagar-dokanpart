/**
 * TypeScript port of the native search ranker in `native/search_core.cpp`.
 *
 * Both implementations tokenize UTF-8 bytes, score token matches with the same
 * fixed weights and add the same whole-phrase bonus, so the catalog gets the
 * same order whether WebAssembly runs or the port takes over. Any change here
 * needs the matching change in the C++ file.
 */

const MAX_TOKENS = 64;
const MAX_TOKEN_BYTES = 32;
const MAX_DISTANCE = 1;

const DELIMITER_CODES = new Set(
  [
    ',',
    '.',
    '/',
    '\\',
    '-',
    '_',
    '+',
    '&',
    '|',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    "'",
    '"',
    ':',
    ';',
    '!',
    '?',
    '*',
    '#',
    '@',
    '$',
    '%',
    '^',
    '~',
    '=',
  ].map((character) => character.charCodeAt(0)),
);

const encoder = new TextEncoder();

function isDelimiter(code: number): boolean {
  return code <= 0x20 || DELIMITER_CODES.has(code);
}

function toLowerAscii(code: number): number {
  return code >= 0x41 && code <= 0x5a ? code + 32 : code;
}

/** Splits UTF-8 bytes into lowercased tokens, truncating long ones at 32 bytes. */
export function tokenize(input: Uint8Array): Uint8Array[] {
  const tokens: Uint8Array[] = [];
  let index = 0;

  while (index < input.length && tokens.length < MAX_TOKENS) {
    if (isDelimiter(input[index] ?? 0)) {
      index += 1;
      continue;
    }
    const start = index;
    while (index < input.length && !isDelimiter(input[index] ?? 0)) {
      index += 1;
    }
    const slice = input.subarray(start, Math.min(index, start + MAX_TOKEN_BYTES));
    const token = new Uint8Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      token[i] = toLowerAscii(slice[i] ?? 0);
    }
    tokens.push(token);
  }

  return tokens;
}

function startsWithBytes(haystack: Uint8Array, needle: Uint8Array): boolean {
  if (needle.length > haystack.length) return false;
  for (let i = 0; i < needle.length; i += 1) {
    if (haystack[i] !== needle[i]) return false;
  }
  return true;
}

function equalsBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function containsBytes(haystack: Uint8Array, needle: Uint8Array): boolean {
  if (needle.length === 0 || needle.length > haystack.length) return false;
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    if (startsWithBytes(haystack.subarray(start), needle)) return true;
  }
  return false;
}

/** Caps both strings the way the native tokenizer does before comparing. */
function boundedDistance(a: Uint8Array, b: Uint8Array, limit: number): number {
  const left = a.subarray(0, MAX_TOKEN_BYTES);
  const right = b.subarray(0, MAX_TOKEN_BYTES);
  const width = right.length;

  let beforePrevious = Array.from({ length: width + 1 }, (_, index) => index);
  let previous = [...beforePrevious];
  let current = new Array<number>(width + 1).fill(0);

  for (let i = 1; i <= left.length; i += 1) {
    current[0] = i;
    let rowMinimum = i;
    for (let j = 1; j <= width; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      let value = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost,
      );
      if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) {
        value = Math.min(value, (beforePrevious[j - 2] ?? 0) + 1);
      }
      current[j] = value;
      rowMinimum = Math.min(rowMinimum, value);
    }
    if (rowMinimum > limit) return limit + 1;
    beforePrevious = previous;
    previous = current;
    current = new Array<number>(width + 1).fill(0);
  }

  return previous[width] ?? left.length;
}

function tokenScore(query: Uint8Array, doc: Uint8Array): number {
  if (equalsBytes(query, doc)) return 1000;
  if (query.length >= 2 && doc.length > query.length && startsWithBytes(doc, query)) return 700;
  if (doc.length >= 2 && query.length > doc.length && startsWithBytes(query, doc)) return 400;
  if (
    query.length >= 4 &&
    doc.length >= 4 &&
    boundedDistance(query, doc, MAX_DISTANCE) <= MAX_DISTANCE
  ) {
    return 300;
  }
  if (containsBytes(doc, query) || containsBytes(query, doc)) return 250;
  return 0;
}

function normalizePhrase(input: Uint8Array): Uint8Array {
  const output: number[] = [];
  let pendingSpace = false;

  for (const code of input) {
    if (isDelimiter(code)) {
      pendingSpace = output.length > 0;
      continue;
    }
    if (pendingSpace) {
      output.push(0x20);
      pendingSpace = false;
    }
    output.push(toLowerAscii(code));
  }

  return Uint8Array.from(output);
}

/** Scores one document against one query. Zero means no token matched. */
export function scoreDocument(query: string, doc: string): number {
  const queryBytes = encoder.encode(query);
  const docBytes = encoder.encode(doc);
  const queryTokens = tokenize(queryBytes);
  const docTokens = tokenize(docBytes);
  if (queryTokens.length === 0 || docTokens.length === 0) return 0;

  let score = 0;
  let matched = 0;
  for (const queryToken of queryTokens) {
    let best = 0;
    for (const docToken of docTokens) {
      best = Math.max(best, tokenScore(queryToken, docToken));
    }
    if (best > 0) {
      matched += 1;
      score += best;
    }
  }
  if (matched === 0) return 0;

  score = Math.floor((score * matched) / queryTokens.length);

  const docPhrase = normalizePhrase(docBytes);
  const queryPhrase = normalizePhrase(queryBytes);
  if (docPhrase.length > 0 && queryPhrase.length > 0) {
    if (startsWithBytes(docPhrase, queryPhrase)) {
      score += 1500;
    } else if (containsBytes(docPhrase, queryPhrase)) {
      score += 500;
    }
  }

  return score;
}

/** Stable relevance order: score descending, then the original index. */
export function rankDocuments<T>(
  query: string,
  items: readonly T[],
  textOf: (item: T) => string,
): T[] {
  return items
    .map((item, index) => ({ item, index, score: scoreDocument(query, textOf(item)) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.item);
}
