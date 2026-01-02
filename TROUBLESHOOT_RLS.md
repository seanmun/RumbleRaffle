# Troubleshooting RLS Policy Issues

## Current Issue
Getting `403 Forbidden` error when trying to join leagues:
```
new row violates row-level security policy for table "participants"
```

## Steps to Fix

### Step 1: Verify Current Policies
Run [sql/verify_rls_policies.sql](sql/verify_rls_policies.sql) in Supabase SQL Editor to check:
1. If RLS is enabled on participants table
2. What policies currently exist
3. If the INSERT policy exists

### Step 2: Apply Fixed RLS Policies
Run [sql/fix_participants_rls_v2.sql](sql/fix_participants_rls_v2.sql) in Supabase SQL Editor.

This will:
- Drop all existing policies
- Enable RLS
- Create new policies with proper checks

### Step 3: Test the Fix

1. **Clear browser cache/cookies** (RLS uses auth token which might be cached)
2. **Log out and log back in** (to get fresh auth token)
3. Try the share URL flow again

### Step 4: Debug with SQL

If still not working, run this debug query in Supabase SQL Editor:

```sql
-- Check if your user has a membership (replace with your actual user ID)
SELECT
  u.id as user_id,
  u.email,
  lm.league_id,
  lm.role,
  l.name as league_name,
  l.creator_id
FROM auth.users u
LEFT JOIN public.league_memberships lm ON lm.user_id = u.id
LEFT JOIN public.leagues l ON l.id = lm.league_id
WHERE u.email = 'YOUR_EMAIL_HERE'
ORDER BY lm.created_at DESC;
```

### Common Issues

#### Issue 1: Membership not created
**Symptom**: Console shows "Creating membership" but participants insert still fails

**Fix**: Check if membership was actually created:
```sql
SELECT * FROM public.league_memberships
WHERE user_id = 'YOUR_USER_ID'
AND league_id = 'YOUR_LEAGUE_ID';
```

#### Issue 2: Auth token not fresh
**Symptom**: Policies look correct but still getting 403

**Fix**:
1. Open browser DevTools → Application → Cookies
2. Delete all cookies for your domain
3. Log out and log back in
4. Try again

#### Issue 3: RLS policies not applied
**Symptom**: Running the SQL shows no policies exist

**Fix**:
1. Check if you're connected to the right database
2. Check if you have admin permissions
3. Run the fix SQL again and check for errors

### Expected Policy Output

After running the fix, you should see these 4 policies when you query `pg_policies`:

1. **INSERT**: `Users can insert participants for leagues they're in`
   - Allows users to create participants where they are the user_id AND they're either a league member or creator

2. **SELECT**: `Users can view participants in their leagues`
   - Allows viewing participants in leagues where user is member/creator OR it's their own participant

3. **UPDATE**: `Users can update their own participants`
   - Only allows updating participants where user_id matches

4. **DELETE**: `Users can delete their own participants`
   - Only allows deleting participants where user_id matches

### Key Difference in V2

The V2 policy adds `user_id = auth.uid()` check to the INSERT policy:

```sql
WITH CHECK (
  user_id = auth.uid()  -- NEW: Must be creating for yourself
  AND (
    EXISTS (SELECT 1 FROM league_memberships ...) OR
    EXISTS (SELECT 1 FROM leagues WHERE creator_id = auth.uid())
  )
)
```

This ensures:
1. Users can only create participants for themselves (`user_id = auth.uid()`)
2. AND they must be either a league member OR the league creator

## Testing Checklist

- [ ] RLS is enabled on participants table
- [ ] All 4 policies exist (INSERT, SELECT, UPDATE, DELETE)
- [ ] User can log in successfully
- [ ] User profile exists in `public.users` table
- [ ] Share URL redirects to join page after login
- [ ] Join page shows user info in header (not "Login/Signup")
- [ ] Can add participant names and entry counts
- [ ] Click "Join League" succeeds without 403 error
- [ ] Redirects to league page showing leaderboard
