-- Check RLS policies on league_memberships table
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
WHERE tablename = 'league_memberships'
ORDER BY cmd;

-- Check if RLS is enabled on league_memberships
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'league_memberships';
