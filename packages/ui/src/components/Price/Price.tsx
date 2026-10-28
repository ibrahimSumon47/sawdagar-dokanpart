import { formatTaka, formatTakaSigned, type PriceLocale } from '@sd/domain';
import { cn } from '../../lib/cn';

export interface PriceProps {
  /** Current price in poisha. */
  amountMinor: number;
  /** Original price in poisha, shown struck through when the item is discounted. */
  compareAtMinor?: number;
  /** Locale used for numerals; default is English digits. */
  locale?: PriceLocale;
  /**
   * Allows a negative ledger balance and renders it with a leading minus.
   * Product prices leave this off so a bad amount fails loudly.
   */
  allowNegative?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClass = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
} as const;

/** Shows a taka price with an optional struck-through original price. */
export function Price({
  amountMinor,
  compareAtMinor,
  locale = 'en',
  allowNegative = false,
  size = 'md',
  className,
}: PriceProps) {
  const originalPrice =
    compareAtMinor !== undefined && compareAtMinor > amountMinor ? compareAtMinor : undefined;

  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-serif tabular-nums text-ink', sizeClass[size])}>
        {allowNegative ? formatTakaSigned(amountMinor, locale) : formatTaka(amountMinor, locale)}
      </span>
      {originalPrice !== undefined ? (
        <span className="text-xs tabular-nums text-ink-muted line-through">
          {formatTaka(originalPrice, locale)}
        </span>
      ) : null}
    </span>
  );
}
