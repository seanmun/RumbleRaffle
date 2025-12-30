-- Performance optimization: Add database indexes for frequently queried columns
-- Run this in your Supabase SQL Editor or via migration

-- Leagues table indexes
CREATE INDEX IF NOT EXISTS idx_leagues_creator_id ON leagues(creator_id);
CREATE INDEX IF NOT EXISTS idx_leagues_status ON leagues(status);
CREATE INDEX IF NOT EXISTS idx_leagues_created_at ON leagues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leagues_event_id ON leagues(event_id);

-- Participants table indexes
CREATE INDEX IF NOT EXISTS idx_participants_league_id ON participants(league_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_total_points ON participants(total_points DESC);

-- Picks table indexes
CREATE INDEX IF NOT EXISTS idx_picks_participant_id ON picks(participant_id);
CREATE INDEX IF NOT EXISTS idx_picks_league_id ON picks(league_id);
CREATE INDEX IF NOT EXISTS idx_picks_wrestler_id ON picks(wrestler_id);

-- Events table indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_year ON events(year DESC);

-- Eliminations table indexes
CREATE INDEX IF NOT EXISTS idx_eliminations_event_id ON eliminations(event_id);
CREATE INDEX IF NOT EXISTS idx_eliminations_wrestler_id ON eliminations(wrestler_id);
CREATE INDEX IF NOT EXISTS idx_eliminations_entry_number ON eliminations(entry_number);

-- Wrestler pool indexes
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_name ON wrestler_pool(name);
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_gender ON wrestler_pool(gender);
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_is_active ON wrestler_pool(is_active);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_leagues_creator_status ON leagues(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_participants_league_points ON participants(league_id, total_points DESC);
CREATE INDEX IF NOT EXISTS idx_picks_league_wrestler ON picks(league_id, wrestler_id);

-- Add comment for documentation
COMMENT ON INDEX idx_leagues_creator_id IS 'Optimizes queries for user''s leagues';
COMMENT ON INDEX idx_participants_total_points IS 'Optimizes leaderboard queries';
COMMENT ON INDEX idx_wrestler_pool_is_active IS 'Optimizes queries for active wrestlers only';
