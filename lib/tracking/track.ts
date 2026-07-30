import { getAnonymousClientId } from "@/lib/anonymous-identity";
import { getTrackingSessionId } from "@/lib/tracking/client-session";
import type { CustomEventType } from "@/lib/tracking/payload";

let currentEventId: number | null = null;
let pageStartedAt = 0;

function post(body: unknown, useBeacon = false) {
  if (typeof window === "undefined") return;

  if (useBeacon && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

/** Patches duration_sec onto the page just left, if one was recorded. */
export function flushPageDuration() {
  if (currentEventId == null || !pageStartedAt) return;
  const duration_sec = Math.round((Date.now() - pageStartedAt) / 1000);
  post(
    {
      kind: "duration",
      client_session_id: getTrackingSessionId(),
      event_id: currentEventId,
      duration_sec,
    },
    true
  );
  currentEventId = null;
  pageStartedAt = 0;
}

export function trackPageview(path: string, userId: string | null) {
  flushPageDuration();
  pageStartedAt = Date.now();

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "pageview",
      client_session_id: getTrackingSessionId(),
      anonymous_client_id: getAnonymousClientId() || null,
      user_id: userId,
      path,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    }),
    keepalive: true,
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data?.eventId != null) currentEventId = data.eventId;
    })
    .catch(() => {});
}

export function trackEvent(eventType: CustomEventType, metadata?: Record<string, unknown>) {
  post({
    kind: "event",
    client_session_id: getTrackingSessionId(),
    event_type: eventType,
    metadata,
  });
}
