import { VendorRow } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import type { ProductDetail } from '../../queries';

export interface ProductVendorCardProps {
  vendor: ProductDetail['vendor'];
  copy: Dictionary['catalog'];
}

/** Vendor summary card; the whole row links to the catalog filtered by vendor. */
export function ProductVendorCard({ vendor, copy }: ProductVendorCardProps) {
  return (
    <section aria-labelledby="product-vendor-title" className="mt-8">
      <h2 id="product-vendor-title" className="font-serif text-xl text-ink">
        {copy.vendorTitle}
      </h2>
      <Link
        href={`/catalog?vendor=${vendor.slug}`}
        className="mt-3 block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <VendorRow
          name={vendor.name}
          location={vendor.district ?? 'Bangladesh'}
          rating={vendor.rating}
          reviewCount={vendor.reviewCount}
          ratingLabel={copy.ratingLabel(vendor.rating.toFixed(1), vendor.reviewCount)}
          meta={copy.vendorProducts(vendor.productCount)}
          verified={vendor.verified}
        />
      </Link>
    </section>
  );
}
