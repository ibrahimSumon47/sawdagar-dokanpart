'use client';

import { formatTemplate } from '../../formatTemplate';
import { useShop } from '../ShopProvider';
import { CartLineItem } from './CartLineItem';
import type { CartGroup as CartGroupType } from '../../types';

export interface CartGroupProps {
  group: CartGroupType;
}

/** Vendor heading, shipping origin and that store's cart rows. */
export function CartGroup({ group }: CartGroupProps) {
  const { copy } = useShop();
  const shipping = group.vendor.district
    ? formatTemplate(copy.shipsFrom, { district: group.vendor.district })
    : copy.shipsFromBangladesh;

  return (
    <section className="border-b border-line py-2 last:border-b-0">
      <header className="flex flex-wrap items-baseline justify-between gap-2 py-2">
        <h3 className="text-sm font-semibold text-ink">{group.vendor.name}</h3>
        <p className="text-xs text-ink-muted">{shipping}</p>
      </header>
      <ul role="list">
        {group.items.map((line) => (
          <CartLineItem key={line.variantId} line={line} />
        ))}
      </ul>
    </section>
  );
}
