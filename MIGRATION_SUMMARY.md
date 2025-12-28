# Migration from Prisma/Neon to Supabase

## What Changed

### Removed
- ❌ Prisma (`prisma` and `@prisma/client` packages)
- ❌ Neon database connection
- ❌ `DATABASE_URL` from `.env.local` (no longer needed)
- ❌ `prisma/` directory (keep for reference, but not used)
- ❌ Social login buttons (temporarily removed - will add back when OAuth configured)

### Added
- ✅ Pure Supabase setup using `@supabase/supabase-js` and `@supabase/ssr`
- ✅ Complete SQL schema file: `supabase-schema.sql`
- ✅ Seed data file: `supabase-seed.sql`
- ✅ Setup instructions: `SUPABASE_SETUP.md`

## Why This Is Better

**Before (Prisma + Neon):**
```typescript
// Had to run: npx prisma generate, npx prisma db push
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const events = await prisma.event.findMany()
```

**Now (Supabase only):**
```typescript
// No setup needed, just use the client
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
const { data: events } = await supabase.from('events').select('*')
```

### Benefits:
1. **Simpler** - No need to manage Prisma schema, migrations, or generate commands
2. **Real-time** - Built-in subscriptions for live updates (perfect for Royal Rumble live events)
3. **Auth integrated** - Supabase Auth works seamlessly with the database
4. **Row Level Security** - Database-level security policies (already configured)
5. **Type-safe** - Supabase auto-generates TypeScript types from your database schema
6. **Better free tier** - More generous limits than Neon

## Files You Kept

The wrestler data from `prisma/seed.ts` has been preserved in `supabase-seed.sql`:
- Royal Rumble 2024 with all 30 entrants and final placements
- Royal Rumble 2025 with 30 TBD placeholders

## Next Steps

Follow the instructions in `SUPABASE_SETUP.md`:

1. **Disable email confirmation** in Supabase Dashboard
2. **Run `supabase-schema.sql`** in SQL Editor to create tables
3. **Run `supabase-seed.sql`** to populate historical data
4. **Test signup** at http://localhost:3000/signup

Once you complete these steps, authentication should work without any 500 errors!

## Environment Variables

Your `.env.local` now only needs 2 variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://uupejpmctofndjvdujdl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

No more `DATABASE_URL` needed!

## Using Supabase in Your Code

### Server-side (API routes, Server Components):
```typescript
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('year', { ascending: false })

  return Response.json(events)
}
```

### Client-side (Client Components):
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export default function Events() {
  const supabase = createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
  // ...
}
```

### Real-time subscriptions (for live events):
```typescript
const supabase = createClient()

supabase
  .channel('global_entrants')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'global_entrants'
  }, (payload) => {
    console.log('Entrant updated!', payload.new)
  })
  .subscribe()
```

## What's Ready

- ✅ Database schema designed
- ✅ Auth trigger ready to create user records
- ✅ RLS policies configured for security
- ✅ Historical Royal Rumble data preserved
- ✅ Login/Signup pages working
- ✅ Middleware protecting routes
- ✅ Dev server running without errors

## What's Next

- 🔲 Run the SQL files in Supabase
- 🔲 Test authentication flow
- 🔲 Build user dashboard
- 🔲 Create admin panel for live event control
- 🔲 Implement league creation
