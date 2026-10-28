import type { Permission } from '@sd/domain';
import type { Dictionary } from '../../../../i18n';

export interface PermissionListProps {
  permissions: readonly Permission[];
  copy: Dictionary['admin'];
}

/** The permissions held by the signed-in admin role. */
export function PermissionList({ permissions, copy }: PermissionListProps) {
  return (
    <div>
      <h2 className="font-serif text-xl text-ink">{copy.permissionsTitle}</h2>
      <p className="mt-1 text-sm text-ink-muted">{copy.permissionsDescription}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {permissions.map((permission) => (
          <li
            key={permission}
            className="rounded-sm border border-line bg-surface px-2.5 py-1 font-mono text-xs text-ink"
          >
            {permission}
          </li>
        ))}
      </ul>
    </div>
  );
}
