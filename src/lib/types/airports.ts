export interface Airport {
  id: number;
  code: string; // Airport code (e.g., "DFW", "JFK")
  name: string; // Airport name (e.g., "Dallas/Fort Worth International Airport")
  city: string; // City name
  state: string; // State abbreviation (e.g., "TX")
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

