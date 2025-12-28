-- RumbleRaffle Database Schema (Current Version)
-- Complete schema including all migrations
-- Run this in Supabase SQL Editor for fresh database setup

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_type, year)
);

-- ============================================
-- WRESTLER POOL TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.wrestler_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GLOBAL ENTRANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.global_entrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  entrant_number INTEGER NOT NULL,
  wrestler_name TEXT NOT NULL,
  wrestler_pool_id UUID REFERENCES public.wrestler_pool(id),
  is_eliminated BOOLEAN DEFAULT false,
  entered_at TIMESTAMPTZ,
  eliminated_at TIMESTAMPTZ,
  final_placement INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, entrant_number)
);

-- ============================================
-- ELIMINATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.eliminations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  eliminator_id UUID NOT NULL REFERENCES public.global_entrants(id) ON DELETE CASCADE,
  eliminated_id UUID NOT NULL REFERENCES public.global_entrants(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEAGUES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  league_type TEXT DEFAULT 'winner_takes_all' CHECK (league_type IN ('winner_takes_all', 'points_based', 'combined')),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  secondary_event_id UUID REFERENCES public.events(id),
  creator_id UUID NOT NULL REFERENCES public.users(id),
  buy_in DECIMAL(10,2) DEFAULT 0,
  total_prize_pool DECIMAL(10,2) DEFAULT 0,
  payout_structure JSONB,
  elimination_points_enabled BOOLEAN DEFAULT false,
  points_per_elimination INTEGER DEFAULT 5,
  placement_points_enabled BOOLEAN DEFAULT true,
  time_bonus_enabled BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  join_code TEXT UNIQUE,
  status TEXT DEFAULT 'setup' CHECK (status IN ('setup', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEAGUE MEMBERSHIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.league_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('manager', 'member')),
  has_paid BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(league_id, user_id)
);

-- ============================================
-- PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  entrant_count INTEGER NOT NULL,
  total_buy_in DECIMAL(10,2) DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(league_id, name)
);

-- ============================================
-- LEAGUE ENTRANT ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.league_entrant_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  global_entrant_id UUID NOT NULL REFERENCES public.global_entrants(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id),
  entrant_number INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(league_id, entrant_number)
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_year ON public.events(year);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_name ON public.wrestler_pool(name);
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_gender ON public.wrestler_pool(gender);
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_active ON public.wrestler_pool(is_active);
CREATE INDEX IF NOT EXISTS idx_global_entrants_event ON public.global_entrants(event_id);
CREATE INDEX IF NOT EXISTS idx_leagues_creator ON public.leagues(creator_id);
CREATE INDEX IF NOT EXISTS idx_leagues_event ON public.leagues(event_id);
CREATE INDEX IF NOT EXISTS idx_league_memberships_user ON public.league_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_league_memberships_league ON public.league_memberships(league_id);
CREATE INDEX IF NOT EXISTS idx_participants_league ON public.participants(league_id);
CREATE INDEX IF NOT EXISTS idx_league_entrant_assignments_event ON public.league_entrant_assignments(event_id);

-- ============================================
-- AUTH TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrestler_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_entrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eliminations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_entrant_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users: Can view and update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Events: Public read access
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT TO authenticated USING (true);

-- Wrestler Pool: Public read, admin write
DROP POLICY IF EXISTS "Anyone can view wrestlers" ON public.wrestler_pool;
CREATE POLICY "Anyone can view wrestlers" ON public.wrestler_pool
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage wrestlers" ON public.wrestler_pool;
CREATE POLICY "Admins can manage wrestlers" ON public.wrestler_pool
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Global entrants: Public read access
DROP POLICY IF EXISTS "Anyone can view global entrants" ON public.global_entrants;
CREATE POLICY "Anyone can view global entrants" ON public.global_entrants
  FOR SELECT TO authenticated USING (true);

-- Eliminations: Public read access
DROP POLICY IF EXISTS "Anyone can view eliminations" ON public.eliminations;
CREATE POLICY "Anyone can view eliminations" ON public.eliminations
  FOR SELECT TO authenticated USING (true);

-- Leagues: View leagues you created or public leagues
DROP POLICY IF EXISTS "Users can view their leagues" ON public.leagues;
CREATE POLICY "Users can view their leagues" ON public.leagues
  FOR SELECT TO authenticated USING (
    is_public = true OR
    creator_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can create leagues" ON public.leagues;
CREATE POLICY "Users can create leagues" ON public.leagues
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update leagues" ON public.leagues;
CREATE POLICY "Creators can update leagues" ON public.leagues
  FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- League memberships: View your own memberships
DROP POLICY IF EXISTS "Users can view league memberships" ON public.league_memberships;
CREATE POLICY "Users can view league memberships" ON public.league_memberships
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can join leagues" ON public.league_memberships;
CREATE POLICY "Users can join leagues" ON public.league_memberships
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Participants: View participants in your leagues or public leagues
DROP POLICY IF EXISTS "Users can view participants" ON public.participants;
CREATE POLICY "Users can view participants" ON public.participants
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.leagues
      WHERE leagues.id = participants.league_id
      AND (leagues.creator_id = auth.uid() OR leagues.is_public = true)
    )
  );

DROP POLICY IF EXISTS "League creators can manage participants" ON public.participants;
CREATE POLICY "League creators can manage participants" ON public.participants
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.leagues
      WHERE leagues.id = participants.league_id
      AND leagues.creator_id = auth.uid()
    )
  );

-- League entrant assignments: View assignments in your leagues or public leagues
DROP POLICY IF EXISTS "Users can view assignments" ON public.league_entrant_assignments;
CREATE POLICY "Users can view assignments" ON public.league_entrant_assignments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.leagues
      WHERE leagues.id = league_entrant_assignments.league_id
      AND (leagues.creator_id = auth.uid() OR leagues.is_public = true)
    )
  );

DROP POLICY IF EXISTS "League creators can manage assignments" ON public.league_entrant_assignments;
CREATE POLICY "League creators can manage assignments" ON public.league_entrant_assignments
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.leagues
      WHERE leagues.id = league_entrant_assignments.league_id
      AND leagues.creator_id = auth.uid()
    )
  );
