# CS fundamentals

Four small modules sit behind the storefront, each written twice: once in the language that shows the idea clearly, and once in the implementation the running site uses. This page explains what problem each one solves, how the algorithm works and where the code lives. Live output is at `/cs-lab`; the shared expectations are in `packages/cs-core/fixtures/`.

| Module | Shown in | Runs in the product as | Used by |
|---|---|---|---|
| search-core | C++ compiled to WebAssembly | same compiled module, TypeScript port as fallback | `/catalog` search ordering |
| sku-kit | C compiled to WebAssembly | same compiled module, TypeScript port as fallback | new product SKUs |
| insights | Python reference | TypeScript port | seller analytics demand column |
| settlement | Java reference | TypeScript port | admin finance settlement preview |

The Python and Java modules are not deployed. The site runs on Node, no free host was verified for those runtimes, and adding a service for a pure function would be worse engineering than porting four rules. They stay in the repository as readable references, are run by CI on every push, and must agree with the fixtures the TypeScript ports are tested against.

## search-core — relevance ranking (C++ → WebAssembly)

**Problem.** PostgreSQL returns matching rows in insertion order. That is fine for browsing and wrong for a search box: "jamdani" should put *Jamdani Saree* above *Katan Silk Saree with Jamdani Border*, or at least above unrelated rows that only match because a category name contains the word.

**How it works.**

1. **Tokenize.** The input is UTF-8 bytes. A byte is a separator when it is whitespace or an ASCII punctuation character, so every byte at or above `0x80` is part of a token. That keeps Bangla words intact without a Unicode table, and only ASCII letters are lowercased.
2. **Score each query token against the best document token.** Four weights, in order: exact token `1000`, document token starts with the query token `700`, query token starts with the document token `400`, and a fuzzy hit `300` when the tokens are at most one edit apart. A plain substring scores `250`.
3. **Edit distance.** Optimal string alignment distance — Levenshtein plus adjacent transposition — with a cap of one. A row whose minimum exceeds the cap stops the calculation early. That is the whole typo-tolerance story: `jamdni` finds `jamdani`, `leathr` finds `leather`.
4. **Coverage.** The summed token score is multiplied by `matched query tokens / query tokens`, so a document matching two of two query tokens beats one that matches a single token extremely well.
5. **Phrase bonus.** After normalization (lowercase, separators collapsed to one space), a document that starts with the query gets `1500`, one that contains it gets `500`.
6. **Integer scores.** Every value is an `int32`. Floating point would let the compiled module and the port drift apart on the last decimal, and the parity test would become a tolerance test.

**Complexity.** For `q` query tokens and `d` document tokens: `O(q · d · L²)` where `L` is the capped token length (32 bytes). The fuzzy comparison is the expensive part, so it only runs for tokens of at least four characters.

**Implementation notes.** The module is freestanding: no libc, no allocator, a 1 MiB static bump buffer exported as `alloc`/`reset`. It is 2.7 KB of WASM. `rank` writes nothing to the heap, so a failed call cannot corrupt the next one.

**Code.** [search_core.cpp](../packages/cs-core/native/search_core.cpp), [searchCore.ts](../packages/cs-core/src/searchCore.ts), [searchEngine.ts](../packages/cs-core/src/searchEngine.ts), [queries.ts](../apps/web/features/catalog/queries.ts).

## sku-kit — SKU normalization and check character (C → WebAssembly)

**Problem.** A vendor types ` sd - 0001/1 `, a colleague types `SD-0001-1`, and both must be the same SKU. A paste from a courier sheet can lose a character, and a wrong SKU reaches the inventory without anything detecting it.

**How it works.**

1. **Normalize as a state machine.** Walk the bytes. An ASCII letter or digit is uppercased and written; every other byte only arms one pending dash, so runs of separators collapse and no dash appears at either end. The result is capped at 24 characters.
2. **Validate.** A SKU starts with `SD-`, is 6 to 24 characters long, uses only `A-Z`, digits and single dashes, and does not end with a dash.
3. **Check character.** Value each character (`0-9` → 0–9, `A-Z` → 10–35, `-` → 36), multiply by its 1-based position, sum, take modulo 36 and index `0-9A-Z`. One changed or swapped character changes the result, so `SD-0001-1` ends in `Y` and `SD-0001-2` does not.

**Why C.** It is 1.1 KB, has no libc and no heap growth beyond a 64 KiB buffer. The module exists to show the raw WASM boundary: three exported functions, caller-owned buffers, no glue library.

**Code.** [sku_kit.c](../packages/cs-core/native/sku_kit.c), [skuKit.ts](../packages/cs-core/src/skuKit.ts), [productActions.ts](../apps/web/features/seller/productActions.ts).

## insights — demand signal (Python reference)

**Problem.** A best-seller table that only counts units hides the decision: a product with 12 sales this month and 30 in the quarter is accelerating, while one with 6 sales and 90 in the quarter has stalled, and the stock needed is different in each case.

**How it works.** All arithmetic is integer, so Python and TypeScript cannot disagree:

- velocity = `units30 * 1000 // 30` (thousandths of a unit per day);
- trend = `units30 * 30_000 // units90` basis points, where `10000` is the same pace as the quarter;
- label: `rising` at or above `12000`, `falling` at or below `8000`, `steady` between them, plus `new` (no quarter sales yet), `stalled` (quarter sales, none this month) and `idle`;
- days of cover = `stock * 30 // units30`, capped at 999, or 999 when there is stock and no sales;
- restock = units needed to reach 45 days of cover.

**Code.** [insights.py](../packages/cs-core/python/insights.py), [insights.ts](../packages/cs-core/src/insights.ts), fixtures in [insights.json](../packages/cs-core/fixtures/insights.json).

## settlement — payout run (Java reference)

**Problem.** A payout queue is not a sum. It pays the requests that reach the minimum, in whole taka, and carries the rounded poisha plus everything below the minimum into the next run. Two implementations of that rule must agree before finance trusts a preview.

**How it works.** Iterate the queue in request order. Below the minimum, add the amount to `carried`. Otherwise round down to the nearest 100 poisha, add the whole amount to `paid`, add the remainder to `carried`, and count the payment. The Java class and the TypeScript port return the same three numbers for the five fixtures, including a queue that pays nothing.

**Code.** [Settlement.java](../packages/cs-core/java/Settlement.java), [settlement.ts](../packages/cs-core/src/settlement.ts), fixtures in [settlement.json](../packages/cs-core/fixtures/settlement.json).

## How the modules are tested

- `packages/cs-core/src/*.test.ts` (15 tests) loads the compiled WASM, checks every fixture and asserts the port returns identical results. Search runs the full query × document matrix from `fixtures/search.json`, including Bangla pairs.
- `scripts/check-reference-modules.mjs` runs `insights.py` over its fixtures and compiles plus runs `Settlement.java` for each settlement case. CI runs it with `--require`, so a missing toolchain fails the build; locally it reports the skip.
- `scripts/build-wasm.mjs` recompiles both modules with clang and rewrites the base64 TypeScript modules in `packages/cs-core/generated`. The artifacts are committed so install, test and deploy never need a compiler.

## Limits

- Tokenization is byte-based. It does not normalize Unicode forms, fold Bangla case (Bangla has none) or stem words, and it caps tokens at 32 bytes.
- The ranker reorders at most 120 matches, which covers every demo search; a larger result set falls back to database order rather than showing a truncated ranking.
- The Python and Java modules are references, not services. They are exercised by CI, not by a request.
- Compiled WASM is regenerated by hand. CI tests the committed bytes; it does not rebuild them.
