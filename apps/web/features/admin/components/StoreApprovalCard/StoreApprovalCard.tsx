import { Badge, Button } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { AdminStoreRecord } from '../../storeQueries';
import { reviewStoreAction } from '../../actions';

export interface StoreApprovalCardProps {
  store: AdminStoreRecord;
  copy: Dictionary['admin'];
  locale: Locale;
}

/** One store's business record with approve and reject controls. */
export function StoreApprovalCard({ store, copy, locale }: StoreApprovalCardProps) {
  const details = [
    { label: copy.legalNameLabel, value: store.legalName },
    { label: copy.businessTypeLabel, value: store.businessType },
    { label: copy.tradeLicenseLabel, value: store.tradeLicense },
    { label: copy.payoutPhoneLabel, value: store.payoutPhone },
    { label: copy.districtLabel, value: store.district },
  ].filter((detail) => detail.value);

  return (
    <article className="rounded-sm border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-lg text-ink">{store.name}</h2>
          <p className="text-xs text-ink-muted">
            {store.ownerName ?? store.slug} · {copy.productsColumn}: {store.productCount}
            {store.kycSubmittedAt
              ? ` · ${copy.submittedColumn}: ${formatDate(store.kycSubmittedAt, locale)}`
              : ''}
          </p>
        </div>
        <Badge tone={store.status === 'pending' ? 'warning' : 'neutral'}>
          {copy.kycStatusColumn}: {store.kycStatus}
        </Badge>
      </div>

      {details.length > 0 ? (
        <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="flex gap-2">
              <dt className="text-ink-muted">{detail.label}:</dt>
              <dd className="min-w-0 break-words text-ink">{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <form action={reviewStoreAction} className="mt-4 flex flex-wrap items-end gap-2">
        <input type="hidden" name="storeId" value={store.id} />
        <label className="min-w-56 flex-1 text-xs font-semibold text-ink">
          {copy.reviewNote}
          <input
            type="text"
            name="note"
            maxLength={300}
            className="mt-1 block min-h-9 w-full rounded-sm border border-line bg-background px-2 text-sm text-ink"
          />
        </label>
        <Button type="submit" name="decision" value="approve" size="sm">
          {copy.approveStore}
        </Button>
        <Button type="submit" name="decision" value="reject" variant="secondary" size="sm">
          {copy.rejectStore}
        </Button>
      </form>
    </article>
  );
}
