import "server-only";

/**
 * In-memory per-IP fixed-window limiter. Only valid because the tracking
 * route runs as a single long-lived Node process (cPanel Node.js Selector /
 * Passenger, one instance) — this state is not shared across restarts or
 * multiple instances.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;
const MAX_BUCKETS = 10_000;

const buckets = new Map<string, { count: number; windowStart: number }>();
let nextCleanupAt = 0;

function cleanupExpired(now: number) {
  if (now < nextCleanupAt) return;
  nextCleanupAt = now + WINDOW_MS;
  for (const [ip, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) buckets.delete(ip);
  }
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  cleanupExpired(now);
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    // Headers are attacker-controlled until the reverse proxy sanitizes
    // them. Never permit unique spoofed values to grow this process map
    // without bound; fail closed once the active bucket limit is reached.
    if (buckets.size >= MAX_BUCKETS) return true;
    buckets.set(ip, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}
