import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/token";
import { logEvent } from "@/lib/events";
import { Tier } from "@/lib/tier";
import type { OnboardingPayload } from "@/lib/onboarding/tokenPayload";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InitRequestBody {
  contact_id: string;
  email: string;
  first_name?: string;
  tier: Tier;
}

interface InitResponseBody {
  success: true;
  onboardingToken: string;
  onboardingLink: string;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const VALID_TIERS = new Set<string>([Tier.STARTER, Tier.PRO, Tier.ELITE]);

function parseTier(raw: unknown): Tier | null {
  if (typeof raw === "string" && VALID_TIERS.has(raw)) return raw as Tier;
  return null;
}

function validateBody(body: unknown): InitRequestBody | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be a JSON object." };
  }

  const b = body as Record<string, unknown>;

  if (!b.contact_id || typeof b.contact_id !== "string" || !b.contact_id.trim()) {
    return { error: "contact_id is required and must be a non-empty string." };
  }

  if (!b.email || typeof b.email !== "string" || !b.email.includes("@")) {
    return { error: "email is required and must be a valid email address." };
  }

  const tier = parseTier(b.tier);
  if (!tier) {
    return {
      error: `tier is required and must be one of: ${[...VALID_TIERS].join(", ")}.`,
    };
  }

  return {
    contact_id: b.contact_id.trim(),
    email:      b.email.trim().toLowerCase(),
    first_name: typeof b.first_name === "string" ? b.first_name.trim() : undefined,
    tier,
  };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  // ── 2. Validate fields ─────────────────────────────────────────────────────
  const validated = validateBody(raw);
  if ("error" in validated) {
    return NextResponse.json(
      { success: false, error: validated.error },
      { status: 422 }
    );
  }

  const { contact_id, email, first_name, tier } = validated;

  // ── 3. Build HMAC-signed token ─────────────────────────────────────────────
  // Payload must match OnboardingPayload so verifyOnboardingToken() on the
  // /onboarding/welcome page can parse and verify it correctly.
  const tokenPayload: OnboardingPayload = {
    contactId: contact_id,
    email,
    firstName: first_name,
    tier,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24-hour expiry
  };

  const onboardingToken = await signToken(JSON.stringify(tokenPayload));

  // ── 4. Build onboarding link ───────────────────────────────────────────────
  // Points to /onboarding/welcome — the first page in the 3-step flow.
  // Token is URL-encoded to safely carry the JSON payload + HMAC signature.
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const onboardingLink = `${baseUrl}/onboarding/welcome?token=${encodeURIComponent(onboardingToken)}`;

  // ── 5. Log the event ───────────────────────────────────────────────────────
  await logEvent({
    name: "onboarding_initiated",
    userId: contact_id,
    properties: {
      email,
      first_name: first_name ?? null,
      tier,
      onboarding_link: onboardingLink,
      ts: new Date().toISOString(),
    },
  });

  // ── 6. Return response ─────────────────────────────────────────────────────
  const response: InitResponseBody = {
    success: true,
    onboardingToken,
    onboardingLink,
  };

  return NextResponse.json(response, { status: 200 });
}
