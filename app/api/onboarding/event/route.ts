import { NextRequest, NextResponse } from "next/server";
import { verifyOnboardingToken } from "@/lib/onboarding/tokenPayload";
import { logEvent, FTSEventName } from "@/lib/events";

const VALID_EVENTS = new Set<FTSEventName>([
  "onboarding_welcome_viewed",
  "onboarding_setup_viewed",
  "onboarding_menu_viewed",
  "onboarding_completed",
]);

function isValidEvent(v: unknown): v is FTSEventName {
  return typeof v === "string" && VALID_EVENTS.has(v as FTSEventName);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { token, event, meta } = body as Record<string, unknown>;

  // Verify token
  const result = await verifyOnboardingToken(typeof token === "string" ? token : null);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "Invalid or expired token" }, { status: 401 });
  }

  // Validate event name
  if (!isValidEvent(event)) {
    return NextResponse.json({ ok: false, error: "Unknown event name" }, { status: 400 });
  }

  const { payload } = result;
  const properties: Record<string, unknown> = {
    tier: payload.tier,
    ...(typeof meta === "object" && meta !== null ? (meta as Record<string, unknown>) : {}),
  };

  // Always log via lib/events
  await logEvent({ name: event, userId: payload.contactId, properties });

  // Optionally persist to Supabase — skipped gracefully if not configured
  try {
    const supabaseConfigured =
      !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseConfigured) {
      const { getServiceClient } = await import("@/lib/supabase/server");
      const db = getServiceClient();
      await db.from("onboarding_events").insert({
        event_name:  event,
        contact_id:  payload.contactId,
        tier:        payload.tier,
        properties,
        created_at:  new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn("[FTS] Supabase write skipped:", (err as Error).message);
  }

  return NextResponse.json({ ok: true });
}
