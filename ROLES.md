# User Roles in Rumble Raffle

## Site-Wide Roles

### Admin
- **Purpose**: Manage the entire site and live events
- **Permissions**:
  - Add/edit/delete wrestlers in the database
  - Manage events (create new Royal Rumble events)
  - Control live events (mark entrances, eliminations, placements)
  - Access admin panel at `/admin`
- **How to Grant**: Set `is_admin = true` in the `users` table

## League-Specific Roles

### League Manager (LM)
- **Purpose**: Creator and manager of a specific league
- **Permissions**:
  - Create and configure the league
  - Add/remove participants
  - Assign entrant counts
  - Start the league (assign wrestlers)
  - Manage league settings
- **How to Grant**: Automatically granted when user creates a league (role = 'manager' in `league_memberships`)

### Member
- **Purpose**: Regular participant in a league
- **Permissions**:
  - View league details
  - View their assigned wrestlers
  - See leaderboard and scores
- **How to Grant**: Invited by League Manager or joins public league (role = 'member' in `league_memberships`)

## Role Hierarchy

```
Admin (Site-wide)
  └── Can manage all events and wrestlers

League Manager (League-specific)
  └── Can manage their created leagues

Member (League-specific)
  └── Can view and participate in leagues
```

## Database Schema

- **Site Admin**: `users.is_admin = true`
- **League Manager**: `league_memberships.role = 'manager'`
- **League Member**: `league_memberships.role = 'member'`
