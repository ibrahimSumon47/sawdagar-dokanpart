'use client';

import { Price, RatingStars } from '@sd/ui';
import { X } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '../../../../i18n';
import type { CompareProduct } from '../../types';
import { useShop } from '../ShopProvider';
import { CompareRow } from './CompareRow';

export interface CompareTableLabels {
  title: string;
  remove: string;
  category: string;
  price: string;
  vendor: string;
  rating: string;
  stock: string;
  options: string;
  stockIn: string;
  stockLow: string;
  stockOut: string;
  ratingLabels: Readonly<Record<string, string>>;
}

export interface CompareTableProps {
  products: readonly CompareProduct[];
  locale: Locale;
  labels: CompareTableLabels;
}

/** Side-by-side attribute table with one removable column per product. */
export function CompareTable({ products, locale, labels }: CompareTableProps) {
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');
  const { toggleCompare } = useShop();

  const values = (read: (product: CompareProduct) => ReactNode) =>
    products.map((product) => ({ id: product.id, value: read(product) }));

  return (
    <div className="overflow-x-auto rounded-sm border border-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">{labels.title}</caption>
        <thead>
          <tr className="bg-surface">
            <th scope="col" className="w-32 px-4 py-4 text-left">
              <span className="sr-only">{labels.title}</span>
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                scope="col"
                className="border-l border-line px-4 py-4 text-left align-top"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-serif text-base leading-snug text-ink hover:text-accent"
                  >
                    {product.title[locale]}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void toggleCompare(product.id)}
                    aria-label={`${labels.remove}: ${product.title[locale]}`}
                    className="grid size-8 shrink-0 place-items-center rounded-sm text-ink-muted transition-colors hover:bg-background hover:text-danger"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <CompareRow label={labels.vendor} values={values((product) => product.vendorName)} />
          <CompareRow
            label={labels.price}
            values={values((product) => (
              <Price
                amountMinor={product.priceMinor}
                compareAtMinor={product.compareAtMinor}
                locale={locale}
                size="sm"
              />
            ))}
          />
          <CompareRow
            label={labels.rating}
            values={values((product) => (
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
                label={labels.ratingLabels[product.id] ?? labels.rating}
                size="sm"
              />
            ))}
          />
          <CompareRow
            label={labels.category}
            values={values((product) => product.categoryName[locale])}
          />
          <CompareRow
            label={labels.options}
            values={values((product) => number.format(product.variantCount))}
          />
          <CompareRow
            label={labels.stock}
            values={values((product) =>
              product.totalStock === 0
                ? labels.stockOut
                : product.totalStock <= 5
                  ? labels.stockLow
                  : labels.stockIn,
            )}
          />
        </tbody>
      </table>
    </div>
  );
}
