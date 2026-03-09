import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase service-role client for trusted server-side operations.
 * NEVER import this in Client Components — the server-only guard above enforces this.
 */
export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url)        throw new Error("[FTS] NEXT_PUBLIC_SUPABASE_URL is not set.");
  if (!serviceKey) throw new Error("[FTS] SUPABASE_SERVICE_ROLE_KEY is not set.");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
