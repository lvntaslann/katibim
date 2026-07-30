export type CustomEventType = "exam_complete" | "lesson_complete";

export interface PageviewPayload {
  kind: "pageview";
  client_session_id: string;
  anonymous_client_id: string | null;
  user_id: string | null;
  path: string;
  referrer: string | null;
}

export interface DurationPayload {
  kind: "duration";
  client_session_id: string;
  event_id: number;
  duration_sec: number;
}

export interface CustomEventPayload {
  kind: "event";
  client_session_id: string;
  event_type: CustomEventType;
  metadata?: Record<string, unknown>;
}

export type TrackPayload = PageviewPayload | DurationPayload | CustomEventPayload;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_PATH_LEN = 300;
const MAX_METADATA_BYTES = 500;

function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

function sanitizeMetadata(value: unknown): Record<string, unknown> | undefined {
  if (value == null || typeof value !== "object") return undefined;
  const json = JSON.stringify(value);
  if (json.length > MAX_METADATA_BYTES) return undefined;
  return value as Record<string, unknown>;
}

/** Throws on malformed input — callers should treat any throw as a 400. */
export function parseTrackPayload(body: unknown): TrackPayload {
  if (typeof body !== "object" || body === null) throw new Error("invalid body");
  const b = body as Record<string, unknown>;

  if (b.kind === "pageview") {
    if (!isUuid(b.client_session_id)) throw new Error("invalid client_session_id");
    if (typeof b.path !== "string" || b.path.length === 0 || b.path.length > MAX_PATH_LEN) {
      throw new Error("invalid path");
    }
    return {
      kind: "pageview",
      client_session_id: b.client_session_id,
      anonymous_client_id: isUuid(b.anonymous_client_id) ? b.anonymous_client_id : null,
      user_id: isUuid(b.user_id) ? b.user_id : null,
      path: b.path,
      referrer: typeof b.referrer === "string" ? b.referrer.slice(0, MAX_PATH_LEN) : null,
    };
  }

  if (b.kind === "duration") {
    if (!isUuid(b.client_session_id)) throw new Error("invalid client_session_id");
    if (typeof b.event_id !== "number" || !Number.isInteger(b.event_id)) throw new Error("invalid event_id");
    if (typeof b.duration_sec !== "number" || b.duration_sec < 0 || b.duration_sec > 86400) {
      throw new Error("invalid duration_sec");
    }
    return {
      kind: "duration",
      client_session_id: b.client_session_id,
      event_id: b.event_id,
      duration_sec: Math.round(b.duration_sec),
    };
  }

  if (b.kind === "event") {
    if (!isUuid(b.client_session_id)) throw new Error("invalid client_session_id");
    if (b.event_type !== "exam_complete" && b.event_type !== "lesson_complete") {
      throw new Error("invalid event_type");
    }
    return {
      kind: "event",
      client_session_id: b.client_session_id,
      event_type: b.event_type,
      metadata: sanitizeMetadata(b.metadata),
    };
  }

  throw new Error("invalid kind");
}
