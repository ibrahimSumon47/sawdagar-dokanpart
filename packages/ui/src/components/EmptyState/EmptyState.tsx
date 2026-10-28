import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  /** Icon or small illustration rendered above the title. */
  icon?: ReactNode;
  title: string;
  description: string;
  /** Optional call to action, usually a button or link. */
  action?: ReactNode;
  className?: string;
}

/** Explains why a list or page has no content and what the visitor can do next. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-sm border border-dashed border-line bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? <div className="text-accent">{icon}</div> : null}
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
