-- Migration: Add Safety Flags Table
-- Date: 2026-05-04

CREATE TABLE IF NOT EXISTS public.safety_flags (
  id bigint generated always as identity primary key,
  session_id text,
  anonymous_token text,
  trigger_phrase text not null,
  severity text default 'high',
  message_snippet text,
  reviewed_by text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE public.safety_flags ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_insert_safety_flags') THEN
    CREATE POLICY "anon_insert_safety_flags" ON public.safety_flags FOR INSERT TO anon WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_select_safety_flags') THEN
    CREATE POLICY "authenticated_select_safety_flags" ON public.safety_flags FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_update_safety_flags') THEN
    CREATE POLICY "authenticated_update_safety_flags" ON public.safety_flags FOR UPDATE TO authenticated USING (true);
  END IF;
END $$;
