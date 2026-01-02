-- Fix Missing User Profiles
-- Run this in Supabase SQL Editor to create profiles for existing users who signed up before the trigger was installed

-- First, let's see which users are missing profiles
SELECT
  au.id,
  au.email,
  au.created_at as auth_created_at,
  CASE
    WHEN u.id IS NULL THEN 'MISSING PROFILE ❌'
    ELSE 'Has Profile ✅'
  END as profile_status
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
ORDER BY au.created_at DESC;

-- Now create missing profiles
INSERT INTO public.users (id, email, name, avatar_url, created_at, updated_at)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  au.created_at,
  NOW()
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Verify all users now have profiles
SELECT
  COUNT(*) as total_auth_users,
  COUNT(u.id) as users_with_profiles,
  COUNT(*) - COUNT(u.id) as missing_profiles
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id;
