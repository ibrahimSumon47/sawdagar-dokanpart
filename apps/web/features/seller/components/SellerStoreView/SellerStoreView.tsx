import { Badge, ButtonLink } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { SellerStoreRecord } from '../../queries';
import { KycForm } from '../KycForm';
import { SellerSection } from '../SellerSection';
import { StoreSettingsForm } from '../StoreSettingsForm';

export interface SellerStoreViewProps {
  store: SellerStoreRecord;
  copy: Dictionary['seller'];
  canManage: boolean;
  locale: Locale;
}

const kycNoticeKey = {
  not_started: 'kycNoticeNotStarted',
  pending: 'kycNoticePending',
  approved: 'kycNoticeApproved',
  rejected: 'kycNoticeRejected',
} as const;

/** Storefront settings and the business verification section. */
export function SellerStoreView({ store, copy, canManage, locale }: SellerStoreViewProps) {
  const notice =
    copy[kycNoticeKey[store.kycStatus as keyof typeof kycNoticeKey] ?? 'kycNoticeNotStarted'];
  const kycLabel =
    store.kycStatus === 'approved'
      ? copy.kycApproved
      : store.kycStatus === 'pending'
        ? copy.kycPending
        : store.kycStatus === 'rejected'
          ? copy.kycRejected
          : copy.kycNotStarted;

  return (
    <SellerSection
      active="store"
      title={copy.storeTitle}
      description={copy.storeDescription}
      copy={copy}
    >
      <div className="space-y-6">
        <section className="rounded-sm border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-ink">{store.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">/store/{store.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={store.kycStatus === 'approved' ? 'success' : 'warning'}>
                {kycLabel}
              </Badge>
              <ButtonLink href={`/store/${store.slug}`} variant="secondary" size="sm">
                {copy.viewStore}
              </ButtonLink>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink-muted">{notice}</p>
          {store.kycNote ? <p className="mt-1 text-sm text-ink-muted">{store.kycNote}</p> : null}
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">{copy.storeIdentityTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.identityDescription}</p>
          <div className="mt-3">
            {canManage ? (
              <StoreSettingsForm store={store} copy={copy} />
            ) : (
              <p className="rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
                {copy.kycNoticeApproved}
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">{copy.kycTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.kycDescription}</p>
          <div className="mt-3">
            {canManage ? <KycForm store={store} copy={copy} locale={locale} /> : null}
          </div>
        </section>
      </div>
    </SellerSection>
  );
}
