# RumbleRaffle Database Setup

This directory contains the SQL files needed to set up the RumbleRaffle database.

## Quick Start (Fresh Install)

If you're setting up a new Supabase project:

1. **Create Schema**: Run `schema.sql` in Supabase SQL Editor
2. **Seed Data** (optional): Run seed files for test data
   - `supabase-seed.sql` - Men's Royal Rumble events
   - `supabase-seed-women.sql` - Women's Royal Rumble events

## Files

### Production Files

- **`schema.sql`** - Complete, current database schema (use this for fresh installs)
- **`supabase-seed.sql`** - Men's Royal Rumble seed data (2025 completed + 2026 upcoming)
- **`supabase-seed-women.sql`** - Women's Royal Rumble seed data (2025 completed + 2026 upcoming)

### Archive

The `archive/` folder contains one-time migration files that have already been applied to production. These are kept for historical reference only and should NOT be run again.

## Database Structure

### Core Tables

- **users** - User profiles (linked to Supabase Auth)
- **events** - Royal Rumble events
- **global_entrants** - Wrestlers in each event
- **leagues** - User-created raffle leagues
- **participants** - People participating in leagues
- **league_entrant_assignments** - Which participant got which entrant number

### Supporting Tables

- **wrestler_pool** - Global wrestler database
- **eliminations** - Tracking who eliminated whom
- **league_memberships** - Users' league memberships

## Making Your First User an Admin

After signing up, run this in Supabase SQL Editor:

```sql
UPDATE public.users
SET is_admin = true
WHERE email = 'your-email@example.com';
```

## Notes

- All tables use Row Level Security (RLS)
- The schema includes automatic user creation on signup (via trigger)
- Event years: 2025 = completed (past), 2026 = upcoming
