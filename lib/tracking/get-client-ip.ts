import "server-only";
import { isIP } from "node:net";

/**
 * Trusts X-Real-IP first, then the left-most X-Forwarded-For entry.
 * Only correct behind a reverse proxy that sets these headers itself and
 * is the sole public entry point — see the deployment notes for the
 * hosting-side requirement (nginx/LiteSpeed must set these, and the app
 * must never be reachable directly).
 */
export function getClientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp && isIP(realIp)) return realIp;

  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwardedFor && isIP(forwardedFor)) return forwardedFor;

  // Keep the rate limiter bounded when the hosting proxy does not expose a
  // canonical client IP. This bucket is deliberately shared, rather than
  // trusting arbitrary header text as a map key.
  return "unknown";
}
