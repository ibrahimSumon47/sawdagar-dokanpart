import { Moon } from 'lucide-react';
import { BrandMark, Button, ProductCard } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { galleryWidths, sampleProducts } from '../../sampleData';
import { GallerySection } from '../GallerySection';

export interface WidthSectionProps {
  copy: Dictionary['design'];
  locale: Locale;
  /** Localised brand name shown in the header preview. */
  brand: string;
}

/** Renders a header and product grid at each supported viewport width. */
export function WidthSection({ copy, locale, brand }: WidthSectionProps) {
  return (
    <GallerySection id="widths" title={copy.widthsTitle} description={copy.widthsDescription}>
      <div className="overflow-x-auto pb-3">
        <ul className="flex w-max gap-6">
          {galleryWidths.map((width) => (
            <li key={width}>
              <figure style={{ width }}>
                <figcaption className="mb-2 text-xs font-semibold tabular-nums text-ink-muted">
                  {copy.widthLabel(width)}
                </figcaption>
                <div className="rounded-sm border border-line bg-background p-3">
                  <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
                    <span className="flex min-w-0 items-center gap-1.5 font-serif text-sm text-ink">
                      <BrandMark className="size-5 shrink-0 text-accent" />
                      <span className="truncate">{brand}</span>
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      <span className="rounded-sm border border-line px-2 py-0.5 text-[10px] text-ink-muted">
                        {copy.languageShort}
                      </span>
                      <Moon aria-hidden="true" className="size-4 text-ink-muted" />
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-3">
                    {sampleProducts.slice(0, 2).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        locale={locale}
                        ratingLabel={copy.ratingLabel(String(product.rating), product.reviewCount)}
                        saleLabel={copy.saleLabel}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm">{copy.addToCart}</Button>
                    <Button size="sm" variant="secondary">
                      {copy.details}
                    </Button>
                  </div>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </GallerySection>
  );
}
