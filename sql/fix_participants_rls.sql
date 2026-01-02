-- Fix RLS Policies for Participants Table
-- This allows users to create participants for leagues they're members of

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert participants for leagues they're in" ON public.participants;

-- Allow users to insert participants for leagues they're members of
CREATE POLICY "Users can insert participants for leagues they're in"
ON public.participants
FOR INSERT
TO authenticated
WITH CHECK (
  -- User must be a member of the league OR be the creator
  EXISTS (
    SELECT 1 FROM public.league_memberships
    WHERE league_memberships.league_id = participants.league_id
    AND league_memberships.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.leagues
    WHERE leagues.id = participants.league_id
    AND leagues.creator_id = auth.uid()
  )
);

-- Also update the existing view policy to allow users to see their own participants
DROP POLICY IF EXISTS "Users can view participants in their leagues" ON public.participants;

CREATE POLICY "Users can view participants in their leagues"
ON public.participants
FOR SELECT
TO authenticated
USING (
  -- Can view if:
  -- 1. They're a member of the league
  EXISTS (
    SELECT 1 FROM public.league_memberships
    WHERE league_memberships.league_id = participants.league_id
    AND league_memberships.user_id = auth.uid()
  )
  OR
  -- 2. They're the league creator
  EXISTS (
    SELECT 1 FROM public.leagues
    WHERE leagues.id = participants.league_id
    AND leagues.creator_id = auth.uid()
  )
  OR
  -- 3. It's a public league
  EXISTS (
    SELECT 1 FROM public.leagues
    WHERE leagues.id = participants.league_id
    AND leagues.is_public = true
  )
);

-- Allow users to update their own participants
DROP POLICY IF EXISTS "Users can update their own participants" ON public.participants;

CREATE POLICY "Users can update their own participants"
ON public.participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own participants
DROP POLICY IF EXISTS "Users can delete their own participants" ON public.participants;

CREATE POLICY "Users can delete their own participants"
ON public.participants
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
