import type { Dictionary, Locale } from '../../../../i18n';
import type { AdminStoreRecord } from '../../storeQueries';
import { StoreApprovalCard } from '../StoreApprovalCard';

export interface StoreApprovalListProps {
  stores: readonly AdminStoreRecord[];
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Splits stores into the pending review queue and the decided stores. */
export function StoreApprovalList({ stores, copy, locale }: StoreApprovalListProps) {
  const pending = stores.filter((store) => store.status === 'pending');
  const decided = stores.filter((store) => store.status !== 'pending');

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-xl text-ink">
          {copy.pendingColumn} ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            {copy.noStores}
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {pending.map((store) => (
              <StoreApprovalCard key={store.id} store={store} copy={copy} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {decided.length > 0 ? (
        <section>
          <h2 className="font-serif text-xl text-ink">
            {copy.approvedColumn} ({decided.length})
          </h2>
          <div className="mt-3 space-y-3">
            {decided.map((store) => (
              <StoreApprovalCard key={store.id} store={store} copy={copy} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
