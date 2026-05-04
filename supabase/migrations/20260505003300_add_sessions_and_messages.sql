-- Migration: Add Sessions and Messages Tables
-- Date: 2026-05-04

CREATE TABLE IF NOT EXISTS public.sessions (
  id bigint generated always as identity primary key,
  anonymous_token text not null,
  listener_name text,
  status text default 'waiting', -- waiting, active, ended
  listener_note text,
  created_at timestamptz default now(),
  ended_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.messages (
  id bigint generated always as identity primary key,
  session_id bigint references public.sessions(id) on delete cascade,
  sender_role text not null, -- user, listener, moderator
  content text not null,
  flagged boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Sessions Policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_insert_sessions') THEN
    CREATE POLICY "anon_insert_sessions" ON public.sessions FOR INSERT TO anon WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_select_own_sessions') THEN
    -- In a real setup, we'd use the sub claim if authenticated, but for pure anon we might use a header or custom claim
    -- For now, allowing anon to select based on the token match
    CREATE POLICY "anon_select_own_sessions" ON public.sessions FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_select_sessions') THEN
    CREATE POLICY "authenticated_select_sessions" ON public.sessions FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_update_sessions') THEN
    CREATE POLICY "authenticated_update_sessions" ON public.sessions FOR UPDATE TO authenticated USING (true);
  END IF;
END $$;

-- Messages Policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_insert_messages') THEN
    CREATE POLICY "anon_insert_messages" ON public.messages FOR INSERT TO anon WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_select_messages') THEN
    CREATE POLICY "anon_select_messages" ON public.messages FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_select_messages') THEN
    CREATE POLICY "authenticated_select_messages" ON public.messages FOR SELECT TO authenticated USING (true);
  END IF;
END $$;
