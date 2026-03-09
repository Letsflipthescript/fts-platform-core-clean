export enum Tier {
  STARTER = "starter",
  PRO = "pro",
  ELITE = "elite",
}

const TIER_RANK: Record<Tier, number> = {
  [Tier.STARTER]: 0,
  [Tier.PRO]: 1,
  [Tier.ELITE]: 2,
};

/** Returns true if userTier meets or exceeds requiredTier. */
export function canAccess(userTier: Tier, requiredTier: Tier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}

/** Throws if userTier does not meet requiredTier. Use in API routes / Server Actions. */
export function assertTier(userTier: Tier, requiredTier: Tier): void {
  if (!canAccess(userTier, requiredTier)) {
    throw new Error(
      `[FTS] Access denied. Required: ${requiredTier}, current: ${userTier}.`
    );
  }
}
