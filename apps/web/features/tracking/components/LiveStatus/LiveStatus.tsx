'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '../../../../i18n';

export interface LiveStatusProps {
  /** Which order to follow: a guest order code or a signed-in order number. */
  query: { code: string } | { number: string };
  copy: Dictionary['checkout'];
}

/** Polling interval used when the event stream is unavailable. */
const POLL_MS = 5_000;

/**
 * Keeps the timeline current. It listens to a server-sent event stream and
 * reloads the page on each change. If the stream fails it polls with an ETag,
 * so unchanged checks return 304. Both pause while the tab is hidden.
 */
export function LiveStatus({ query, copy }: LiveStatusProps) {
  const [loadedAt] = useState(() => Date.now());
  const [seconds, setSeconds] = useState(0);
  const search = new URLSearchParams(query).toString();

  useEffect(() => {
    const url = `/api/track/live?${search}`;
    let source: EventSource | null = null;
    let etag: string | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      const response = await fetch(url, {
        headers: etag ? { 'If-None-Match': etag } : {},
        cache: 'no-store',
      });
      if (response.status === 304 || !response.ok) return;
      const next = response.headers.get('ETag');
      if (etag !== null && next !== etag) window.location.reload();
      etag = next;
    };

    const stop = () => {
      source?.close();
      source = null;
      if (timer) clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (source || timer) return;
      source = new EventSource(url);
      source.addEventListener('snapshot', () => window.location.reload());
      source.addEventListener('gone', stop);
      source.onerror = () => {
        stop();
        void poll();
        timer = setInterval(() => void poll(), POLL_MS);
      };
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, [search]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - loadedAt) / 1000)), 1_000);
    return () => clearInterval(timer);
  }, [loadedAt]);

  const updatedText =
    seconds < 5 ? copy.liveUpdatedNow : copy.liveUpdatedAgo.replace('{seconds}', String(seconds));

  return (
    <div className="flex items-center gap-3 text-xs text-ink-muted" aria-live="polite">
      <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        {copy.liveLabel}
      </span>
      <span>{updatedText}</span>
    </div>
  );
}
