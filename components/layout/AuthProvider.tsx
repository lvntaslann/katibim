"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { claimAnonymousResults, declineClaim, shouldOfferClaim } from "@/lib/leaderboard/claim-anonymous";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  role: "user" | "admin";
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  showClaimBanner: boolean;
  acceptClaim: () => Promise<void>;
  dismissClaim: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showClaimBanner, setShowClaimBanner] = useState(false);

  const fetchProfile = useCallback(
    async (forUser: User) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url, role")
          .eq("id", forUser.id)
          .maybeSingle();
        if (data) return data as Profile;

        // The profile row can go missing even though the account is intact
        // (e.g. an accidental delete in Table Editor) — the handle_new_user
        // trigger only ever fires once, at signup, so it can't repair this.
        // Recreate it from the auth user's own metadata instead of leaving
        // the UI stuck on email/initial fallbacks forever.
        const metadata = forUser.user_metadata ?? {};
        const displayName =
          (metadata.display_name as string | undefined) ??
          (metadata.full_name as string | undefined) ??
          (metadata.name as string | undefined) ??
          forUser.email?.split("@")[0] ??
          "Kullanıcı";
        const avatarUrl =
          (metadata.avatar_url as string | undefined) ?? (metadata.picture as string | undefined) ?? null;

        const { data: healed, error: healError } = await supabase
          .from("profiles")
          .upsert(
            { id: forUser.id, display_name: displayName, avatar_url: avatarUrl, email: forUser.email ?? null },
            { onConflict: "id" }
          )
          .select("id, display_name, avatar_url, role")
          .maybeSingle();
        if (healError) {
          console.error("profile self-heal failed:", healError.message);
          return null;
        }
        return healed as Profile | null;
      } catch (err) {
        console.error("fetchProfile failed:", err instanceof Error ? err.message : err);
        return null;
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    fetchProfile(user).then((data) => {
      if (!cancelled) setProfile(data);
    });
    return () => {
      cancelled = true;
    };
  }, [user, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const data = await fetchProfile(user);
    setProfile(data);
  }, [user, fetchProfile]);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && shouldOfferClaim()) {
        setShowClaimBanner(true);
      }
      if (event === "SIGNED_OUT") {
        setShowClaimBanner(false);
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  const acceptClaim = useCallback(async () => {
    await claimAnonymousResults(supabase);
    setShowClaimBanner(false);
  }, [supabase]);

  const dismissClaim = useCallback(() => {
    declineClaim();
    setShowClaimBanner(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, showClaimBanner, acceptClaim, dismissClaim, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
