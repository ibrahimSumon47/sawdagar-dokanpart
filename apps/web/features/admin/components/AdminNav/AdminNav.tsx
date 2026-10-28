import type { PlatformRole } from '@sd/domain';
import { cn } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import { adminNavItems, type AdminTab } from '../../nav';

export interface AdminNavProps {
  /** Section to mark with aria-current. */
  active: AdminTab;
  /** Role whose permissions decide which sections appear. */
  role: PlatformRole;
  copy: Dictionary['admin'];
}

/** Horizontal admin section switcher, filtered by the signed-in role. */
export function AdminNav({ active, role, copy }: AdminNavProps) {
  const items = adminNavItems(copy, role);

  return (
    <nav aria-label={copy.navLabel} className="border-b border-line">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {items.map((item) => {
          const current = item.key === active;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'inline-block whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium',
                  current
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink-muted hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
