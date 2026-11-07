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

let limiters: { ip: Ratelimit; order: Ratelimit } | null = null;

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

/** Returns true when either the client IP or the order code is over its limit. */
export async function isTrackingLimited(ipAddress: string, orderCode: string): Promise<boolean> {
  const { ip, order } = getLimiters();
  const [byIp, byOrder] = await Promise.all([
    ip.limit(ipAddress || 'unknown'),
    order.limit(orderCode),
  ]);
  return !byIp.success || !byOrder.success;
}
