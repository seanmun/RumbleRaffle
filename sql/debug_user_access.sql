-- Debug User Access to League
-- Replace YOUR_EMAIL and YOUR_LEAGUE_ID with actual values

-- 1. Find your user ID
SELECT
  id as user_id,
  email,
  raw_user_meta_data
FROM auth.users
WHERE email = 'YOUR_EMAIL';

-- 2. Check league details
SELECT
  id,
  name,
  creator_id,
  status
FROM public.leagues
WHERE id = 'YOUR_LEAGUE_ID';

-- 3. Check if you have a membership
SELECT
  id,
  league_id,
  user_id,
  role,
  has_paid,
  created_at
FROM public.league_memberships
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL')
AND league_id = 'YOUR_LEAGUE_ID';

-- 4. Check if you're the league creator
SELECT
  l.name,
  l.creator_id,
  u.email as creator_email,
  CASE
    WHEN l.creator_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL')
    THEN 'YES - You are the creator'
    ELSE 'NO - You are not the creator'
  END as am_i_creator
FROM public.leagues l
JOIN auth.users u ON u.id = l.creator_id
WHERE l.id = 'YOUR_LEAGUE_ID';

-- 5. Test the RLS policy logic manually
-- This simulates what the RLS policy checks
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM public.league_memberships
      WHERE league_id = 'YOUR_LEAGUE_ID'
      AND user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL')
    ) THEN 'PASS: Has membership'
    ELSE 'FAIL: No membership found'
  END as membership_check,

  CASE
    WHEN EXISTS (
      SELECT 1 FROM public.leagues
      WHERE id = 'YOUR_LEAGUE_ID'
      AND creator_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL')
    ) THEN 'PASS: Is creator'
    ELSE 'FAIL: Not creator'
  END as creator_check;
