import type { SupabaseClient } from "@supabase/supabase-js";
import {
  clearAnonymousIdentity,
  clearPendingClaim,
  getAnonymousClientId,
  hasPendingClaim,
} from "@/lib/anonymous-identity";

export function shouldOfferClaim(): boolean {
  return hasPendingClaim();
}

export function declineClaim() {
  clearPendingClaim();
}

/** Merges this browser's anonymous results into the now-authenticated account via the claim_anonymous_results RPC. */
export async function claimAnonymousResults(supabase: SupabaseClient): Promise<number> {
  const clientId = getAnonymousClientId();
  const { data, error } = await supabase.rpc("claim_anonymous_results", { client_id: clientId });
  if (error) throw error;
  clearPendingClaim();
  clearAnonymousIdentity();
  return typeof data === "number" ? data : 0;
}
