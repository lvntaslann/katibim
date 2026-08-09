import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/insights");

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) redirect("/");

  return <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-12">{children}</main>;
}
