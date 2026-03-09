import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a browser-safe Supabase client (anon key).
 * Env vars read lazily — safe to import without Supabase configured.
 */
export function getClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "[FTS] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
    );
  }
  return createClient(url, anonKey);
}
