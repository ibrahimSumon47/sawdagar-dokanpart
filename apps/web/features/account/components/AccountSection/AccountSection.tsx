import type { ReactNode } from 'react';
import type { Dictionary } from '../../../../i18n';
import { pageLayout } from '../../../shell/pageLayout';
import { AccountTabs, type AccountTab } from '../AccountTabs';

export interface AccountSectionProps {
  active: AccountTab;
  title: string;
  description: string;
  copy: Dictionary['account'];
  children: ReactNode;
}

/** Page frame shared by the account sub-pages: heading, tabs and content. */
export function AccountSection({
  active,
  title,
  description,
  copy,
  children,
}: AccountSectionProps) {
  return (
    <div className={pageLayout.accountSection}>
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{title}</h1>
        <p className="mt-2 text-ink-muted">{description}</p>
      </header>
      <div className="mt-6">
        <AccountTabs active={active} copy={copy} />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
