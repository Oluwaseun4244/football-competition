export interface SquadMember {
  id: number;
  team_id: string;
  name: string;
  position: string;
  competition_id: string;
  role_name: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  number: number;
}

export interface Coach extends SquadMember {
  role_name: 'coach';
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  logo: string;
  competition_id: string;
  created_at: string;
  updated_at: string;
  squad_members: SquadMember[];
  coaches: Coach[];
  players: SquadMember[];
} 