'use client';

import { Button } from '@sd/ui';
import Link from 'next/link';

export interface GlobalErrorProps {
  reset: () => void;
}

/**
 * Route error boundary. It cannot read the locale cookie on the client, so the
 * short message carries both languages and keeps the retry action available.
 */
export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <div className="mx-auto flex min-h-[60svh] w-full max-w-3xl flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">Something went wrong · কিছু ভুল হয়েছে</h1>
      <p className="text-sm text-ink-muted">
        Try again. If it keeps happening, return to the storefront. · আবার চেষ্টা করুন। সমস্যা থাকলে
        দোকানে ফিরে যান।
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Try again · আবার চেষ্টা করুন</Button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm border border-line px-5 text-sm font-semibold text-ink"
        >
          Storefront · দোকান
        </Link>
      </div>
    </div>
  );
}
