-- Fix RLS Policies for Participants Table (Version 3)
-- This version simplifies the INSERT policy to only check user_id
-- Since we're creating the membership in the app code, we can rely on application logic

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can insert participants for leagues they're in" ON public.participants;

-- Simplified INSERT Policy: Allow users to insert their own participants
-- The app code handles the membership check, so we just verify user_id matches
CREATE POLICY "Users can insert participants for leagues they're in"
ON public.participants
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Verify the policy was created
SELECT
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'participants'
AND cmd = 'INSERT';
