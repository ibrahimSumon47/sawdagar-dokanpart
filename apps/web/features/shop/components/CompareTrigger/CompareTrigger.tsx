'use client';

import { ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';
import { useShop } from '../ShopProvider';

/** Header shortcut to the comparison page, shown only while products are selected. */
export function CompareTrigger() {
  const { copy, compareIds, locale } = useShop();
  if (compareIds.length === 0) return null;

  const count = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB').format(
    compareIds.length,
  );

  return (
    <Link
      href="/compare"
      aria-label={`${copy.compareView}: ${count}`}
      className="relative inline-flex size-11 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <ArrowLeftRight aria-hidden="true" className="size-5" />
      <span
        aria-hidden="true"
        className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold leading-4 text-accent-contrast"
      >
        {count}
      </span>
    </Link>
  );
}
