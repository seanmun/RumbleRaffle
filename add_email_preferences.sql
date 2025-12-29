-- Add email preference columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_rumble_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_league_results BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_announcements BOOLEAN DEFAULT true;

-- Add comment explaining the columns
COMMENT ON COLUMN users.email_rumble_reminders IS 'Send Royal Rumble event reminders (7 days, 1 day, day of)';
COMMENT ON COLUMN users.email_league_results IS 'Send notifications when league results are final';
COMMENT ON COLUMN users.email_announcements IS 'Send important app announcements (max 2 per year)';
