interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Fixture {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_team: Team;
  away_team: Team;
  competition_id: string;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
  home_team_goals?: number;
  away_team_goals?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFixtureData {
  home_team_id: number;
  away_team_id: number;
  date: string;
  time: string;
  competition_id: string;
} 