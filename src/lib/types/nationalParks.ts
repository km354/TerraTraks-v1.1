/**
 * TypeScript types for National Parks database table
 */

export interface NationalPark {
  id: number;
  national_park_name: string;
  state: string;
  park_code: string;
  main_entrance_name: string | null;
  latitude_deg: number;
  longitude_deg: number;
  visitor_center: boolean;
  primary_entrance_visitor_center: string | null;
  created_at: string;
  updated_at: string;
}

export interface NationalParkInsert {
  national_park_name: string;
  state: string;
  park_code: string;
  main_entrance_name?: string | null;
  latitude_deg: number;
  longitude_deg: number;
  visitor_center?: boolean;
  primary_entrance_visitor_center?: string | null;
}

