-- Migration: Add event tracking history tables
-- Run this in Supabase SQL Editor

-- Table to store who entered at each position in a Royal Rumble
CREATE TABLE IF NOT EXISTS public.event_entrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  wrestler_pool_id UUID REFERENCES public.wrestler_pool(id) ON DELETE SET NULL,
  wrestler_name TEXT NOT NULL, -- Store name even if wrestler is deleted from pool
  entrant_number INTEGER NOT NULL CHECK (entrant_number >= 1 AND entrant_number <= 30),
  is_eliminated BOOLEAN DEFAULT false,
  eliminated_by_wrestler_name TEXT,
  eliminated_at_timestamp TIMESTAMPTZ,
  final_placement INTEGER, -- 1 = Winner, 2 = Runner-up, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each event can only have one wrestler per entrant number
  UNIQUE(event_id, entrant_number)
);

-- Table to store custom wrestlers added during an event
CREATE TABLE IF NOT EXISTS public.event_custom_wrestlers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  wrestler_name TEXT NOT NULL,
  entrant_number INTEGER NOT NULL CHECK (entrant_number >= 1 AND entrant_number <= 30),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, entrant_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_entrants_event_id ON public.event_entrants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_entrants_wrestler_pool_id ON public.event_entrants(wrestler_pool_id);
CREATE INDEX IF NOT EXISTS idx_event_entrants_entrant_number ON public.event_entrants(event_id, entrant_number);
CREATE INDEX IF NOT EXISTS idx_event_custom_wrestlers_event_id ON public.event_custom_wrestlers(event_id);

-- RLS Policies
ALTER TABLE public.event_entrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_custom_wrestlers ENABLE ROW LEVEL SECURITY;

-- Everyone can view event entrants (for historical data)
CREATE POLICY "Anyone can view event entrants" ON public.event_entrants
  FOR SELECT TO authenticated USING (true);

-- Only admins can manage event entrants
CREATE POLICY "Admins can manage event entrants" ON public.event_entrants
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Everyone can view custom wrestlers
CREATE POLICY "Anyone can view custom wrestlers" ON public.event_custom_wrestlers
  FOR SELECT TO authenticated USING (true);

-- Only admins can manage custom wrestlers
CREATE POLICY "Admins can manage custom wrestlers" ON public.event_custom_wrestlers
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Add comments
COMMENT ON TABLE public.event_entrants IS 'Stores the historical record of who entered at each position in a Royal Rumble event';
COMMENT ON TABLE public.event_custom_wrestlers IS 'Stores custom wrestlers added during live events (surprise entrants, celebrity appearances)';

COMMENT ON COLUMN public.event_entrants.entrant_number IS 'Position in Royal Rumble (1-30)';
COMMENT ON COLUMN public.event_entrants.wrestler_name IS 'Name stored for historical record even if wrestler deleted from pool';
COMMENT ON COLUMN public.event_entrants.final_placement IS '1 = Winner, 2 = Runner-up, 3 = Third place, etc.';
COMMENT ON COLUMN public.event_entrants.eliminated_by_wrestler_name IS 'Name of wrestler who eliminated this entrant';

-- Verify tables
SELECT 'event_entrants' as table_name, COUNT(*) as count FROM public.event_entrants
UNION ALL
SELECT 'event_custom_wrestlers' as table_name, COUNT(*) as count FROM public.event_custom_wrestlers;
