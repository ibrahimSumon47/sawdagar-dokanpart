import type { PlatformRole } from '@sd/domain';
import type { ReactNode } from 'react';
import type { Dictionary } from '../../../../i18n';
import type { AdminTab } from '../../nav';
import { AdminNav } from '../AdminNav';

export interface AdminSectionProps {
  /** Section currently open, passed to the navigation. */
  active: AdminTab;
  title: string;
  description: string;
  /** Role used to filter the navigation links. */
  role: PlatformRole;
  copy: Dictionary;
  /** Optional control aligned with the heading, such as "New entry". */
  actions?: ReactNode;
  children: ReactNode;
}

/** Shared frame for admin pages: heading, role-filtered tabs and content. */
export function AdminSection({
  active,
  title,
  description,
  role,
  copy,
  actions,
  children,
}: AdminSectionProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <header className="max-w-2xl">
          <h1 className="font-serif text-title leading-tight text-ink">{title}</h1>
          <p className="mt-2 text-ink-muted">{description}</p>
        </header>
        {actions ? <div className="shrink-0 pt-1">{actions}</div> : null}
      </div>
      <div className="mt-6">
        <AdminNav active={active} role={role} copy={copy.admin} />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
