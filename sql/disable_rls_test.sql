-- TEMPORARY: Disable RLS on participants table to test
-- This will help us confirm RLS is the problem
-- DO NOT leave this disabled - re-enable after testing!

ALTER TABLE public.participants DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'participants';
