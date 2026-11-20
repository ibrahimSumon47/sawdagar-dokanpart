import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Tracking lookups are capped per client IP and per order code. Both limits use
 * a sliding window in Upstash Redis, so a counter survives serverless cold starts.
 */
/** The two tracking windows, exported so a test can hold them in place. */
export const TRACKING_LIMITS = {
  perIp: { requests: 20, window: '10 m' },
  perOrder: { requests: 8, window: '10 m' },
} as const;

/**
 * Live polling is cheaper than the old stream but still finishes a function on
 * every call, so one address gets 90 checks per ten minutes: three tabs polling
 * every 25 seconds fit, while a script cannot drive a busy loop.
 */
export const LIVE_POLL_LIMITS = {
  perIp: { requests: 90, window: '10 m' },
} as const;

let limiters: { ip: Ratelimit; order: Ratelimit } | null = null;
let liveLimiter: Ratelimit | null = null;

/** Builds the two limiters once per isolate. Throws a clear error when Upstash is not configured. */
function getLimiters(): { ip: Ratelimit; order: Ratelimit } {
  if (limiters) return limiters;
  const redis = Redis.fromEnv();
  limiters = {
    ip: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        TRACKING_LIMITS.perIp.requests,
        TRACKING_LIMITS.perIp.window,
      ),
      prefix: 'sd:track:ip',
    }),
    order: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        TRACKING_LIMITS.perOrder.requests,
        TRACKING_LIMITS.perOrder.window,
      ),
      prefix: 'sd:track:order',
    }),
  };
  return limiters;
}

/**
 * Returns true when one address is polling too often. It fails open when Redis is
 * unavailable: this is a read-only endpoint and access still needs the signed
 * cookie or the viewer's session.
 */
export async function isLiveTrackingLimited(ipAddress: string): Promise<boolean> {
  try {
    if (!liveLimiter) {
      liveLimiter = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(
          LIVE_POLL_LIMITS.perIp.requests,
          LIVE_POLL_LIMITS.perIp.window,
        ),
        prefix: 'sd:track:poll',
      });
    }
    const result = await liveLimiter.limit(ipAddress || 'unknown');
    return !result.success;
  } catch {
    return false;
  }
}

/** Returns true when either the client IP or the order code is over its limit. */
export async function isTrackingLimited(ipAddress: string, orderCode: string): Promise<boolean> {
  const { ip, order } = getLimiters();
  const [byIp, byOrder] = await Promise.all([
    ip.limit(ipAddress || 'unknown'),
    order.limit(orderCode),
  ]);
  return !byIp.success || !byOrder.success;
}
