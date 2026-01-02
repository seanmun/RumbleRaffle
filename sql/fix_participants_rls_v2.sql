-- Fix RLS Policies for Participants Table (Version 2)
-- This version ensures proper access control for participant insertion

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can insert participants for leagues they're in" ON public.participants;
DROP POLICY IF EXISTS "Users can view participants in their leagues" ON public.participants;
DROP POLICY IF EXISTS "Users can update their own participants" ON public.participants;
DROP POLICY IF EXISTS "Users can delete their own participants" ON public.participants;

-- Enable RLS if not already enabled
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- INSERT Policy: Allow users to insert their own participants if they're league members or creators
CREATE POLICY "Users can insert participants for leagues they're in"
ON public.participants
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    -- User must be a member of the league
    EXISTS (
      SELECT 1 FROM public.league_memberships
      WHERE league_memberships.league_id = participants.league_id
      AND league_memberships.user_id = auth.uid()
    )
    OR
    -- OR be the league creator
    EXISTS (
      SELECT 1 FROM public.leagues
      WHERE leagues.id = participants.league_id
      AND leagues.creator_id = auth.uid()
    )
  )
);

-- SELECT Policy: Allow users to view participants in leagues they're part of
CREATE POLICY "Users can view participants in their leagues"
ON public.participants
FOR SELECT
TO authenticated
USING (
  -- Can view if they're a member
  EXISTS (
    SELECT 1 FROM public.league_memberships
    WHERE league_memberships.league_id = participants.league_id
    AND league_memberships.user_id = auth.uid()
  )
  OR
  -- OR they're the league creator
  EXISTS (
    SELECT 1 FROM public.leagues
    WHERE leagues.id = participants.league_id
    AND leagues.creator_id = auth.uid()
  )
  OR
  -- OR it's their own participant
  user_id = auth.uid()
);

-- UPDATE Policy: Allow users to update only their own participants
CREATE POLICY "Users can update their own participants"
ON public.participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE Policy: Allow users to delete only their own participants
CREATE POLICY "Users can delete their own participants"
ON public.participants
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
