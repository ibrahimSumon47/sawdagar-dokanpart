import { Badge, buttonStyles } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';

export interface MembershipCardProps {
  name: string;
  slug: string;
  joinedAt: Date;
  /** Localised owner or staff label. */
  roleLabel: string;
  copy: Dictionary['account'];
  locale: Locale;
}

/** One vendor store membership on the account page. */
export function MembershipCard({
  name,
  slug,
  joinedAt,
  roleLabel,
  copy,
  locale,
}: MembershipCardProps) {
  return (
    <article className="rounded-sm border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg text-ink">{name}</h3>
          <p className="truncate text-xs text-ink-muted">{slug}</p>
        </div>
        <Badge tone="success">{roleLabel}</Badge>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {copy.memberSince} · {formatDate(joinedAt, locale)}
      </p>
      <Link href="/seller" className={buttonStyles({ variant: 'secondary', size: 'sm' }) + ' mt-3'}>
        {copy.openSeller}
      </Link>
    </article>
  );
}
