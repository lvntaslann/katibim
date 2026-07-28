import { createClient } from "@/utils/supabase/client";
import { getAnonymousClientId, getAnonymousName, markAnonymousActivity } from "@/lib/anonymous-identity";
import type { TestResultInput } from "@/types/leaderboard";

/**
 * Logged-in users are recorded on every completed test (this is what drives
 * their profile contribution calendar). Anonymous visitors are only
 * recorded once they've opted in with a name — no silent anonymous writes.
 *
 * `userId` is passed in by the caller (from the already-resolved auth
 * context) rather than re-derived here via a fresh `getUser()` call — two
 * independent async auth checks for the same submission could disagree
 * about whether the visitor is logged in, causing the same test to be
 * recorded once anonymously and once under the account.
 */
export async function submitResult(input: TestResultInput, userId: string | null): Promise<void> {
  try {
    const supabase = createClient();

    const base = {
      mode: input.mode,
      layout: input.layout,
      net_wpm: input.netWpm,
      gross_wpm: input.grossWpm,
      accuracy: input.accuracy,
      // duration_sec is an integer column — the engine reports elapsed time
      // as a precise float (e.g. 60.0326...), which Postgres rejects as-is.
      duration_sec: Math.round(input.durationSec),
      institution_id: input.institutionId ?? null,
      lesson_id: input.lessonId ?? null,
      passed: input.passed ?? null,
      client_session_id: input.clientSessionId,
    };

    if (userId) {
      const { error } = await supabase
        .from("test_results")
        .upsert({ ...base, user_id: userId }, { onConflict: "client_session_id", ignoreDuplicates: true });
      if (error) console.error("submitResult (authenticated) failed:", error.message);
      return;
    }

    const anonymousName = getAnonymousName();
    if (!anonymousName) return;

    const { error } = await supabase.from("test_results").upsert(
      {
        ...base,
        anonymous_name: anonymousName,
        anonymous_client_id: getAnonymousClientId(),
      },
      { onConflict: "client_session_id", ignoreDuplicates: true }
    );
    if (error) {
      console.error("submitResult (anonymous) failed:", error.message);
      return;
    }
    markAnonymousActivity();
  } catch (err) {
    // Called fire-and-forget from every completion flow — a network hiccup
    // here must never surface as an unhandled rejection or block the UI.
    console.error("submitResult failed:", err instanceof Error ? err.message : err);
  }
}
