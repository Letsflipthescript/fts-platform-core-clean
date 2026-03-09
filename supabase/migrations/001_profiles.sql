-- ============================================================
-- FTS Core v1 — Initial Schema
-- Migration: 001_profiles.sql
-- Run this in the Supabase SQL editor or via the CLI:
--   supabase db push
-- ============================================================

-- profiles
-- One row per FTS user. Created during onboarding (keyed by contact_id),
-- then linked to auth.users via id on first magic-link sign-in.
-- ============================================================

create table if not exists public.profiles (
  -- Supabase auth user id — set when user completes magic-link sign-in.
  -- Null until then (profile exists from onboarding before auth).
  id              uuid references auth.users(id) on delete cascade,

  -- GoHighLevel contact id — the primary key during onboarding.
  -- Always present. Used to link the profile to the auth user on first login.
  contact_id      text unique not null,

  -- User info from the onboarding token
  email           text,
  first_name      text,

  -- FTS plan tier: starter | pro | elite
  tier            text not null default 'starter'
                  check (tier in ('starter', 'pro', 'elite')),

  -- Timestamps
  onboarding_completed_at timestamptz,
  updated_at              timestamptz not null default now(),
  created_at              timestamptz not null default now()
);

-- Allow fast lookup by Supabase user id (used by getSession())
create index if not exists profiles_id_idx        on public.profiles (id);
create index if not exists profiles_email_idx     on public.profiles (email);

-- ── Row Level Security ────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (for future self-serve fields)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role bypasses RLS — used by complete-onboarding and auth callback
-- (no policy needed; service role key ignores RLS by default)

-- ── onboarding_events (optional — used if SUPABASE_SERVICE_ROLE_KEY is set) ──
create table if not exists public.onboarding_events (
  id         bigserial primary key,
  contact_id text        not null,
  event      text        not null,
  meta       jsonb,
  created_at timestamptz not null default now()
);

create index if not exists onboarding_events_contact_idx on public.onboarding_events (contact_id);

alter table public.onboarding_events enable row level security;
-- No user-facing RLS policies — service role only
