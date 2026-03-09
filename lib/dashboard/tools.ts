import { Tier } from "@/lib/tier";

// ---------------------------------------------------------------------------
// FTS Core v1 tool catalogue
// Each tool declares the minimum tier required to access it.
// Shell cards only — no backend logic yet.
// ---------------------------------------------------------------------------

export interface DashboardTool {
  id: string;
  label: string;
  description: string;
  requiredTier: Tier;
  href: string; // placeholder route — tools not built yet
}

export const TOOLS: DashboardTool[] = [
  // ── Starter ──────────────────────────────────────────────────────────────
  {
    id: "offer_generator",
    label: "Offer Generator",
    description: "Build a fast, professional offer for any wholesale deal. Fill in the numbers and generate a clean PDF offer in seconds.",
    requiredTier: Tier.STARTER,
    href: "/tools/offer-generator",
  },
  {
    id: "deal_page",
    label: "Deal Page Builder",
    description: "Create a shareable deal page for your property. Drop in the details, publish the link, and send it to your buyers.",
    requiredTier: Tier.STARTER,
    href: "/tools/deal-page",
  },
  {
    id: "buyer_blast",
    label: "Buyer Blast",
    description: "Push your deal to your buyer list through GoHighLevel. One click sends your deal to the right buyers automatically.",
    requiredTier: Tier.STARTER,
    href: "/tools/buyer-blast",
  },
  // ── Pro ──────────────────────────────────────────────────────────────────
  {
    id: "cash_buyer_magnet",
    label: "Cash Buyer Magnet",
    description: "Capture and qualify inbound cash buyers with automated intake forms and follow-up sequences.",
    requiredTier: Tier.PRO,
    href: "/tools/buyer-magnet",
  },
  {
    id: "deal_analyzer",
    label: "Deal Analyzer",
    description: "Run the numbers on any deal. ARV, repair estimate, MAO, and profit margin — all in one view.",
    requiredTier: Tier.PRO,
    href: "/tools/deal-analyzer",
  },
  {
    id: "smart_followups",
    label: "Smart Follow-Ups",
    description: "Automated follow-up sequences for leads who didn't respond. Set it once, let GHL do the work.",
    requiredTier: Tier.PRO,
    href: "/tools/smart-followups",
  },
  // ── Elite ─────────────────────────────────────────────────────────────────
  {
    id: "marketplace",
    label: "Marketplace",
    description: "List and distribute your deals across the FTS buyer network. Maximum exposure for every deal you flip.",
    requiredTier: Tier.ELITE,
    href: "/tools/marketplace",
  },
  {
    id: "advanced_automations",
    label: "Advanced Automations",
    description: "Full automation suite for acquisitions, follow-up, and disposition. Built on top of your GHL workflows.",
    requiredTier: Tier.ELITE,
    href: "/tools/automations",
  },
  {
    id: "investor_suite",
    label: "Investor Suite",
    description: "End-to-end deal management for high-volume investors. Pipeline tracking, reporting, and team coordination.",
    requiredTier: Tier.ELITE,
    href: "/tools/investor-suite",
  },
];

// ---------------------------------------------------------------------------
// Tier rank — local to this module, consistent with lib/tier.ts
// ---------------------------------------------------------------------------

const TIER_RANK: Record<Tier, number> = {
  [Tier.STARTER]: 0,
  [Tier.PRO]:     1,
  [Tier.ELITE]:   2,
};

export interface ToolSets {
  unlocked: DashboardTool[];
  locked:   DashboardTool[];
}

/**
 * Returns unlocked and locked tool lists for a given tier.
 * Drives the dashboard card layout.
 */
export function getToolsForTier(tier: Tier): ToolSets {
  const rank = TIER_RANK[tier];
  return {
    unlocked: TOOLS.filter((t) => TIER_RANK[t.requiredTier] <= rank),
    locked:   TOOLS.filter((t) => TIER_RANK[t.requiredTier] > rank),
  };
}

/**
 * Returns the display label for a tier.
 */
export function tierLabel(tier: Tier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

/**
 * Returns the upgrade target for a given tier (the next tier up).
 * Returns null if already on Elite.
 */
export function upgradeTarget(tier: Tier): Tier | null {
  if (tier === Tier.STARTER) return Tier.PRO;
  if (tier === Tier.PRO)     return Tier.ELITE;
  return null;
}
