export const ftsConfig = {
  app: {
    name: "Flip The Script",
    slug: "fts",
    url:          process.env.NEXT_PUBLIC_APP_URL  ?? "http://localhost:3000",
    supportEmail: process.env.FTS_SUPPORT_EMAIL    ?? "support@flipthescript.io",
  },
  tiers: {
    defaultTier: "starter" as const,
  },
  flags: {
    allowSignups:   process.env.FTS_ALLOW_SIGNUPS   !== "false",
    verboseLogging: process.env.FTS_VERBOSE_LOGGING === "true",
  },
} as const;

export type FTSConfig = typeof ftsConfig;
