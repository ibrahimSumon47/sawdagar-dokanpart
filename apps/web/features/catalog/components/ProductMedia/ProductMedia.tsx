import type { ProductTone } from '@sd/domain';
import { cn, JamdaniPattern } from '@sd/ui';

export interface ProductMediaProps {
  tone: ProductTone;
  className?: string;
}

const toneClass: Record<ProductTone, string> = {
  accent: 'bg-accent/10 text-accent',
  secondary: 'bg-secondary/10 text-secondary',
  highlight: 'bg-highlight/10 text-highlight',
  ink: 'bg-surface-elevated text-ink-muted',
};

/**
 * Product visual until photography lands. The motif is an original SVG, so the
 * page stays free of licensed imagery and remains sharp at every width.
 */
export function ProductMedia({ tone, className }: ProductMediaProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative aspect-square overflow-hidden rounded-sm border border-line sm:aspect-[4/5]',
        toneClass[tone],
        className,
      )}
    >
      <JamdaniPattern />
    </div>
  );
}
