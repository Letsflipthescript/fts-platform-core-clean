#!/usr/bin/env node
/**
 * scripts/gen-test-token.mjs
 * Generate a signed FTS onboarding token for local dev / testing.
 * Requires Node 18+ (built-in Web Crypto API).
 *
 * Usage:
 *   FTS_TOKEN_SECRET=my-secret node scripts/gen-test-token.mjs
 *   FTS_TOKEN_SECRET=my-secret node scripts/gen-test-token.mjs pro
 *   FTS_TOKEN_SECRET=my-secret node scripts/gen-test-token.mjs elite
 */

const tier = process.argv[2] ?? "starter";
const VALID = ["starter", "pro", "elite"];

if (!VALID.includes(tier)) {
  console.error(`Bad tier "${tier}". Use: ${VALID.join(" | ")}`);
  process.exit(1);
}

const secret = process.env.FTS_TOKEN_SECRET;
if (!secret) {
  console.error("FTS_TOKEN_SECRET is not set.");
  console.error("Example: FTS_TOKEN_SECRET=my-dev-secret node scripts/gen-test-token.mjs");
  process.exit(1);
}

const payload = JSON.stringify({
  contactId:   "dev-contact-001",
  firstName:   "Alex",
  companyName: "Acme Corp",
  tier,
  exp: Math.floor(Date.now() / 1000) + 86400, // 24 hrs
});

const enc = new TextEncoder();
const key = await crypto.subtle.importKey(
  "raw", enc.encode(secret),
  { name: "HMAC", hash: "SHA-256" },
  false, ["sign"]
);
const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2,"0")).join("");
const token = `${payload}.${hex}`;
const t = encodeURIComponent(token);
const base = "http://localhost:3000";

console.log("\n=== FTS Dev Token ===");
console.log(`Tier:    ${tier}`);
console.log(`Expires: ${new Date(JSON.parse(payload).exp * 1000).toISOString()}\n`);
console.log(`Step 1 — Welcome:\n  ${base}/onboarding/welcome?token=${t}\n`);
console.log(`Step 2 — Setup:\n  ${base}/onboarding/setup?token=${t}\n`);
console.log(`Step 3 — Menu:\n  ${base}/onboarding/menu?token=${t}\n`);
console.log(`Event API (raw token for curl):\n  ${token}\n`);
