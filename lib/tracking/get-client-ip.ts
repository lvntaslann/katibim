import "server-only";

/**
 * Trusts X-Real-IP first, then the left-most X-Forwarded-For entry.
 * Only correct behind a reverse proxy that sets these headers itself and
 * is the sole public entry point — see the deployment notes for the
 * hosting-side requirement (nginx/LiteSpeed must set these, and the app
 * must never be reachable directly).
 */
export function getClientIp(headers: Headers): string | null {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;

  return null;
}
