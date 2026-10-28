import type { Permission, PlatformRole } from '@sd/domain';
import { ButtonLink } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { RoleBadge } from '../../../auth/components/RoleBadge';
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

/** Admin overview whose panels follow the permissions of the signed-in role. */
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

  const canReadFinance = permissions.includes('admin:finance:read');

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-display font-serif leading-tight text-ink">{copy.admin.title}</h1>
          <RoleBadge role={role} label={copy.roles[role]} />
        </div>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{copy.admin.description}</p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile label={copy.admin.totalUsers} value={number(totalUsers)} />
        <StatTile label={copy.admin.demoAccounts} value={number(demoUsers)} />
      </div>

      {canReadFinance ? (
        <div className="mt-4">
          <ButtonLink href="/admin/finance" variant="secondary" size="sm">
            {copy.admin.financeLink}
          </ButtonLink>
        </div>
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
    </div>
  );
}
