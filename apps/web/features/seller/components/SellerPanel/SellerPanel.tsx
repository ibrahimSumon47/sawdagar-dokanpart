import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { StoreCard } from '../StoreCard';
import { TeamMemberRow } from '../TeamMemberRow';

export interface SellerMembership {
  organization: { name: string; slug: string };
  memberRole: string;
  joinedAt: Date;
  members: readonly {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  }[];
}

export interface SellerPanelProps {
  membership: SellerMembership;
  copy: Dictionary;
  locale: Locale;
}

/** Read-only store summary and team for a vendor account. */
export function SellerPanel({ membership, copy, locale }: SellerPanelProps) {
  const { organization, members } = membership;
  const selfRole =
    membership.memberRole === 'owner' ? copy.account.teamRoleOwner : copy.account.teamRoleStaff;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-display font-serif leading-tight text-ink">{copy.seller.title}</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{copy.seller.description}</p>
      </header>

      <div className="mt-8 space-y-6">
        <StoreCard
          name={organization.name}
          slug={organization.slug}
          joinedAt={membership.joinedAt}
          roleLabel={selfRole}
          copy={copy.seller}
          locale={locale}
        />

        <section>
          <h2 className="font-serif text-xl text-ink">{copy.seller.teamTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.seller.teamDescription}</p>
          {members.length === 0 ? (
            <p className="mt-4 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
              {copy.seller.noTeam}
            </p>
          ) : (
            <ul className="mt-4 overflow-hidden rounded-sm border border-line bg-surface">
              {members.map((member) => (
                <TeamMemberRow
                  key={member.id}
                  name={member.name}
                  email={member.email}
                  roleLabel={
                    member.role === 'owner'
                      ? copy.account.teamRoleOwner
                      : copy.account.teamRoleStaff
                  }
                  joinedLabel={copy.seller.memberSince}
                  joinedAt={formatDate(member.createdAt, locale)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
