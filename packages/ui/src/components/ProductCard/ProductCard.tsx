import { JamdaniPattern } from '../JamdaniPattern/JamdaniPattern';
import { Price } from '../Price/Price';
import { RatingStars } from '../RatingStars/RatingStars';
import { Badge } from '../Badge/Badge';
import type { PriceLocale, ProductTone } from '@sd/domain';
import { cn } from '../../lib/cn';
import { productCardLayout } from './productCardLayout';

export interface ProductCardProduct {
  id: string;
  title: string;
  vendorName: string;
  priceMinor: number;
  compareAtMinor?: number;
  rating: number;
  reviewCount: number;
  tone?: ProductTone;
  /** When zero, the card can show a sold-out badge. */
  totalStock?: number;
  /** Representative department photograph; the pattern shows when absent. */
  image?: { src: string; alt: string; objectPosition?: string };
}

export interface ProductCardProps {
  product: ProductCardProduct;
  locale?: PriceLocale;
  /** Localised rating description for assistive technology. */
  ratingLabel: string;
  /** Localised sale badge text. */
  saleLabel: string;
  /** Localised sold-out badge text, shown only when totalStock is zero. */
  soldOutLabel?: string;
  className?: string;
}

const toneClass = {
  accent: 'bg-accent/10 text-accent',
  secondary: 'bg-secondary/10 text-secondary',
  highlight: 'bg-highlight/10 text-highlight',
  ink: 'bg-surface-elevated text-ink-muted',
} as const;

/**
 * Summary card for a marketplace product: media, vendor, title, rating and price.
 * Image swapping on hover and quick add arrive with catalog data in a later phase.
 */
export function ProductCard({
  product,
  locale = 'en',
  ratingLabel,
  saleLabel,
  soldOutLabel,
  className,
}: ProductCardProps) {
  const discounted = product.compareAtMinor !== undefined;
  const soldOut = product.totalStock === 0;

  return (
    <article
      className={cn('group flex flex-col', className)}
      data-layout={productCardLayout.id}
      data-media-aspect={productCardLayout.mediaAspect}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-sm border border-line',
          productCardLayout.mediaAspect,
          toneClass[product.tone ?? 'accent'],
        )}
      >
        {product.image ? (
          <img
            src={product.image.src}
            alt={product.image.alt}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: product.image.objectPosition }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <JamdaniPattern className="transition-transform duration-300 group-hover:scale-[1.03]" />
        )}
        {discounted ? (
          <Badge tone="accent" className="absolute left-2 top-2">
            {saleLabel}
          </Badge>
        ) : null}
        {soldOut && soldOutLabel ? (
          <Badge
            tone="neutral"
            className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] bg-surface"
          >
            {soldOutLabel}
          </Badge>
        ) : null}
      </div>
      <div className={cn('flex flex-col pt-3', productCardLayout.bodyGap)}>
        <p className="text-xs uppercase tracking-wider text-ink-muted">{product.vendorName}</p>
        <h3 className="line-clamp-2 text-sm font-medium leading-5 text-ink">{product.title}</h3>
        <RatingStars
          rating={product.rating}
          reviewCount={product.reviewCount}
          label={ratingLabel}
        />
        <Price
          amountMinor={product.priceMinor}
          compareAtMinor={product.compareAtMinor}
          locale={locale}
          size="md"
        />
      </div>
    </article>
  );
}
