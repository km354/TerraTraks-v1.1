export interface HikingTrail {
  id: number;
  park_code: string;
  park_name: string;
  hike_name: string;
  difficulty: "easy" | "moderate" | "hard" | "strenuous";
  permit_required: boolean;
  hike_url: string;
  permit_url: string | null;
  created_at: string;
  updated_at: string;
}

