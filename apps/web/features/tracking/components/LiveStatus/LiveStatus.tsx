'use client';

import type { Dictionary } from '../../../../i18n';
import { useLiveStatus } from './useLiveStatus';

/** Only plain strings cross to the client, never a dictionary builder. */
export type LiveStatusCopy = Pick<
  Dictionary['checkout'],
  | 'liveLabel'
  | 'liveUpdatedAgo'
  | 'liveUpdatedNow'
  | 'livePaused'
  | 'liveFinal'
  | 'liveOffline'
  | 'liveRefresh'
>;

export interface LiveStatusProps {
  /** Which order to follow: a guest order code or a signed-in order number. */
  query: { code: string } | { number: string };
  copy: LiveStatusCopy;
}

/**
 * Shows whether the timeline is being checked. It polls a small JSON endpoint
 * while the tab is visible, pauses when nothing changed for ten minutes, stops
 * on a final status, and offers a refresh control instead of retrying in the
 * background.
 */
export function LiveStatus({ query, copy }: LiveStatusProps) {
  const { phase, seconds, refresh } = useLiveStatus({ query });
  const updatedText =
    seconds < 5 ? copy.liveUpdatedNow : copy.liveUpdatedAgo.replace('{seconds}', String(seconds));
  const message =
    phase === 'final'
      ? copy.liveFinal
      : phase === 'paused'
        ? copy.livePaused
        : phase === 'offline'
          ? copy.liveOffline
          : null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted" aria-live="polite">
      {phase === 'live' ? (
        <>
          <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {copy.liveLabel}
          </span>
          <span>{updatedText}</span>
        </>
      ) : (
        <>
          <span>{message}</span>
          {phase !== 'final' ? (
            <button
              type="button"
              onClick={refresh}
              className="min-h-9 rounded-sm border border-line px-3 py-1.5 font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {copy.liveRefresh}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
