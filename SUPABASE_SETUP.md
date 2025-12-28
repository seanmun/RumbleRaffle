# Supabase Setup Guide

Follow these steps in order to set up your database.

## Step 1: Disable Email Confirmation

1. Go to [Supabase Dashboard](https://app.supabase.com/project/uupejpmctofndjvdujdl/auth/providers)
2. Click **Authentication** → **Providers**
3. Click on **Email**
4. Scroll down and find **"Confirm email"**
5. **Turn it OFF** (disable the toggle)
6. Click **Save**

## Step 2: Create Database Schema

1. Go to [SQL Editor](https://app.supabase.com/project/uupejpmctofndjvdujdl/sql/new)
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Wait for "Success" message

This creates:
- All tables (users, events, global_entrants, leagues, etc.)
- Indexes for performance
- Auth trigger to auto-create user records
- Row Level Security (RLS) policies

## Step 3: Seed Historical Data

1. In the same SQL Editor (or create a new query)
2. Copy the entire contents of `supabase-seed.sql`
3. Paste it into the SQL Editor
4. Click **Run**
5. You should see a table showing:
   - Royal Rumble 2024 (Men) - 30 entrants
   - Royal Rumble 2025 (Men) - 30 entrants

This creates:
- 2 Royal Rumble events (2024 completed, 2025 upcoming)
- 60 total wrestler entrants (30 per event)
- Full results for 2024 (placements, elimination times)
- TBD placeholders for 2025

## Step 4: Verify Setup

Go to [Table Editor](https://app.supabase.com/project/uupejpmctofndjvdujdl/editor) and check:

- **events** table: Should have 2 rows
- **global_entrants** table: Should have 60 rows
- **users** table: Should exist but be empty (users created on signup)

## Step 5: Test Authentication

1. Make sure dev server is running: `npm run dev`
2. Go to http://localhost:3000/signup
3. Create a test account:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. You should be logged in immediately (no email confirmation needed)
5. Check Supabase Table Editor → **users** table - you should see your new user

## What's Different from Prisma?

**Before (with Prisma):**
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const events = await prisma.event.findMany()
```

**Now (with Supabase):**
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
const { data: events } = await supabase.from('events').select('*')
```

Benefits:
- No need to run migrations or `prisma generate`
- Real-time subscriptions built-in
- Row Level Security enforced automatically
- Simpler auth integration
- Auto-generated TypeScript types from database schema

## Troubleshooting

**If signup still fails:**
1. Check [Logs](https://app.supabase.com/project/uupejpmctofndjvdujdl/logs/database-logs)
2. Look for errors mentioning `handle_new_user` trigger
3. Verify the auth trigger was created:
   ```sql
   SELECT trigger_name FROM information_schema.triggers
   WHERE trigger_name = 'on_auth_user_created';
   ```

**If tables don't exist:**
- Re-run `supabase-schema.sql` in SQL Editor
- Check for error messages in the SQL Editor output
