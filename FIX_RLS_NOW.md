# 🚨 URGENT: Fix RLS Policies

## The Problem
You're getting a `403 Forbidden` error when trying to join leagues because the Row Level Security (RLS) policies on the `participants` table don't allow users to insert their own participants.

**Error**: `new row violates row-level security policy for table "participants"`

## Quick Fix (Run This Now!)

### Step 1: Open Supabase SQL Editor
Go to: https://app.supabase.com/project/uupejpmctofndjvdujdl/sql

### Step 2: Run This SQL

Copy and paste this entire block and click **Run**:

```sql
-- Fix RLS Policies for Participants Table
-- This allows users to create participants for leagues they're members of

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert participants for leagues they're in" ON public.participants;
DROP POLICY IF EXISTS "Users can view participants in their leagues" ON public.participants;
DROP POLICY IF EXISTS "Users can update their own participants" ON public.participants;
DROP POLICY IF EXISTS "Users can delete their own participants" ON public.participants;

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

-- Allow users to view participants in their leagues
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
CREATE POLICY "Users can update their own participants"
ON public.participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own participants
CREATE POLICY "Users can delete their own participants"
ON public.participants
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

### Step 3: Verify It Worked

Run this to check the policies:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'participants';
```

You should see 4 policies:
- ✅ INSERT policy for league members/creators
- ✅ SELECT policy for viewing
- ✅ UPDATE policy for own participants
- ✅ DELETE policy for own participants

## What This Fixes

**Before**: Users couldn't insert participants → 403 Forbidden error

**After**: Users who are league members can add their own participants ✅

## Test It

1. Go to the shared league URL
2. Click "Join League"
3. Add your participants
4. Click "Join League" button
5. Should work without errors!

## Alternative: Run the SQL File

If you prefer, you can run the file directly:
1. Open [sql/fix_participants_rls.sql](sql/fix_participants_rls.sql)
2. Copy all contents
3. Paste in Supabase SQL Editor
4. Click Run

---

**This is a one-time fix. Once you run this SQL, the share URL flow will work perfectly!**
