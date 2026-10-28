import { skuCheckInWasm } from './wasmModules';

/** Stable TypeScript port of `native/sku_kit.c`. */

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAX_SKU_LENGTH = 24;
const MIN_SKU_LENGTH = 6;

function upperAscii(code: number): number {
  return code >= 0x61 && code <= 0x7a ? code - 32 : code;
}

function isAlphaNumeric(code: number): boolean {
  return (
    (code >= 0x41 && code <= 0x5a) ||
    (code >= 0x61 && code <= 0x7a) ||
    (code >= 0x30 && code <= 0x39)
  );
}

/** Uppercases letters, replaces separators with single dashes and trims them. */
export function normalizeSku(input: string): string {
  let output = '';
  let pendingDash = false;

  for (const character of input) {
    const code = character.charCodeAt(0);
    if (isAlphaNumeric(code)) {
      if (pendingDash && output.length > 0) output += '-';
      pendingDash = false;
      output += String.fromCharCode(upperAscii(code));
    } else {
      pendingDash = true;
    }
  }

  return output.slice(0, MAX_SKU_LENGTH);
}

/** True when the normalized SKU is `SD-`, 6 to 24 characters, no double dashes. */
export function isValidSku(sku: string): boolean {
  if (sku.length < MIN_SKU_LENGTH || sku.length > MAX_SKU_LENGTH) return false;
  if (!sku.startsWith('SD-')) return false;
  if (sku.endsWith('-')) return false;
  if (sku.includes('--')) return false;

  return [...sku.slice(3)].every((character) => /[A-Z0-9-]/.test(character));
}

function characterValue(character: string): number {
  const index = ALPHABET.indexOf(character);
  return index >= 0 ? index : 36;
}

/** Position-weighted modulo 36 check character for a normalized SKU. */
export function skuCheckCharacter(sku: string): string {
  if (sku.length === 0) return '';
  let sum = 0;
  for (let index = 0; index < sku.length; index += 1) {
    sum += characterValue(sku[index] ?? '') * (index + 1);
  }
  return ALPHABET[sum % 36] ?? '0';
}

/** Appends the check character to a normalized SKU, for example `SD-4F2A91C7-K`. */
export function withCheckCharacter(base: string): string {
  const normalized = normalizeSku(base);
  return `${normalized}-${skuCheckCharacter(normalized)}`;
}

/**
 * Builds a SKU the way new products do: normalize, then append the check
 * character from the compiled module when it is available. Falls back to the
 * port so a runtime without WebAssembly can still create products.
 */
export function skuWithCheckCharacter(base: string): string {
  const normalized = normalizeSku(base);
  const index = skuCheckInWasm(normalized);
  const check =
    index !== null && index >= 0 ? (ALPHABET[index] ?? '0') : skuCheckCharacter(normalized);
  return `${normalized}-${check}`;
}
