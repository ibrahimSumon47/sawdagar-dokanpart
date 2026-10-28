import {
  AnnouncementBar,
  Badge,
  BrandMark,
  Button,
  Price,
  ProductCard,
  RatingStars,
  VendorRow,
} from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { sampleProducts, sampleVendors } from '../../sampleData';
import { GallerySection } from '../GallerySection';

export interface ThemeSectionProps {
  copy: Dictionary['design'];
  locale: Locale;
  /** Localised brand name shown above each themed canvas. */
  brand: string;
}

const themes = ['light', 'dark'] as const;

/** Shows the same component set on both themed canvases. */
export function ThemeSection({ copy, locale, brand }: ThemeSectionProps) {
  const product = sampleProducts[0];
  const vendor = sampleVendors[0];

  return (
    <GallerySection id="themes" title={copy.themesTitle} description={copy.themesDescription}>
      <div className="grid gap-6 lg:grid-cols-2">
        {themes.map((theme) => (
          <section
            key={theme}
            data-theme={theme}
            className="overflow-hidden rounded-md border border-line bg-background"
          >
            <AnnouncementBar message={copy.sampleNote} />
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <BrandMark className="size-6 text-accent" />
                <span className="font-serif text-lg text-ink">{brand}</span>
                <h3 className="ml-auto text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  {theme === 'light' ? copy.light : copy.dark}
                </h3>
              </div>
              <div className="mt-4 max-w-60">
                <ProductCard
                  product={product}
                  locale={locale}
                  ratingLabel={copy.ratingLabel(String(product.rating), product.reviewCount)}
                  saleLabel={copy.saleLabel}
                />
              </div>
              <div className="mt-5">
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
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Price amountMinor={product.priceMinor} locale={locale} />
                <RatingStars
                  rating={product.rating}
                  label={copy.ratingLabel(String(product.rating), product.reviewCount)}
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button>{copy.addToCart}</Button>
                <Badge tone="success">{copy.delivered}</Badge>
              </div>
            </div>
          </section>
        ))}
      </div>
    </GallerySection>
  );
}
