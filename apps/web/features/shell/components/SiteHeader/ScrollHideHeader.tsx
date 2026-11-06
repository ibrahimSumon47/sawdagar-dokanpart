'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export interface ScrollHideHeaderProps {
  children: ReactNode;
  className: string;
}

/**
 * Sticky header wrapper that slides out of view while the reader scrolls down
 * and slides back in on scroll up. It sets a data attribute only; the slide
 * itself is CSS, so reduced-motion users get an instant change instead.
 */
export function ScrollHideHeader({ children, className }: ScrollHideHeaderProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Ignore tiny movements so the bar does not flicker on trackpads.
      if (Math.abs(y - lastY) < 6) return;
      header.dataset.hidden = y > lastY && y > 120 ? 'true' : 'false';
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={ref} className={className}>
      {children}
    </header>
  );
}
