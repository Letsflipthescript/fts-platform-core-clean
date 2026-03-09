import { verifyToken } from "@/lib/token";
import { Tier } from "@/lib/tier";

export interface OnboardingPayload {
  contactId: string;
  email?: string;
  firstName?: string;
  companyName?: string;
  tier: Tier;
  exp: number; // Unix timestamp seconds
}

export type TokenVerifyResult =
  | { ok: true; payload: OnboardingPayload }
  | { ok: false; reason: "missing" | "invalid" | "expired" };

function parseTier(raw: unknown): Tier | null {
  if (raw === Tier.STARTER) return Tier.STARTER;
  if (raw === Tier.PRO)     return Tier.PRO;
  if (raw === Tier.ELITE)   return Tier.ELITE;
  return null;
}

function parsePayload(raw: string): OnboardingPayload | null {
  try {
    const obj = JSON.parse(raw);
    if (typeof obj !== "object" || obj === null) return null;
    const tier = parseTier(obj.tier);
    if (!tier) return null;
    if (typeof obj.contactId !== "string") return null;
    if (typeof obj.exp !== "number") return null;
    return {
      contactId:   obj.contactId,
      email:       typeof obj.email       === "string" ? obj.email       : undefined,
      firstName:   typeof obj.firstName   === "string" ? obj.firstName   : undefined,
      companyName: typeof obj.companyName === "string" ? obj.companyName : undefined,
      tier,
      exp: obj.exp,
    };
  } catch {
    return null;
  }
}

/**
 * Verifies HMAC signature, parses payload, checks expiry.
 * Never throws — returns a discriminated union.
 */
export async function verifyOnboardingToken(
  token: string | null | undefined
): Promise<TokenVerifyResult> {
  if (!token) return { ok: false, reason: "missing" };

  let rawPayload: string;
  try {
    rawPayload = await verifyToken(token);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  const payload = parsePayload(rawPayload);
  if (!payload) return { ok: false, reason: "invalid" };
  if (Date.now() / 1000 > payload.exp) return { ok: false, reason: "expired" };

  return { ok: true, payload };
}
