/**
 * Characters allowed in the random part of a guest order code. Look-alikes
 * (0/O, 1/I/L) are left out so a code can be read aloud or copied by hand.
 */
export const orderCodeAlphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const codePattern = /^SD-\d{6}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/;

/**
 * Builds a guest-facing order code such as `SD-261106-K7QM`. The date part is
 * the UTC day the order was placed; the four random characters are drawn from
 * `randomChar`, which tests can replace. The database enforces uniqueness.
 */
export function formatOrderCode(
  placedAt: Date,
  randomChar: () => string = randomOrderCodeChar,
): string {
  const year = String(placedAt.getUTCFullYear() % 100).padStart(2, '0');
  const month = String(placedAt.getUTCMonth() + 1).padStart(2, '0');
  const day = String(placedAt.getUTCDate()).padStart(2, '0');
  let suffix = '';
  for (let index = 0; index < 4; index += 1) suffix += randomChar();
  return `SD-${year}${month}${day}-${suffix}`;
}

/**
 * Draws one character from the order code alphabet. Rejection sampling keeps
 * the distribution uniform: bytes at or above the largest multiple of the
 * alphabet length are skipped instead of wrapping around.
 */
export function randomOrderCodeChar(): string {
  const limit = 256 - (256 % orderCodeAlphabet.length);
  const bytes = new Uint8Array(1);
  for (;;) {
    webCrypto().getRandomValues(bytes);
    if (bytes[0] < limit) return orderCodeAlphabet.charAt(bytes[0] % orderCodeAlphabet.length);
  }
}

/** Reads the Web Crypto API that Node and browsers both expose on `globalThis`. */
function webCrypto(): { getRandomValues(array: Uint8Array): Uint8Array } {
  return (globalThis as unknown as { crypto: { getRandomValues(array: Uint8Array): Uint8Array } })
    .crypto;
}

/** Returns true when a value has the shape of an order code; the database stays the authority. */
export function isOrderCode(value: string): boolean {
  return codePattern.test(value);
}
