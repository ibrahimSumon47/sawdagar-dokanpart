import { createHash } from 'node:crypto';
import { Redis } from '@upstash/redis';
import type { TrackingReference } from './liveSnapshot';

/** A snapshot answer can be reused for this long before the database is read again. */
export const SNAPSHOT_CACHE_TTL_SECONDS = 8;

/** The only fields a polling client needs; no order details are cached. */
export interface CachedSnapshot {
  fingerprint: string;
  status: string;
  final: boolean;
}

let redis: Redis | null = null;

/** Creates the Redis client on first use so a build without Upstash still succeeds. */
function getRedis(): Redis {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

/**
 * Builds a cache key from the access reference. An account key includes the
 * viewer id, so one buyer can never read another buyer's cached fingerprint.
 */
export function snapshotCacheKey(reference: TrackingReference): string {
  const identity =
    reference.kind === 'guest'
      ? `guest:${reference.orderCode}`
      : `account:${reference.userId}:${reference.number}`;
  return `sd:track:snapshot:${createHash('sha256').update(identity).digest('base64url')}`;
}

function isCachedSnapshot(value: unknown): value is CachedSnapshot {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.fingerprint === 'string' &&
    typeof candidate.status === 'string' &&
    typeof candidate.final === 'boolean'
  );
}

/**
 * Reads a cached snapshot. Cache misses and Redis failures both return null, so
 * tracking falls back to the database instead of failing the request; the
 * Upstash rate limit remains the abuse guard.
 */
export async function readSnapshotCache(key: string): Promise<CachedSnapshot | null> {
  try {
    const value = await getRedis().get<unknown>(key);
    return isCachedSnapshot(value) ? value : null;
  } catch {
    return null;
  }
}

/** Stores the small snapshot answer for a few seconds; a Redis failure is ignored. */
export async function writeSnapshotCache(key: string, value: CachedSnapshot): Promise<void> {
  try {
    await getRedis().set(key, value, { ex: SNAPSHOT_CACHE_TTL_SECONDS });
  } catch {
    return;
  }
}
