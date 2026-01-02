-- Verify RLS Policies for Participants Table
-- Run this to check if the policies were applied correctly

-- 1. Check if RLS is enabled on participants table
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'participants';

-- 2. List all policies on participants table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'participants'
ORDER BY cmd;

-- 3. Check if the specific INSERT policy exists
SELECT EXISTS (
  SELECT 1 FROM pg_policies
  WHERE tablename = 'participants'
  AND policyname = 'Users can insert participants for leagues they''re in'
  AND cmd = 'INSERT'
) as insert_policy_exists;
