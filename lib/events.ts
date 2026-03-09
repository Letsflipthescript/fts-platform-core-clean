export type FTSEventName =
  | "user.signup"
  | "user.login"
  | "subscription.upgraded"
  | "subscription.cancelled"
  | "feature.accessed"
  | "api.error"
  | "onboarding_initiated"
  | "onboarding_welcome_viewed"
  | "onboarding_setup_viewed"
  | "onboarding_menu_viewed"
  | "onboarding_completed";

export interface FTSEvent {
  name: FTSEventName;
  userId?: string;
  organizationId?: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

/** Log a platform event. Swap body for a real sink in production. */
export async function logEvent(event: FTSEvent): Promise<void> {
  const payload: FTSEvent = {
    ...event,
    timestamp: event.timestamp ?? new Date().toISOString(),
  };
  // TODO: Replace with PostHog, Segment, Supabase, etc.
  if (process.env.NODE_ENV !== "production") {
    console.log("[FTS:event]", JSON.stringify(payload));
  }
}
