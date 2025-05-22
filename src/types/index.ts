export type Sport = 'Cricket' | 'Football' | 'Badminton';

export interface User {
  id: string;
  email: string;
}

export interface League {
  id: string;
  name: string;
  sport_type: Sport;
  code: string;
  admin_id: string;
  created_at: string;
}

export interface Team {
  id: string;
  league_id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
}

export interface Player {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
}

export interface Match {
  id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  match_time: string;
  home_score: number | null;
  away_score: number | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface TeamWithDetails extends Team {
  players: Player[];
  wins: number;
  losses: number;
  draws: number;
  points: number;
}

export interface MatchWithTeamNames extends Match {
  home_team_name: string;
  away_team_name: string;
}