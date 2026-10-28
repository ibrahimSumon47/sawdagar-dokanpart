import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface ErrorStateProps {
  title: string;
  description: string;
  /** Retry control supplied by the caller, usually a button in a client boundary. */
  action?: ReactNode;
  className?: string;
}

/** Shows a recoverable failure with a clear next step instead of a blank area. */
export function ErrorState({ title, description, action, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-sm border border-danger/30 bg-danger/5 px-6 py-12 text-center',
        className,
      )}
    >
      <CircleAlert aria-hidden="true" className="size-6 text-danger" />
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
