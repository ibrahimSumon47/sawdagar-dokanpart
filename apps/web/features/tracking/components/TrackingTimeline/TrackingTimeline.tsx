import { cn } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { TimelineStepState, TerminalState } from '../../timeline';

export interface TrackingTimelineProps {
  steps: TimelineStepState[];
  terminal: TerminalState;
  copy: Dictionary['checkout'];
  locale: Locale;
}

const LABEL_KEYS = {
  placed: 'timelineStepPlaced',
  confirmed: 'timelineStepConfirmed',
  packed: 'timelineStepPacked',
  shipped: 'timelineStepShipped',
  outForDelivery: 'timelineStepOutForDelivery',
  delivered: 'timelineStepDelivered',
} as const;

/**
 * Vertical list of delivery steps for one package. Done steps are filled and
 * show their date; pending steps are muted. Cancelled and returned packages
 * show a single terminal line instead of the step list.
 */
export function TrackingTimeline({ steps, terminal, copy, locale }: TrackingTimelineProps) {
  if (terminal) {
    const label = terminal === 'cancelled' ? copy.timelineCancelled : copy.timelineReturned;
    return (
      <p role="status" className="rounded-sm bg-danger/10 px-3 py-2 text-sm text-danger">
        {label}
      </p>
    );
  }

  return (
    <ol className="space-y-3" aria-label={copy.timelineTitle}>
      {steps.map((state) => (
        <li key={state.step} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'mt-1 size-3 shrink-0 rounded-full border-2 transition-[background-color,border-color,transform] duration-500 motion-reduce:transition-none',
              state.done && 'scale-110',
              state.done ? 'border-accent bg-accent' : 'border-line bg-surface',
            )}
          />
          <div className="min-w-0">
            <p className={cn('text-sm', state.done ? 'font-semibold text-ink' : 'text-ink-muted')}>
              {copy[LABEL_KEYS[state.step]]}
            </p>
            {state.at ? (
              <p className="text-xs text-ink-muted">{formatDate(state.at, locale)}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
