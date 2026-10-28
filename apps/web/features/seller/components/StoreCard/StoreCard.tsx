import { Badge } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';

export interface StoreCardProps {
  name: string;
  slug: string;
  joinedAt: Date;
  /** Localised owner or staff label for this membership. */
  roleLabel: string;
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Store identity and the viewer's role inside it. */
export function StoreCard({ name, slug, joinedAt, roleLabel, copy, locale }: StoreCardProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-ink">{name}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {copy.storeSlug}: {slug}
          </p>
        </div>
        <Badge tone="success">{roleLabel}</Badge>
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        {copy.memberSince} · {formatDate(joinedAt, locale)}
      </p>
    </section>
  );
}
