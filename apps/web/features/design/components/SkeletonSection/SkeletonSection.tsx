import { ProductCard, ProductCardSkeleton, VendorRow, VendorRowSkeleton } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { sampleProducts, sampleVendors } from '../../sampleData';
import { GallerySection } from '../GallerySection';

export interface SkeletonSectionProps {
  copy: Dictionary['design'];
  locale: Locale;
}

/** Places each skeleton next to the loaded component it reserves space for. */
export function SkeletonSection({ copy, locale }: SkeletonSectionProps) {
  const product = sampleProducts[0];
  const vendor = sampleVendors[0];

  return (
    <GallerySection
      id="skeletons"
      title={copy.skeletonTitle}
      description={copy.skeletonDescription}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-line bg-surface p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-ink-muted">{copy.loaded}</p>
          <div className="max-w-60">
            <ProductCard
              product={product}
              locale={locale}
              ratingLabel={copy.ratingLabel(String(product.rating), product.reviewCount)}
              saleLabel={copy.saleLabel}
            />
          </div>
        </div>
        <div className="rounded-sm border border-line bg-surface p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-ink-muted">{copy.loading}</p>
          <div className="max-w-60">
            <ProductCardSkeleton />
          </div>
        </div>
        <div className="rounded-sm border border-line bg-surface p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-ink-muted">{copy.loaded}</p>
          <VendorRow
            name={vendor.name}
            location={vendor.location}
            rating={vendor.rating}
            reviewCount={vendor.reviewCount}
            ratingLabel={copy.ratingLabel(String(vendor.rating), vendor.reviewCount)}
            meta={copy.followerCount(vendor.followers)}
            verified={vendor.verified}
          />
        </div>
        <div className="rounded-sm border border-line bg-surface p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-ink-muted">{copy.loading}</p>
          <VendorRowSkeleton />
        </div>
      </div>
    </GallerySection>
  );
}
