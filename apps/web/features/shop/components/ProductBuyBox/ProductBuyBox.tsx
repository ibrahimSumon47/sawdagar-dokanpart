'use client';

import { Badge, Price, QuantityStepper } from '@sd/ui';
import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '../../../../i18n';
import type { ProductDetail } from '../../../catalog/queries';
import { VariantPicker } from '../../../catalog/components/VariantPicker';
import { useShop } from '../ShopProvider';
import { AddToCartButton } from '../AddToCartButton';
import { CompareButton } from '../CompareButton';
import { WishlistButton } from '../WishlistButton';

export interface ProductBuyBoxProps {
  productId: string;
  variants: ProductDetail['variants'];
  locale: Locale;
  stockLabels: {
    inStock: string;
    lowStock: string;
    outOfStock: string;
    sku: string;
    chooseVariant: string;
  };
}

/** Selected variant, price, stock, quantity and the cart, wishlist and compare actions. */
export function ProductBuyBox({ productId, variants, locale, stockLabels }: ProductBuyBoxProps) {
  const { copy, compareIds } = useShop();
  const defaultId = variants.find((variant) => variant.isDefault)?.id ?? variants[0]?.id ?? '';
  const [selectedId, setSelectedId] = useState(defaultId);
  const [quantity, setQuantity] = useState(1);
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0];

  if (!selected) return null;

  const stockTone = selected.stock === 0 ? 'danger' : selected.stock <= 5 ? 'warning' : 'success';
  const stockLabel =
    selected.stock === 0
      ? stockLabels.outOfStock
      : selected.stock <= 5
        ? stockLabels.lowStock
        : stockLabels.inStock;
  const maxQuantity = Math.max(1, Math.min(10, selected.stock));

  return (
    <div>
      <VariantPicker
        variants={variants}
        selectedId={selected.id}
        onSelect={(variantId) => {
          setSelectedId(variantId);
          setQuantity(1);
        }}
        name={`variant-${productId}`}
        locale={locale}
        label={stockLabels.chooseVariant}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Price
          amountMinor={selected.priceMinor}
          compareAtMinor={selected.compareAtMinor}
          locale={locale}
          size="lg"
        />
        <Badge tone={stockTone}>{stockLabel}</Badge>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {stockLabels.sku}: {selected.sku}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={maxQuantity}
          label={copy.quantity}
          labels={{ decrease: copy.decreaseQuantity, increase: copy.increaseQuantity }}
        />
        <AddToCartButton
          key={selected.id}
          variantId={selected.id}
          quantity={quantity}
          disabled={selected.stock === 0}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <WishlistButton productId={productId} showLabel />
        <CompareButton productId={productId} />
        {compareIds.length > 0 ? (
          <Link
            href="/compare"
            className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            {copy.compareView}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
