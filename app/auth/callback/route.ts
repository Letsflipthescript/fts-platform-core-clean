import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/session";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * GET /auth/callback
 *
 * Supabase redirects here after the user clicks their magic-link email.
 * 1. Exchanges the one-time code for a session
 * 2. Links the profiles row (keyed by contact_id via email match) to the
 *    Supabase auth.users id if not already linked
 * 3. Redirects to the dashboard
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
  }

  const supabase = createSessionClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("[FTS] auth callback error:", error?.message);
    return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
  }

  const userId = data.user.id;
  const email  = data.user.email ?? "";

  // Link the profile row to the Supabase user id if not already done.
  // The profile was created during onboarding (complete-onboarding route),
  // keyed by contact_id. We match on email to find it and set the id.
  try {
    const db = getServiceClient();

    // Check if a profile with this user id already exists
    const { data: existing } = await db
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existing) {
      // Try to find an unlinked profile by email match (set during onboarding
      // when GHL passes email into the init route — stored in the profile)
      const { data: unlinked } = await db
        .from("profiles")
        .select("contact_id")
        .eq("email", email)
        .is("id", null)
        .maybeSingle();

      if (unlinked) {
        // Link it
        await db
          .from("profiles")
          .update({ id: userId, updated_at: new Date().toISOString() })
          .eq("contact_id", unlinked.contact_id);
      } else {
        // No onboarding profile found — create a minimal one so the
        // dashboard still works (defaults to starter tier)
        await db.from("profiles").upsert(
          {
            id: userId,
            email,
            tier: "starter",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      }
    }
  } catch (e) {
    // Non-fatal — session is valid, profile link can be retried
    console.error("[FTS] profile link error:", e);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
