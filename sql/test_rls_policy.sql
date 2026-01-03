-- Test RLS Policy
-- This will help us understand why the policy is failing

-- 1. Check current policies
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'participants'
AND cmd = 'INSERT';

-- 2. Check league memberships for this league
SELECT
  lm.id,
  lm.user_id,
  lm.league_id,
  lm.role,
  u.email
FROM public.league_memberships lm
JOIN auth.users u ON u.id = lm.user_id
WHERE lm.league_id = '88fc13c0-661a-461c-aed5-88210fb98c9e';

-- 3. Check league creator
SELECT
  l.id,
  l.name,
  l.creator_id,
  u.email as creator_email
FROM public.leagues l
JOIN auth.users u ON u.id = l.creator_id
WHERE l.id = '88fc13c0-661a-461c-aed5-88210fb98c9e';

-- 4. Check existing participants
SELECT
  p.id,
  p.user_id,
  p.name,
  u.email as user_email
FROM public.participants p
JOIN auth.users u ON u.id = p.user_id
WHERE p.league_id = '88fc13c0-661a-461c-aed5-88210fb98c9e';
