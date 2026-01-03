-- Fix RLS Policies for Participants Table (Version 4 - FINAL)
-- Remove the conflicting "ALL" policy and keep specific policies

-- Drop the problematic "ALL" policy
DROP POLICY IF EXISTS "League creators can manage participants" ON public.participants;

-- Keep the V3 INSERT policy (already exists)
-- This allows users to insert their own participants
-- Policy: "Users can insert participants for leagues they're in"
-- WITH CHECK: user_id = auth.uid()

-- Verify all policies after cleanup
SELECT
  policyname,
  cmd,
  permissive,
  with_check,
  qual
FROM pg_policies
WHERE tablename = 'participants'
ORDER BY cmd;
