import type { Permission, PlatformRole } from '@sd/domain';
import { ButtonLink } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { RoleBadge } from '../../../auth/components/RoleBadge';
import { adminNavItems } from '../../nav';
import { AdminSection } from '../AdminSection';
import { AuditList, type AuditEntryView } from '../AuditList';
import { PermissionList } from '../PermissionList';
import { StatTile } from '../StatTile';
import { UserList, type AdminUser } from '../UserList';

export interface AdminPanelProps {
  role: PlatformRole;
  permissions: readonly Permission[];
  totalUsers: number;
  demoUsers: number;
  users: readonly AdminUser[];
  auditEntries: readonly AuditEntryView[];
  canReadUsers: boolean;
  canReadAudit: boolean;
  copy: Dictionary;
  locale: Locale;
}

/** Admin overview with the role's sections, people and recent audit trail. */
export function AdminPanel({
  role,
  permissions,
  totalUsers,
  demoUsers,
  users,
  auditEntries,
  canReadUsers,
  canReadAudit,
  copy,
  locale,
}: AdminPanelProps) {
  const number = (value: number) =>
    new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB').format(value);
  const sections = adminNavItems(copy.admin, role).filter((item) => item.key !== 'overview');

  return (
    <AdminSection
      active="overview"
      title={copy.admin.title}
      description={copy.admin.description}
      role={role}
      copy={copy}
    >
      <div className="flex flex-wrap items-center gap-3">
        <RoleBadge role={role} label={copy.roles[role]} />
        <ButtonLink href="/admin/analytics" variant="secondary" size="sm">
          {copy.admin.navAnalytics}
        </ButtonLink>
        <ButtonLink href="/admin/finance" variant="secondary" size="sm">
          {copy.admin.financeLink}
        </ButtonLink>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile label={copy.admin.totalUsers} value={number(totalUsers)} />
        <StatTile label={copy.admin.demoAccounts} value={number(demoUsers)} />
      </div>

      {sections.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-serif text-xl text-ink">{copy.admin.navLabel}</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <li key={section.key}>
                <Link
                  href={section.href}
                  className="block rounded-sm border border-line bg-surface p-4 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="font-serif text-xl text-ink">{copy.admin.usersTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.admin.usersDescription}</p>
          <div className="mt-4">
            {canReadUsers ? (
              <UserList users={users} copy={copy} locale={locale} />
            ) : (
              <p className="rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
                {copy.admin.noUsers}
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">{copy.admin.auditTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.admin.auditDescription}</p>
          <div className="mt-4">
            {canReadAudit ? (
              <AuditList entries={auditEntries} copy={copy.admin} locale={locale} />
            ) : (
              <p className="rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
                {copy.admin.noAudit}
              </p>
            )}
          </div>
        </section>

        <PermissionList permissions={permissions} copy={copy.admin} />
      </div>
    </AdminSection>
  );
}
