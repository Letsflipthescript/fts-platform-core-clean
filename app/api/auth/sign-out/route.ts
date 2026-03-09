import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * POST /api/auth/sign-out
 * Signs the user out and redirects to /login.
 * Called by the sign-out form in the dashboard header.
 */
export async function POST() {
  const supabase = createSessionClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
  );
}
