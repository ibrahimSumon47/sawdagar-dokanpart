'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/** One visible tab checks every 25 seconds; this is a cheap HEAD-like request, not a stream. */
const POLL_MS = 25_000;
/** Errors back off up to five minutes instead of retrying every few seconds forever. */
const MAX_BACKOFF_MS = 5 * 60_000;
/** Stop after ten minutes without a change and wait for the buyer to ask again. */
const NO_CHANGE_STOP_MS = 10 * 60_000;

export type LivePhase = 'live' | 'paused' | 'final' | 'offline';

export interface LiveStatusQuery {
  /** Guest order code or signed-in order number. */
  query: { code: string } | { number: string };
}

export interface LiveStatusResult {
  phase: LivePhase;
  /** Whole seconds since the page data arrived; shown only while live. */
  seconds: number;
  /** Restarts polling after the buyer taps the refresh control. */
  refresh: () => void;
}

interface SnapshotAnswer {
  fingerprint: string;
  status: string;
  final: boolean;
}

/**
 * Polls the order snapshot only while the tab is visible. Unchanged answers
 * return 304 and do not reload the page; a changed fingerprint asks the router
 * to refresh the server-rendered timeline. Polling stops on a final status,
 * after ten quiet minutes, or on demand; errors use exponential backoff.
 */
export function useLiveStatus({ query }: LiveStatusQuery): LiveStatusResult {
  const router = useRouter();
  const [phase, setPhase] = useState<LivePhase>('live');
  const [seconds, setSeconds] = useState(0);
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  const [refreshToken, setRefreshToken] = useState(0);
  const search = new URLSearchParams(query).toString();

  const refresh = useCallback(() => {
    setLoadedAt(Date.now());
    setPhase('live');
    setRefreshToken((value) => value + 1);
  }, []);

  useEffect(() => {
    const url = `/api/track/live?${search}`;
    let etag: string | null = null;
    let failures = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;
    let inFlight = false;
    let lastChange = Date.now();
    let lastContact = Date.now();

    const clearTimer = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const finish = (next: LivePhase) => {
      stopped = true;
      clearTimer();
      setPhase(next);
    };

    const schedule = (delay: number) => {
      clearTimer();
      if (stopped || document.hidden) return;
      timer = setTimeout(() => void poll(), delay);
    };

    const poll = async () => {
      if (stopped || inFlight || document.hidden) return;
      inFlight = true;
      try {
        const response = await fetch(url, {
          headers: etag ? { 'If-None-Match': etag } : {},
          cache: 'no-store',
        });

        if (response.status === 304) {
          failures = 0;
          lastContact = Date.now();
          if (Date.now() - lastChange >= NO_CHANGE_STOP_MS) {
            finish('paused');
            return;
          }
          schedule(POLL_MS);
          return;
        }

        if (response.status === 404) {
          finish('paused');
          return;
        }

        if (!response.ok) throw new Error(`Tracking answered ${response.status}`);

        const answer = (await response.json()) as SnapshotAnswer;
        const nextEtag = response.headers.get('ETag');
        if (etag !== null && nextEtag !== null && nextEtag !== etag) {
          lastChange = Date.now();
          router.refresh();
        }
        etag = nextEtag;
        lastContact = Date.now();
        failures = 0;

        if (answer.final) {
          finish('final');
          return;
        }
        schedule(POLL_MS);
      } catch {
        failures += 1;
        if (Date.now() - lastContact >= NO_CHANGE_STOP_MS) {
          finish('offline');
          return;
        }
        schedule(Math.min(POLL_MS * 2 ** failures, MAX_BACKOFF_MS));
      } finally {
        inFlight = false;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        clearTimer();
        return;
      }
      if (stopped) return;
      lastChange = Date.now();
      lastContact = Date.now();
      void poll();
    };

    if (!document.hidden) void poll();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stopped = true;
      clearTimer();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [search, refreshToken, router]);

  useEffect(() => {
    const update = () => setSeconds(Math.floor((Date.now() - loadedAt) / 1000));
    const timer = setInterval(update, 5_000);
    return () => clearInterval(timer);
  }, [loadedAt]);

  return { phase, seconds, refresh };
}
