import { Badge } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { buttonStyles } from '@sd/ui';
import { formatDate } from '../../../../lib/formatDate';
import type { Viewer } from '../../../auth/session';
import { RoleBadge } from '../../../auth/components/RoleBadge';
import { SignOutButton } from '../SignOutButton';

export interface AccountHeaderProps {
  viewer: Viewer;
  copy: Dictionary['account'];
  /** Localised label for the viewer's role. */
  roleLabel: string;
  locale: Locale;
  /** Areas this role may open, in addition to the account. */
  links: readonly { href: string; label: string }[];
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
}

/** Identity card at the top of the account page. */
export function AccountHeader({ viewer, copy, roleLabel, locale, links }: AccountHeaderProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-start gap-4">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-full bg-accent/10 font-serif text-xl text-accent"
        >
          {initials(viewer.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-serif text-2xl text-ink">{viewer.name}</h2>
          <p className="truncate text-sm text-ink-muted">{viewer.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RoleBadge role={viewer.role} label={roleLabel} />
            {viewer.isDemo ? <Badge>{copy.demoAccount}</Badge> : null}
            <span className="text-xs text-ink-muted">
              {copy.memberSince} · {formatDate(viewer.createdAt, locale)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonStyles({ variant: 'secondary', size: 'sm' })}
            >
              {link.label}
            </Link>
          ))}
          <SignOutButton label={copy.signOut} />
        </div>
      </div>
    </section>
  );
}
