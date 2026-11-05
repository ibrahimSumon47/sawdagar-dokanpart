import type { ReactNode } from 'react';

export interface AuthCardProps {
  title: string;
  description: string;
  /** Form or panel that sits inside the card. */
  children: ReactNode;
  /** Optional line below the card, usually a link to the other form. */
  footer?: ReactNode;
}

/**
 * Frame shared by the sign-in, registration and password pages.
 * It keeps the heading level, width and padding identical on every auth route.
 */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-serif text-3xl leading-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
      </header>
      <div className="mt-8 rounded-sm border border-line bg-surface p-5 sm:p-6">{children}</div>
      {footer ? <div className="mt-6 text-sm text-ink-muted">{footer}</div> : null}
    </div>
  );
}
