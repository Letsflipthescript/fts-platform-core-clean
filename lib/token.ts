/**
 * HMAC-SHA256 sign / verify utility.
 * Uses the Web Crypto API — works in Node 18+, Edge Runtime.
 * Requires env: FTS_TOKEN_SECRET
 */

function getSecret(): string {
  const secret = process.env.FTS_TOKEN_SECRET;
  if (!secret) throw new Error("[FTS] FTS_TOKEN_SECRET env var is not set.");
  return secret;
}

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Signs a payload string and returns payload.hex-signature */
export async function signToken(payload: string): Promise<string> {
  const key = await importKey(getSecret());
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${bufferToHex(sig)}`;
}

/** Verifies a token from signToken. Returns original payload or throws. */
export async function verifyToken(token: string): Promise<string> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) throw new Error("[FTS] Malformed token.");

  const payload = token.slice(0, lastDot);
  const sigHex = token.slice(lastDot + 1);
  const key = await importKey(getSecret());
  const enc = new TextEncoder();

  const sigBytes = Uint8Array.from(
    sigHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
  if (!valid) throw new Error("[FTS] Token verification failed.");
  return payload;
}
