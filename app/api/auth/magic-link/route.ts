import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * POST /api/auth/magic-link
 * Sends a Supabase magic-link email to the provided address.
 * Called by LoginForm on the /login page.
 */
export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 422 });
  }

  const supabase = createSessionClient();
  const redirectTo =
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    console.error("[FTS] magic-link error:", error.message);
    return NextResponse.json({ error: "Could not send sign-in link." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
