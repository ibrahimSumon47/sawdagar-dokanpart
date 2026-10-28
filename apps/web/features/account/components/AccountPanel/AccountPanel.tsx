import { hasArea } from '@sd/domain';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import type { Viewer } from '../../../auth/session';
import { AccountHeader } from '../AccountHeader';
import { AccountTabs } from '../AccountTabs';
import { MembershipCard } from '../MembershipCard';
import { ProfileForm } from '../ProfileForm';

export interface AccountPanelProps {
  viewer: Viewer;
  profile: { phone: string | null; district: string | null; bio: string | null } | null;
  memberships: readonly { name: string; slug: string; memberRole: string; joinedAt: Date }[];
  copy: Dictionary;
  locale: Locale;
}

/** Account page layout: identity, editable profile and store memberships. */
export function AccountPanel({ viewer, profile, memberships, copy, locale }: AccountPanelProps) {
  const links = [
    ...(hasArea(viewer.role, 'seller') ? [{ href: '/seller', label: copy.nav.seller }] : []),
    ...(hasArea(viewer.role, 'admin') ? [{ href: '/admin', label: copy.nav.admin }] : []),
    { href: '/account/mail', label: copy.account.mail },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-display font-serif leading-tight text-ink">{copy.account.title}</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{copy.account.description}</p>
      </header>

      <div className="mt-6">
        <AccountTabs active="overview" copy={copy.account} />
      </div>

      <div className="mt-8 space-y-6">
        <AccountHeader
          viewer={viewer}
          copy={copy.account}
          roleLabel={copy.roles[viewer.role]}
          locale={locale}
          links={links}
        />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-sm border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">{copy.account.profileTitle}</h2>
            <p className="mt-1 text-sm text-ink-muted">{copy.account.profileDescription}</p>
            <ProfileForm
              initial={{
                name: viewer.name,
                phone: profile?.phone ?? '',
                district: profile?.district ?? '',
                bio: profile?.bio ?? '',
              }}
              copy={copy.account}
            />
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink">{copy.account.storeTitle}</h2>
            <p className="mt-1 text-sm text-ink-muted">{copy.account.storeDescription}</p>
            <div className="mt-4 space-y-3">
              {memberships.length === 0 ? (
                <p className="rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
                  {copy.account.noStore}
                </p>
              ) : (
                memberships.map((membership) => (
                  <MembershipCard
                    key={membership.slug}
                    name={membership.name}
                    slug={membership.slug}
                    joinedAt={membership.joinedAt}
                    roleLabel={
                      membership.memberRole === 'owner'
                        ? copy.account.teamRoleOwner
                        : copy.account.teamRoleStaff
                    }
                    copy={copy.account}
                    locale={locale}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
