import type { ProductTone } from '@sd/domain';
import { cn, JamdaniPattern } from '@sd/ui';

export interface ProductMediaProps {
  tone: ProductTone;
  /** Representative department photograph; the pattern shows when absent. */
  image?: { src: string; alt: string; objectPosition?: string };
  className?: string;
}

const toneClass: Record<ProductTone, string> = {
  accent: 'bg-accent/10 text-accent',
  secondary: 'bg-secondary/10 text-secondary',
  highlight: 'bg-highlight/10 text-highlight',
  ink: 'bg-surface-elevated text-ink-muted',
};

/**
 * Product visual: the department photograph when one is licensed, otherwise the
 * original jamdani pattern. The pattern stays sharp at every width, so a missing
 * photo never leaves an empty frame.
 */
export function ProductMedia({ tone, image, className }: ProductMediaProps) {
  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden rounded-sm border border-line sm:aspect-[4/5]',
        !image && toneClass[tone],
        className,
      )}
    >
      {image ? (
        <img
          src={image.src}
          alt={image.alt}
          width={960}
          height={720}
          fetchPriority="high"
          style={{ objectPosition: image.objectPosition }}
          className="h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="h-full w-full">
          <JamdaniPattern />
        </div>
      )}
    </div>
  );
}
