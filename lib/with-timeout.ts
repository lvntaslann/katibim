const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Bounds how long the UI waits on a promise before giving up. A slow or
 * silently-hanging network call (bad connection, blocked request) must not
 * leave a loading state on screen indefinitely — resolves to `null` on
 * timeout so callers can tell "timed out" apart from "genuinely empty".
 */
export function withTimeout<T>(promise: Promise<T>, ms = DEFAULT_TIMEOUT_MS): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}
