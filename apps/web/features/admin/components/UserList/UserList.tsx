import { Badge } from '@sd/ui';
import type { PlatformRole } from '@sd/domain';
import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { RoleBadge } from '../../../auth/components/RoleBadge';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  isDemo: boolean;
  createdAt: Date;
}

export interface UserListProps {
  users: readonly AdminUser[];
  copy: Dictionary;
  locale: Locale;
}

/** Newest accounts with their platform role. */
export function UserList({ users, copy, locale }: UserListProps) {
  return (
    <ul className="overflow-hidden rounded-sm border border-line bg-surface">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          </div>
          <RoleBadge role={user.role} label={copy.roles[user.role]} />
          {user.isDemo ? <Badge tone="neutral">{copy.account.demoAccount}</Badge> : null}
          <span className="text-xs tabular-nums text-ink-muted">
            {formatDate(user.createdAt, locale)}
          </span>
        </li>
      ))}
    </ul>
  );
}
