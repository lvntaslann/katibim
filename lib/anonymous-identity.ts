const CLIENT_ID_KEY = "katibim:anonId";
const NAME_KEY = "katibim:anonName";
const HAS_ACTIVITY_KEY = "katibim:anonHasSubmissions";
const PROMPT_DISMISSED_KEY = "katibim:anonPromptDismissed";
const PENDING_CLAIM_KEY = "katibim:pendingClaim";

function readLS(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLS(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function removeLS(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

/** Get-or-create a stable per-browser id used to attach/claim anonymous leaderboard entries. */
export function getAnonymousClientId(): string {
  if (typeof window === "undefined") return "";
  let id = readLS(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    writeLS(CLIENT_ID_KEY, id);
  }
  return id;
}

export function getAnonymousName(): string | null {
  return readLS(NAME_KEY);
}

export function setAnonymousName(name: string) {
  writeLS(NAME_KEY, name.trim());
}

/** Only set after a real anonymous insert succeeds, so the post-signup claim offer never fires for someone who never actually appeared on a leaderboard. */
export function hasAnonymousActivity(): boolean {
  return readLS(HAS_ACTIVITY_KEY) === "1";
}

export function markAnonymousActivity() {
  writeLS(HAS_ACTIVITY_KEY, "1");
}

/** The opt-in ("want to appear on the leaderboard?") ask happens once, not on every completed test. */
export function wasAnonPromptDismissed(): boolean {
  return readLS(PROMPT_DISMISSED_KEY) === "1";
}

export function dismissAnonPrompt() {
  writeLS(PROMPT_DISMISSED_KEY, "1");
}

/** Set at signup time; consumed on the next SIGNED_IN event (immediate session or delayed email confirmation, same browser). */
export function markPendingClaim() {
  writeLS(PENDING_CLAIM_KEY, "1");
}

export function hasPendingClaim(): boolean {
  return readLS(PENDING_CLAIM_KEY) === "1";
}

export function clearPendingClaim() {
  removeLS(PENDING_CLAIM_KEY);
}

export function clearAnonymousIdentity() {
  removeLS(CLIENT_ID_KEY);
  removeLS(NAME_KEY);
  removeLS(HAS_ACTIVITY_KEY);
  removeLS(PROMPT_DISMISSED_KEY);
}
