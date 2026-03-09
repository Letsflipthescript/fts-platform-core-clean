/**
 * GoHighLevel (GHL) API Client — Typed Placeholder
 * Env vars are read inside functions only — safe to import without GHL config.
 */

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

function getHeaders(): HeadersInit {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) throw new Error("[FTS] GHL_API_KEY env var is not set.");
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Version: GHL_API_VERSION,
  };
}

async function ghlFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${GHL_BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[FTS] GHL API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface GHLContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  locationId: string;
}

export async function getContact(contactId: string): Promise<GHLContact> {
  return ghlFetch<GHLContact>(`/contacts/${contactId}`);
}

export const ghlClient = { getContact };
