'use client';

import { ButtonLink, EmptyState } from '@sd/ui';
import { Heart } from 'lucide-react';
import type { Locale } from '../../../../i18n';
import type { CatalogProduct } from '../../../catalog/queries';
import { ProductGrid, type ProductGridLabels } from '../../../catalog/components/ProductGrid';
import { useShop } from '../ShopProvider';

export interface WishlistViewProps {
  /** Every product saved when the page was rendered, newest first. */
  products: readonly CatalogProduct[];
  locale: Locale;
  labels: ProductGridLabels;
  empty: { title: string; body: string; action: string };
}

/** Saved products, filtered live as hearts are switched off in the grid. */
export function WishlistView({ products, locale, labels, empty }: WishlistViewProps) {
  const { wishlistIds } = useShop();
  const saved = products.filter((product) => wishlistIds.includes(product.id));

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={<Heart aria-hidden="true" className="size-8" />}
        title={empty.title}
        description={empty.body}
        action={<ButtonLink href="/catalog">{empty.action}</ButtonLink>}
      />
    );
  }

  return <ProductGrid products={saved} locale={locale} labels={labels} />;
}
