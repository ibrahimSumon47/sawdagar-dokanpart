import { cn } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';

export type SellerTab =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'questions'
  | 'returns'
  | 'promotions'
  | 'analytics'
  | 'finance'
  | 'store';

export interface SellerNavProps {
  /** Section currently open, marked with aria-current. */
  active: SellerTab;
  copy: Dictionary['seller'];
}

/** Horizontal section switcher used by every Seller Center page. */
export function SellerNav({ active, copy }: SellerNavProps) {
  const tabs: { key: SellerTab; href: string; label: string }[] = [
    { key: 'dashboard', href: '/seller', label: copy.tabDashboard },
    { key: 'products', href: '/seller/products', label: copy.tabProducts },
    { key: 'inventory', href: '/seller/inventory', label: copy.tabInventory },
    { key: 'orders', href: '/seller/orders', label: copy.tabOrders },
    { key: 'questions', href: '/seller/questions', label: copy.tabQuestions },
    { key: 'returns', href: '/seller/returns', label: copy.tabReturns },
    { key: 'promotions', href: '/seller/promotions', label: copy.tabPromotions },
    { key: 'analytics', href: '/seller/analytics', label: copy.tabAnalytics },
    { key: 'finance', href: '/seller/finance', label: copy.tabFinance },
    { key: 'store', href: '/seller/store', label: copy.tabStore },
  ];

  return (
    <nav aria-label={copy.navLabel} className="border-b border-line">
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
