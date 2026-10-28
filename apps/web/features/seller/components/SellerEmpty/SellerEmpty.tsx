import { ButtonLink, EmptyState } from '@sd/ui';
import { Store } from 'lucide-react';
import type { Dictionary } from '../../../../i18n';

export interface SellerEmptyProps {
  copy: Dictionary['seller'];
}

/** Shown when a vendor-area account has no store membership recorded. */
export function SellerEmpty({ copy }: SellerEmptyProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <EmptyState
        icon={<Store aria-hidden="true" className="size-7" />}
        title={copy.noStoreTitle}
        description={copy.noStoreBody}
        action={<ButtonLink href="/account">{copy.goAccount}</ButtonLink>}
      />
    </div>
  );
}
