import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface SectionHeadingProps {
  title: string;
  /** Short label above the title, such as a phase or category name. */
  eyebrow?: string;
  description?: string;
  /** Link or control aligned to the right on wide screens. */
  action?: ReactNode;
  className?: string;
}

/** Introduces a page section with a serif title and optional supporting action. */
export function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-title font-serif leading-tight text-ink">{title}</h2>
        {description ? <p className="mt-2 text-sm text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
