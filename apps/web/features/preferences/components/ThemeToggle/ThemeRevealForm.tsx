'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';
import { startTransition, useRef } from 'react';
import type { Theme } from '../../theme';

export interface ThemeRevealFormProps {
  /** Server action that stores the theme cookie. */
  action: (formData: FormData) => Promise<void>;
  /** Theme this form switches to. */
  theme: Theme;
  children: ReactNode;
}

/**
 * Wraps the theme form and grows a circular reveal from the clicked button.
 * Browsers without View Transitions, and readers who ask for less motion,
 * keep the normal form submit, so the toggle still works without JavaScript.
 */
export function ThemeRevealForm({ action, theme, children }: ThemeRevealFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const start = document.startViewTransition as Document['startViewTransition'] | undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!start || reduce) return;

    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const rect = submitter?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const formData = new FormData(event.currentTarget);

    // The action stores the cookie; refresh re-renders the route with the new
    // tokens. Both run inside the transition so the old and new states are captured.
    const transition = start.call(
      document,
      () =>
        new Promise<void>((resolve) => {
          startTransition(async () => {
            await action(formData);
            router.refresh();
            resolve();
          });
        }),
    );
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }

  return (
    <form ref={formRef} action={action} onSubmit={handleSubmit} data-theme-choice={theme}>
      <input type="hidden" name="theme" value={theme} />
      {children}
    </form>
  );
}
