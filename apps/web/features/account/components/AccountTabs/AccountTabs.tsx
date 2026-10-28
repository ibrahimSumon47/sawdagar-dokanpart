import { cn } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';

export type AccountTab = 'overview' | 'orders' | 'reviews' | 'questions' | 'returns' | 'mail';

export interface AccountTabsProps {
  /** Section currently being viewed, highlighted with aria-current. */
  active: AccountTab;
  copy: Dictionary['account'];
}

/** Horizontal section switcher shared by every account page. */
export function AccountTabs({ active, copy }: AccountTabsProps) {
  const tabs: { key: AccountTab; href: string; label: string }[] = [
    { key: 'overview', href: '/account', label: copy.tabOverview },
    { key: 'orders', href: '/account/orders', label: copy.tabOrders },
    { key: 'reviews', href: '/account/reviews', label: copy.tabReviews },
    { key: 'questions', href: '/account/questions', label: copy.tabQuestions },
    { key: 'returns', href: '/account/returns', label: copy.tabReturns },
    { key: 'mail', href: '/account/mail', label: copy.mail },
  ];

  return (
    <nav aria-label={copy.tabsLabel} className="border-b border-line">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const current = tab.key === active;
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'inline-block whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium',
                  current
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink-muted hover:text-ink',
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
