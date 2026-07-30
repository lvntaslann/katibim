import "server-only";

/**
 * In-memory per-IP fixed-window limiter. Only valid because the tracking
 * route runs as a single long-lived Node process (cPanel Node.js Selector /
 * Passenger, one instance) — this state is not shared across restarts or
 * multiple instances.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;

const buckets = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}
