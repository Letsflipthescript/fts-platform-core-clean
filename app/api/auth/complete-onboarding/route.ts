import { NextRequest, NextResponse } from "next/server";
import { verifyOnboardingToken } from "@/lib/onboarding/tokenPayload";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/complete-onboarding
 *
 * Called when the user clicks "Finish Setup" at the end of onboarding.
 * Verifies the HMAC-signed onboarding token, then upserts a row in the
 * `profiles` table so the dashboard can read their tier after auth.
 *
 * The onboarding token carries: contactId, firstName, tier, exp.
 * Email is passed separately in the request body (it is not in the token
 * for size reasons) so the auth callback can match the profile to a
 * Supabase auth.users row by email on first sign-in.
 */
export async function POST(req: NextRequest) {
  // 1. Parse body
  let token: string | undefined;
  let email: string | undefined;
  try {
    const body = await req.json();
    token = typeof body.token === "string" ? body.token : undefined;
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // 2. Verify the onboarding token
  const result = await verifyOnboardingToken(token);
  if (!result.ok) {
    return NextResponse.json({ error: `Token ${result.reason}.` }, { status: 401 });
  }

  const { contactId, firstName, tier } = result.payload;

  // 3. Upsert the profile row keyed by contact_id
  const db = getServiceClient();
  const { error } = await db.from("profiles").upsert(
    {
      contact_id:                contactId,
      first_name:                firstName ?? null,
      email:                     email ?? null,
      tier,
      onboarding_completed_at:   new Date().toISOString(),
      updated_at:                new Date().toISOString(),
    },
    { onConflict: "contact_id" }
  );

  if (error) {
    console.error("[FTS] complete-onboarding upsert error:", error.message);
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
