import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { SellerStoreRecord } from '../../queries';
import { saveStoreAction } from '../../storeActions';

export interface StoreSettingsFormProps {
  store: SellerStoreRecord;
  copy: Dictionary['seller'];
}

const fieldClass =
  'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const tones = [
  ['accent', 'toneAccent'],
  ['secondary', 'toneSecondary'],
  ['highlight', 'toneHighlight'],
  ['ink', 'toneInk'],
] as const;

/** Public storefront identity, announcement and policies in both languages. */
export function StoreSettingsForm({ store, copy }: StoreSettingsFormProps) {
  return (
    <form
      action={saveStoreAction}
      className="space-y-5 rounded-sm border border-line bg-surface p-5"
    >
      <div>
        <label htmlFor="name" className="text-xs font-semibold text-ink">
          {copy.displayName}
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={store.name}
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-ink-muted">
          {copy.storeSlug}: /store/{store.slug}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="announcementEn" className="text-xs font-semibold text-ink">
            {copy.announcementEn}
          </label>
          <input
            id="announcementEn"
            name="announcementEn"
            maxLength={140}
            defaultValue={store.announcementEn ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="announcementBn" className="text-xs font-semibold text-ink">
            {copy.announcementBn}
          </label>
          <input
            id="announcementBn"
            name="announcementBn"
            maxLength={140}
            defaultValue={store.announcementBn ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="aboutEn" className="text-xs font-semibold text-ink">
            {copy.aboutEn}
          </label>
          <textarea
            id="aboutEn"
            name="aboutEn"
            rows={4}
            maxLength={600}
            defaultValue={store.aboutEn ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="aboutBn" className="text-xs font-semibold text-ink">
            {copy.aboutBn}
          </label>
          <textarea
            id="aboutBn"
            name="aboutBn"
            rows={4}
            maxLength={600}
            defaultValue={store.aboutBn ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="returnPolicyEn" className="text-xs font-semibold text-ink">
            {copy.returnPolicyEn}
          </label>
          <textarea
            id="returnPolicyEn"
            name="returnPolicyEn"
            rows={3}
            maxLength={600}
            defaultValue={store.returnPolicyEn ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="returnPolicyBn" className="text-xs font-semibold text-ink">
            {copy.returnPolicyBn}
          </label>
          <textarea
            id="returnPolicyBn"
            name="returnPolicyBn"
            rows={3}
            maxLength={600}
            defaultValue={store.returnPolicyBn ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="shippingPolicyEn" className="text-xs font-semibold text-ink">
            {copy.shippingPolicyEn}
          </label>
          <textarea
            id="shippingPolicyEn"
            name="shippingPolicyEn"
            rows={3}
            maxLength={600}
            defaultValue={store.shippingPolicyEn ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="shippingPolicyBn" className="text-xs font-semibold text-ink">
            {copy.shippingPolicyBn}
          </label>
          <textarea
            id="shippingPolicyBn"
            name="shippingPolicyBn"
            rows={3}
            maxLength={600}
            defaultValue={store.shippingPolicyBn ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="accent" className="text-xs font-semibold text-ink">
            {copy.accent}
          </label>
          <select id="accent" name="accent" defaultValue={store.accent} className={fieldClass}>
            {tones.map(([value, key]) => (
              <option key={value} value={value}>
                {copy[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="coverTone" className="text-xs font-semibold text-ink">
            {copy.cover}
          </label>
          <select
            id="coverTone"
            name="coverTone"
            defaultValue={store.coverTone}
            className={fieldClass}
          >
            {tones.map(([value, key]) => (
              <option key={value} value={value}>
                {copy[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit">{copy.saveStore}</Button>
    </form>
  );
}
