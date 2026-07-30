import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/", request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Writing cookies directly onto `response` (rather than the ambient
  // cookies() store) guarantees the session-clearing Set-Cookie headers
  // land on the exact response the browser navigates to — the shared
  // server client's setAll silently no-ops outside a mutable context,
  // which left the browser holding a stale session cookie after logout.
  await supabase.auth.signOut();

  return response;
}
