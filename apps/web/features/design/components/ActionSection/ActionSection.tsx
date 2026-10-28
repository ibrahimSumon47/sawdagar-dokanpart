import { Badge, Button, Price, RatingStars } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { sampleProducts } from '../../sampleData';
import { GallerySection } from '../GallerySection';
import { QuantityDemo } from '../QuantityDemo';

export interface ActionSectionProps {
  copy: Dictionary['design'];
  locale: Locale;
}

/** Buttons, badges, prices, ratings and the quantity control. */
export function ActionSection({ copy, locale }: ActionSectionProps) {
  const product = sampleProducts[0];

  return (
    <GallerySection
      id="components"
      title={copy.componentsTitle}
      description={copy.componentsDescription}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-ink">{copy.buttonsTitle}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button>{copy.addToCart}</Button>
            <Button variant="secondary">{copy.saveForLater}</Button>
            <Button variant="ghost">{copy.compare}</Button>
            <Button disabled>{copy.soldOut}</Button>
          </div>
        </div>

        <div className="rounded-sm border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-ink">{copy.badgesTitle}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{copy.draft}</Badge>
            <Badge tone="accent">{copy.saleLabel}</Badge>
            <Badge tone="success">{copy.delivered}</Badge>
            <Badge tone="warning">{copy.packed}</Badge>
            <Badge tone="danger">{copy.cancelled}</Badge>
          </div>
        </div>

        <div className="rounded-sm border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-ink">{copy.pricesTitle}</h3>
          <div className="mt-4 space-y-3">
            <Price
              amountMinor={product.priceMinor}
              compareAtMinor={product.compareAtMinor}
              locale={locale}
            />
            <Price amountMinor={product.priceMinor} locale={locale} size="lg" />
            <Price amountMinor={1_899_50} locale={locale} size="sm" />
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              label={copy.ratingLabel(String(product.rating), product.reviewCount)}
              size="md"
            />
          </div>
        </div>

        <div className="rounded-sm border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-ink">{copy.quantity}</h3>
          <div className="mt-4">
            <QuantityDemo
              label={copy.quantity}
              decrease={copy.decreaseQuantity}
              increase={copy.increaseQuantity}
            />
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
