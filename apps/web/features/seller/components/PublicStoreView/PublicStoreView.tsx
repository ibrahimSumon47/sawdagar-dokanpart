import { ProductCard } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import type { PublicStoreRecord } from '../../queries';
import { PublicStoreHeader } from '../PublicStoreHeader';

export interface PublicStoreViewProps {
  store: PublicStoreRecord;
  copy: Dictionary;
  locale: Locale;
}

/** Public store page: identity, active products, about text and policies. */
export function PublicStoreView({ store, copy, locale }: PublicStoreViewProps) {
  const about = locale === 'bn' ? store.aboutBn : store.aboutEn;
  const returnPolicy = locale === 'bn' ? store.returnPolicyBn : store.returnPolicyEn;
  const shippingPolicy = locale === 'bn' ? store.shippingPolicyBn : store.shippingPolicyEn;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PublicStoreHeader store={store} copy={copy.seller} locale={locale} />

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-ink">{copy.seller.publicProducts}</h2>
        {store.products.length === 0 ? (
          <p className="mt-4 rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            {copy.seller.publicNoProducts}
          </p>
        ) : (
          <ul
            role="list"
            className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {store.products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  aria-label={locale === 'bn' ? product.titleBn : product.titleEn}
                  className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <ProductCard
                    product={{
                      id: product.id,
                      title: locale === 'bn' ? product.titleBn : product.titleEn,
                      vendorName: store.name,
                      priceMinor: product.priceMinor,
                      compareAtMinor: product.compareAtMinor ?? undefined,
                      rating: product.rating,
                      reviewCount: product.reviewCount,
                      tone: product.tone as 'accent' | 'secondary' | 'highlight' | 'ink',
                      totalStock: product.variants.reduce(
                        (total, variant) => total + variant.stock,
                        0,
                      ),
                    }}
                    locale={locale}
                    ratingLabel={copy.catalog.ratingLabel(
                      product.rating.toFixed(1),
                      product.reviewCount,
                    )}
                    saleLabel={copy.catalog.sale}
                    soldOutLabel={copy.catalog.stockOut}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {about ? (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-serif text-2xl text-ink">{copy.seller.publicAbout}</h2>
          <p className="mt-3 whitespace-pre-line text-ink-muted">{about}</p>
        </section>
      ) : null}

      {returnPolicy || shippingPolicy ? (
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          {returnPolicy ? (
            <div>
              <h2 className="font-serif text-xl text-ink">{copy.seller.publicReturnPolicy}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-ink-muted">{returnPolicy}</p>
            </div>
          ) : null}
          {shippingPolicy ? (
            <div>
              <h2 className="font-serif text-xl text-ink">{copy.seller.publicShippingPolicy}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-ink-muted">{shippingPolicy}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
