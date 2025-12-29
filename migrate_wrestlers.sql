-- Migration: Add wrestler pool to database
-- Run this in Supabase SQL Editor

-- Create wrestler pool table
CREATE TABLE IF NOT EXISTS public.wrestler_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_name ON public.wrestler_pool(name);
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_gender ON public.wrestler_pool(gender);
CREATE INDEX IF NOT EXISTS idx_wrestler_pool_active ON public.wrestler_pool(is_active);

-- RLS Policies for wrestler_pool
ALTER TABLE public.wrestler_pool ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view wrestlers" ON public.wrestler_pool;
DROP POLICY IF EXISTS "Admins can manage wrestlers" ON public.wrestler_pool;

-- Everyone can view wrestlers
CREATE POLICY "Anyone can view wrestlers" ON public.wrestler_pool
  FOR SELECT TO authenticated USING (true);

-- Only admins can manage wrestlers
CREATE POLICY "Admins can manage wrestlers" ON public.wrestler_pool
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Insert all male wrestlers (Men's Royal Rumble)
INSERT INTO public.wrestler_pool (name, gender) VALUES
  -- 1980s-1990s Legends
  ('Hulk Hogan', 'male'),
  ('Macho Man Randy Savage', 'male'),
  ('Ultimate Warrior', 'male'),
  ('Andre The Giant', 'male'),
  ('Big John Studd', 'male'),
  ('Ted DiBiase', 'male'),
  ('Jake The Snake Roberts', 'male'),
  ('Bret Hart', 'male'),
  ('Shawn Michaels', 'male'),
  ('Diesel', 'male'),
  ('Razor Ramon', 'male'),
  ('Lex Luger', 'male'),
  ('Ric Flair', 'male'),
  ('Roddy Piper', 'male'),
  ('Mr. Perfect', 'male'),
  ('The Undertaker', 'male'),
  ('Yokozuna', 'male'),
  ('Owen Hart', 'male'),
  ('The British Bulldog', 'male'),
  ('Sid Justice', 'male'),
  ('Sgt. Slaughter', 'male'),
  ('Rick Rude', 'male'),
  ('Doink The Clown', 'male'),
  ('Papa Shango', 'male'),
  ('The Big Boss Man', 'male'),
  ('Earthquake', 'male'),
  ('Typhoon', 'male'),
  ('The Barbarian', 'male'),
  ('Haku', 'male'),
  ('Tatanka', 'male'),
  ('Jeff Jarrett', 'male'),
  ('1-2-3 Kid', 'male'),
  ('Bob Backlund', 'male'),
  ('King Kong Bundy', 'male'),
  ('Kamala', 'male'),
  ('Jim Duggan', 'male'),
  ('Rikishi', 'male'),
  ('The Godfather', 'male'),
  ('Val Venis', 'male'),
  ('Al Snow', 'male'),

  -- Attitude Era & Ruthless Aggression
  ('The Rock', 'male'),
  ('Stone Cold Steve Austin', 'male'),
  ('Triple H', 'male'),
  ('Kurt Angle', 'male'),
  ('Chris Jericho', 'male'),
  ('Edge', 'male'),
  ('Christian', 'male'),
  ('Matt Hardy', 'male'),
  ('Jeff Hardy', 'male'),
  ('Kane', 'male'),
  ('Big Show', 'male'),
  ('Brock Lesnar', 'male'),
  ('Goldberg', 'male'),
  ('Rob Van Dam', 'male'),
  ('Booker T', 'male'),
  ('Eddie Guerrero', 'male'),
  ('Rey Mysterio', 'male'),
  ('Chris Benoit', 'male'),
  ('Test', 'male'),
  ('Lance Storm', 'male'),
  ('William Regal', 'male'),
  ('Scott Steiner', 'male'),
  ('Batista', 'male'),
  ('John Cena', 'male'),
  ('Randy Orton', 'male'),
  ('JBL', 'male'),
  ('Carlito', 'male'),
  ('Shelton Benjamin', 'male'),
  ('MVP', 'male'),
  ('Umaga', 'male'),
  ('Finlay', 'male'),
  ('Hornswoggle', 'male'),
  ('The Boogeyman', 'male'),
  ('Eugene', 'male'),
  ('Chavo Guerrero', 'male'),
  ('Jamie Noble', 'male'),
  ('Hardcore Holly', 'male'),
  ('Paul London', 'male'),
  ('Brian Kendrick', 'male'),
  ('Bobby Lashley', 'male'),
  ('The Great Khali', 'male'),
  ('Mr. Kennedy', 'male'),
  ('Vladimir Kozlov', 'male'),

  -- PG Era & Modern Superstars
  ('CM Punk', 'male'),
  ('Daniel Bryan', 'male'),
  ('Sheamus', 'male'),
  ('Wade Barrett', 'male'),
  ('Drew McIntyre', 'male'),
  ('The Miz', 'male'),
  ('John Morrison', 'male'),
  ('Cody Rhodes', 'male'),
  ('Ted DiBiase Jr.', 'male'),
  ('Damien Sandow', 'male'),
  ('Ryback', 'male'),
  ('Kofi Kingston', 'male'),
  ('Big E', 'male'),
  ('Xavier Woods', 'male'),
  ('Rusev', 'male'),
  ('Bray Wyatt', 'male'),
  ('Luke Harper', 'male'),
  ('Erick Rowan', 'male'),
  ('Dean Ambrose', 'male'),
  ('Seth Rollins', 'male'),
  ('Roman Reigns', 'male'),
  ('Braun Strowman', 'male'),
  ('Sami Zayn', 'male'),
  ('Kevin Owens', 'male'),
  ('Shinsuke Nakamura', 'male'),
  ('AJ Styles', 'male'),
  ('Finn Balor', 'male'),
  ('Samoa Joe', 'male'),
  ('Baron Corbin', 'male'),
  ('Chad Gable', 'male'),
  ('Otis', 'male'),
  ('Aleister Black', 'male'),
  ('Ricochet', 'male'),
  ('Andrade', 'male'),
  ('Bobby Roode', 'male'),
  ('Dolph Ziggler', 'male'),
  ('Robert Roode', 'male'),
  ('Keith Lee', 'male'),
  ('Karrion Kross', 'male'),
  ('Johnny Gargano', 'male'),
  ('Tommaso Ciampa', 'male'),
  ('Pete Dunne', 'male'),
  ('LA Knight', 'male'),

  -- Current Superstars & Future Stars
  ('Logan Paul', 'male'),
  ('Gunther', 'male'),
  ('Solo Sikoa', 'male'),
  ('Dominik Mysterio', 'male'),
  ('Austin Theory', 'male'),
  ('Carmelo Hayes', 'male'),
  ('Bron Breakker', 'male'),
  ('Grayson Waller', 'male'),
  ('Ilja Dragunov', 'male'),
  ('Santos Escobar', 'male'),
  ('Dragon Lee', 'male'),
  ('Jey Uso', 'male'),
  ('Jimmy Uso', 'male'),
  ('Damian Priest', 'male'),
  ('JD McDonagh', 'male'),
  ('Omos', 'male'),

  -- Surprise Entrants & Guest Appearances
  ('Shane McMahon', 'male'),
  ('Vince McMahon', 'male'),
  ('Pat McAfee', 'male'),
  ('Bad Bunny', 'male'),
  ('Johnny Knoxville', 'male'),
  ('Michael Cole', 'male'),
  ('Jerry Lawler', 'male'),
  ('Tazz', 'male'),
  ('The Hurricane', 'male'),
  ('DDP', 'male'),
  ('Kevin Nash', 'male'),
  ('Scott Hall', 'male'),
  ('Road Dogg', 'male'),
  ('Billy Gunn', 'male'),
  ('X-Pac', 'male'),
  ('The Honky Tonk Man', 'male'),
  ('Titus O''Neil', 'male'),
  ('The Mountie', 'male'),
  ('IRS', 'male'),
  ('Bob Orton', 'male'),
  ('Ted DiBiase Sr.', 'male'),
  ('Sting', 'male')
ON CONFLICT (name) DO NOTHING;

-- Verify the migration
SELECT gender, COUNT(*) as count FROM public.wrestler_pool GROUP BY gender;
SELECT * FROM public.wrestler_pool ORDER BY name LIMIT 20;
