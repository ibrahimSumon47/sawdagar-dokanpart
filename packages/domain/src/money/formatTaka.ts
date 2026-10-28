const BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯';

/**
 * Replaces Western digits with Bengali digits while leaving other characters untouched.
 *
 * @param value Text that may contain the digits 0-9.
 * @returns The same text with every digit mapped to its Bengali counterpart.
 */
export function toBanglaDigits(value: string): string {
  return value.replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)]);
}

export type PriceLocale = 'en' | 'bn';

/**
 * Formats an amount held in poisha (the minor unit of the Bangladeshi taka).
 *
 * Prices are stored as integers to avoid floating point rounding. Whole taka
 * amounts omit the decimal part, while amounts with poisha show two digits.
 * Grouping follows the South Asian convention used in Bangladesh, so 125000
 * taka reads as 1,25,000 rather than 125,000.
 *
 * @param amountMinor Amount in poisha. Must be a non-negative safe integer.
 * @param locale Locale used to choose Western or Bengali digits.
 * @returns A taka string beginning with the ৳ symbol.
 */
export function formatTaka(amountMinor: number, locale: PriceLocale = 'en'): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    throw new RangeError('Amount must be a non-negative integer number of poisha.');
  }

  // Negating a zero balance produces -0; treat it as a plain zero so the
  // formatter cannot print "-0".
  const minor = amountMinor === 0 ? 0 : amountMinor;
  const hasPoisha = minor % 100 !== 0;
  const taka = minor / 100;
  const grouped = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: hasPoisha ? 2 : 0,
    maximumFractionDigits: hasPoisha ? 2 : 0,
  }).format(taka);

  return `৳${locale === 'bn' ? toBanglaDigits(grouped) : grouped}`;
}

/**
 * Formats a ledger balance that may be negative, such as platform cash after a
 * refund the platform had to front. The sign sits before the taka symbol.
 *
 * @param amountMinor Signed amount in poisha. Must be a safe integer.
 * @param locale Locale used to choose Western or Bengali digits.
 * @returns A signed taka string, for example `-৳1,440`.
 */
export function formatTakaSigned(amountMinor: number, locale: PriceLocale = 'en'): string {
  if (!Number.isSafeInteger(amountMinor)) {
    throw new RangeError('Amount must be an integer number of poisha.');
  }
  const sign = amountMinor < 0 ? '-' : '';
  return `${sign}${formatTaka(Math.abs(amountMinor), locale)}`;
}
