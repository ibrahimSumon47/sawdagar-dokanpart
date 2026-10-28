import { Buffer } from 'node:buffer';

import { searchCoreWasmBase64 } from '../generated/searchCoreWasm';
import { skuKitWasmBase64 } from '../generated/skuKitWasm';

/** Exports of `native/search_core.cpp` after instantiation. */
interface SearchCoreExports {
  memory: WebAssembly.Memory;
  alloc(size: number): number;
  reset(): void;
  rank(docPtr: number, docLen: number, queryPtr: number, queryLen: number): number;
}

/** Exports of `native/sku_kit.c` after instantiation. */
interface SkuKitExports {
  memory: WebAssembly.Memory;
  alloc(size: number): number;
  reset(): void;
  sku_normalize(inPtr: number, inLen: number, outPtr: number): number;
  sku_valid(ptr: number, len: number): number;
  sku_check(ptr: number, len: number): number;
}

const encoder = new TextEncoder();

function compile<T>(base64: string): T | null {
  try {
    const module = new WebAssembly.Module(Buffer.from(base64, 'base64'));
    return new WebAssembly.Instance(module, {}).exports as unknown as T;
  } catch {
    return null;
  }
}

let searchCore: SearchCoreExports | null | undefined;
let skuKit: SkuKitExports | null | undefined;

/** Loads the compiled ranker once; null means "use the TypeScript port". */
export function getSearchCore(): SearchCoreExports | null {
  if (searchCore === undefined) searchCore = compile<SearchCoreExports>(searchCoreWasmBase64);
  return searchCore;
}

/** Loads the compiled SKU kit once; null means "use the TypeScript port". */
export function getSkuKit(): SkuKitExports | null {
  if (skuKit === undefined) skuKit = compile<SkuKitExports>(skuKitWasmBase64);
  return skuKit;
}

/** Scores one pair in WebAssembly; null when the module could not load. */
export function scoreInWasm(query: string, doc: string): number | null {
  const core = getSearchCore();
  if (!core) return null;
  try {
    const docBytes = encoder.encode(doc);
    const queryBytes = encoder.encode(query);
    core.reset();
    const docPointer = core.alloc(docBytes.length);
    const queryPointer = core.alloc(queryBytes.length);
    if (docPointer < 0 || queryPointer < 0) return null;
    new Uint8Array(core.memory.buffer, docPointer, docBytes.length).set(docBytes);
    new Uint8Array(core.memory.buffer, queryPointer, queryBytes.length).set(queryBytes);
    return core.rank(docPointer, docBytes.length, queryPointer, queryBytes.length);
  } catch {
    return null;
  }
}

/** Normalizes a SKU in WebAssembly; null when the module could not load. */
export function normalizeSkuInWasm(input: string): string | null {
  const kit = getSkuKit();
  if (!kit) return null;
  try {
    const bytes = encoder.encode(input);
    const total = Math.max(bytes.length, 24) + 2;
    kit.reset();
    const inputPointer = kit.alloc(total);
    const outputPointer = kit.alloc(total);
    if (inputPointer < 0 || outputPointer < 0) return null;
    new Uint8Array(kit.memory.buffer, inputPointer, bytes.length).set(bytes);
    const length = kit.sku_normalize(inputPointer, bytes.length, outputPointer);
    const output = new Uint8Array(kit.memory.buffer, outputPointer, length);
    return new TextDecoder().decode(output);
  } catch {
    return null;
  }
}

/** True when the compiled SKU kit is available in this runtime. */
export function skuKitAvailable(): boolean {
  return getSkuKit() !== null;
}

/** Runs `sku_valid` over an already normalized SKU. */
export function isValidSkuInWasm(sku: string): boolean | null {
  const kit = getSkuKit();
  if (!kit) return null;
  if (sku.length === 0) return false;
  try {
    const bytes = encoder.encode(sku);
    const pointer = kit.alloc(bytes.length);
    if (pointer < 0) return null;
    new Uint8Array(kit.memory.buffer, pointer, bytes.length).set(bytes);
    return kit.sku_valid(pointer, bytes.length) === 1;
  } catch {
    return null;
  }
}

/** Runs `sku_check` and returns the check character index, or null. */
export function skuCheckInWasm(sku: string): number | null {
  const kit = getSkuKit();
  if (!kit) return null;
  if (sku.length === 0) return -1;
  try {
    const bytes = encoder.encode(sku);
    const pointer = kit.alloc(bytes.length);
    if (pointer < 0) return null;
    new Uint8Array(kit.memory.buffer, pointer, bytes.length).set(bytes);
    return kit.sku_check(pointer, bytes.length);
  } catch {
    return null;
  }
}
