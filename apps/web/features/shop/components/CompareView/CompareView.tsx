'use client';

import { Button, ButtonLink, EmptyState } from '@sd/ui';
import { ArrowLeftRight, Trash2 } from 'lucide-react';
import type { Locale } from '../../../../i18n';
import type { CompareProduct } from '../../types';
import { useShop } from '../ShopProvider';
import { CompareTable, type CompareTableLabels } from './CompareTable';

export interface CompareViewProps {
  /** Products read from the comparison cookie when the page loaded. */
  products: readonly CompareProduct[];
  locale: Locale;
  labels: CompareTableLabels;
}

/** Comparison page body; columns disappear as products are removed. */
export function CompareView({ products, locale, labels }: CompareViewProps) {
  const { copy, compareIds, clearCompare } = useShop();
  const selected = products.filter((product) => compareIds.includes(product.id));

  if (selected.length === 0) {
    return (
      <EmptyState
        icon={<ArrowLeftRight aria-hidden="true" className="size-8" />}
        title={copy.compareEmptyTitle}
        description={copy.compareEmptyBody}
        action={<ButtonLink href="/catalog">{copy.compareEmptyAction}</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {selected.length === 1 ? (
          <p className="text-sm text-ink-muted">{copy.compareNotEnough}</p>
        ) : null}
        <Button variant="secondary" onClick={() => void clearCompare()} className="ml-auto">
          <Trash2 aria-hidden="true" className="size-4" />
          {copy.compareClear}
        </Button>
      </div>
      <div className="mt-6">
        <CompareTable products={selected} locale={locale} labels={labels} />
      </div>
    </div>
  );
}
