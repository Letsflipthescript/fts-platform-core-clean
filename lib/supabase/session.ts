import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Tier } from "@/lib/tier";
type CookieToSet = Parameters<CookieMethodsServer["setAll"]>[0][number];
/**
 * Returns a cookie-aware Supabase client for use in Server Components,
 * Server Actions, and API Route Handlers.
 * Read-only for cookies — writes go through middleware or API routes.
 */
export function createSessionClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      setAll(cookiesToSet: CookieToSet[]) {  
          // Server Components cannot set cookies — mutations happen in middleware.
          // This is intentionally a no-op here.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silently ignore in read-only render contexts.
          }
        },
      },
    }
  );
}

export interface FTSSession {
  userId: string;
  email: string;
  firstName: string | null;
  tier: Tier;
}

/**
 * Returns the current FTS session (user + profile) or null if not
 * authenticated. Reads from the profiles table.
 */
export async function getSession(): Promise<FTSSession | null> {
  try {
    const supabase = createSessionClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, tier")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;

    const rawTier = profile.tier as string;
    const tier: Tier =
      rawTier === Tier.PRO    ? Tier.PRO    :
      rawTier === Tier.ELITE  ? Tier.ELITE  :
      Tier.STARTER;

    return {
      userId:    user.id,
      email:     user.email ?? "",
      firstName: profile.first_name ?? null,
      tier,
    };
  } catch {
    return null;
  }
}
