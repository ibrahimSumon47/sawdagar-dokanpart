const suffixPattern = /^[A-Z0-9]{4,8}$/;

/**
 * Builds a human-readable order number such as `SD-20261028-7F3A9C`. The
 * suffix comes from the caller so this stays pure and testable; the database
 * still enforces uniqueness.
 */
export function formatOrderNumber(placedAt: Date, suffix: string): string {
  const normalised = suffix.toUpperCase();
  if (!suffixPattern.test(normalised)) {
    throw new RangeError('Order suffix must be 4 to 8 letters or digits.');
  }

  const year = placedAt.getUTCFullYear();
  const month = String(placedAt.getUTCMonth() + 1).padStart(2, '0');
  const day = String(placedAt.getUTCDate()).padStart(2, '0');
  return `SD-${year}${month}${day}-${normalised}`;
}

/** Appends a two-digit sequence to an order number for one seller's sub-order. */
export function formatSubOrderNumber(orderNumber: string, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 99) {
    throw new RangeError('Sub-order sequence must be between 1 and 99.');
  }
  return `${orderNumber}-${String(sequence).padStart(2, '0')}`;
}
