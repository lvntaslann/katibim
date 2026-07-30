const SESSION_KEY = "katibim:trackingSessionId";

/** Get-or-create a per-tab tracking id, scoped to one browsing session. */
export function getTrackingSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
