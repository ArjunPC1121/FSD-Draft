/*
  # Initial Schema for MakeMyLeague

  1. New Tables
    - `leagues` - Stores league information with unique codes
    - `teams` - Stores team information for each league
    - `players` - Stores player information for each team
    - `matches` - Stores match information between teams

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own leagues
    - Add policies for public access to view leagues by code
*/

-- Create leagues table
CREATE TABLE IF NOT EXISTS leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL CHECK (sport_type IN ('Cricket', 'Football', 'Badminton')),
  code TEXT NOT NULL UNIQUE,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- League policies
-- Admin can do everything with their own leagues
CREATE POLICY "League admins can do everything with their leagues"
  ON leagues
  USING (admin_id = auth.uid());

-- Anyone can view leagues by code (for public access)
CREATE POLICY "Anyone can view leagues by code"
  ON leagues
  FOR SELECT
  USING (true);

-- Team policies
-- Admin can manage teams in their leagues
CREATE POLICY "League admins can manage teams"
  ON teams
  USING (
    league_id IN (
      SELECT id FROM leagues WHERE admin_id = auth.uid()
    )
  );

-- Anyone can view teams in a league
CREATE POLICY "Anyone can view teams"
  ON teams
  FOR SELECT
  USING (true);

-- Player policies
-- Admin can manage players in their leagues
CREATE POLICY "League admins can manage players"
  ON players
  USING (
    team_id IN (
      SELECT t.id FROM teams t
      JOIN leagues l ON t.league_id = l.id
      WHERE l.admin_id = auth.uid()
    )
  );

-- Anyone can view players
CREATE POLICY "Anyone can view players"
  ON players
  FOR SELECT
  USING (true);

-- Match policies
-- Admin can manage matches in their leagues
CREATE POLICY "League admins can manage matches"
  ON matches
  USING (
    league_id IN (
      SELECT id FROM leagues WHERE admin_id = auth.uid()
    )
  );

-- Anyone can view matches
CREATE POLICY "Anyone can view matches"
  ON matches
  FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leagues_admin_id ON leagues(admin_id);
CREATE INDEX IF NOT EXISTS idx_leagues_code ON leagues(code);
CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_league_id ON matches(league_id);
CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(home_team_id, away_team_id);