'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export interface PageEnterProps {
  children: ReactNode;
}

/**
 * Fades each page in and lifts it 8px. Keying on the pathname restarts the
 * animation on every route change; the CSS is switched off for reduced motion.
 * Used once in the root layout around the page content.
 */
export function PageEnter({ children }: PageEnterProps) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
