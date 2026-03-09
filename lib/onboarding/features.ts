import { Tier } from "@/lib/tier";

// ---------------------------------------------------------------------------
// Feature list shown on the onboarding /menu page (Step 3).
// Kept separate from lib/dashboard/tools.ts so onboarding copy
// can be concise and onboarding-specific.
// ---------------------------------------------------------------------------

export interface Feature {
  id: string;
  label: string;
  description: string;
  requiredTier: Tier;
}

const TIER_RANK: Record<Tier, number> = {
  [Tier.STARTER]: 0,
  [Tier.PRO]:     1,
  [Tier.ELITE]:   2,
};

const CATALOGUE: Feature[] = [
  {
    id: "offer_generator",
    label: "Offer Generator",
    description: "Generate professional wholesale offers in seconds.",
    requiredTier: Tier.STARTER,
  },
  {
    id: "deal_page",
    label: "Deal Page Builder",
    description: "Create a shareable deal page and send it straight to buyers.",
    requiredTier: Tier.STARTER,
  },
  {
    id: "buyer_blast",
    label: "Buyer Blast",
    description: "Push your deal to your buyer list through GoHighLevel automatically.",
    requiredTier: Tier.STARTER,
  },
  {
    id: "cash_buyer_magnet",
    label: "Cash Buyer Magnet",
    description: "Capture and qualify inbound cash buyers with automated intake and follow-up.",
    requiredTier: Tier.PRO,
  },
  {
    id: "deal_analyzer",
    label: "Deal Analyzer",
    description: "ARV, repair estimate, MAO, and profit margin — all in one view.",
    requiredTier: Tier.PRO,
  },
  {
    id: "smart_followups",
    label: "Smart Follow-Ups",
    description: "Automated follow-up sequences for leads that didn't respond.",
    requiredTier: Tier.PRO,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "List deals across the FTS buyer network for maximum exposure.",
    requiredTier: Tier.ELITE,
  },
  {
    id: "advanced_automations",
    label: "Advanced Automations",
    description: "Full automation suite for acquisitions, follow-up, and disposition.",
    requiredTier: Tier.ELITE,
  },
  {
    id: "investor_suite",
    label: "Investor Suite",
    description: "End-to-end deal management for high-volume investors.",
    requiredTier: Tier.ELITE,
  },
];

export interface FeatureSets {
  unlocked: Feature[];
  locked:   Feature[];
}

export function getFeaturesForTier(tier: Tier): FeatureSets {
  const rank = TIER_RANK[tier];
  return {
    unlocked: CATALOGUE.filter((f) => TIER_RANK[f.requiredTier] <= rank),
    locked:   CATALOGUE.filter((f) => TIER_RANK[f.requiredTier] > rank),
  };
}
