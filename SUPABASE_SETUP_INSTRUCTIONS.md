# Supabase Setup Instructions

## Problem
When users sign up via the share URL flow, their profile isn't created in the `users` table, causing a blank dashboard.

## Solution
You need to run the database schema in Supabase to set up the auto-profile creation trigger.

## Steps

### 1. Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `uupejpmctofndjvdujdl`
3. Click **SQL Editor** in the left sidebar

### 2. Run the Schema
Copy and paste the entire contents of `sql/schema.sql` into the SQL editor and click **Run**.

This will:
- ✅ Create all necessary tables (users, leagues, participants, etc.)
- ✅ Set up the `handle_new_user()` trigger that auto-creates user profiles
- ✅ Enable Row Level Security (RLS)
- ✅ Create all RLS policies for secure access

### 3. Verify the Trigger is Working

After running the schema, test by:

1. **Create a new user account** (sign up with a new email)
2. **Check the users table**:
   ```sql
   SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;
   ```
3. You should see the new user automatically created

### 4. The Key Trigger (Already in schema.sql)

This is what auto-creates user profiles:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## What This Fixes

**Before:**
- User clicks share URL → Signs up → Blank dashboard (no profile)
- Error: Cannot find user in `users` table

**After:**
- User clicks share URL → Signs up → **Trigger auto-creates profile** → Redirected to league join page

## Troubleshooting

### If users still see blank dashboards:

1. **Check if trigger exists**:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Manually create missing user profiles**:
   ```sql
   INSERT INTO public.users (id, email, name, created_at, updated_at)
   SELECT
     id,
     email,
     COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
     NOW(),
     NOW()
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM public.users);
   ```

3. **Check RLS policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```

## Additional Setup (Optional)

### Add Sample Events
If you don't have any events yet, create a Royal Rumble event:

```sql
INSERT INTO public.events (name, year, event_type, event_date, status)
VALUES
  ('Royal Rumble 2025 (Men)', 2025, 'royal_rumble', '2025-02-01', 'upcoming'),
  ('Royal Rumble 2025 (Women)', 2025, 'royal_rumble_women', '2025-02-01', 'upcoming');
```

### Make Yourself Admin
To access admin features:

```sql
UPDATE public.users
SET is_admin = true
WHERE email = 'your-email@example.com';
```

## Files Reference

- **Main Schema**: [sql/schema.sql](sql/schema.sql)
- **Migration Files**: `sql/` directory
- **Schema Docs**: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
