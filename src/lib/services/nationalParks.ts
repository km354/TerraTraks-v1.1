import { supabase } from "@/lib/supabaseClient";
import type { NationalPark } from "@/lib/types/nationalParks";

/**
 * Fetch all national parks from Supabase
 */
export async function getAllNationalParks(): Promise<NationalPark[]> {
  try {
    const { data, error } = await supabase
      .from("national_parks")
      .select("*")
      .order("national_park_name", { ascending: true });

    if (error) {
      console.error("Error fetching national parks:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching national parks:", error);
    return [];
  }
}

/**
 * Fetch parks by park code(s)
 */
export async function getParksByCode(
  parkCodes: string[]
): Promise<NationalPark[]> {
  try {
    const { data, error } = await supabase
      .from("national_parks")
      .select("*")
      .in("park_code", parkCodes)
      .order("national_park_name", { ascending: true });

    if (error) {
      console.error("Error fetching parks by code:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching parks by code:", error);
    return [];
  }
}

/**
 * Fetch parks by name (fuzzy search)
 */
export async function searchParksByName(
  searchTerm: string
): Promise<NationalPark[]> {
  try {
    const { data, error } = await supabase
      .from("national_parks")
      .select("*")
      .ilike("national_park_name", `%${searchTerm}%`)
      .order("national_park_name", { ascending: true })
      .limit(20);

    if (error) {
      console.error("Error searching parks:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error searching parks:", error);
    return [];
  }
}

/**
 * Comprehensive search across park name, state, and entrance name
 * Returns unique parks (deduplicated by park_code)
 */
export async function searchParksComprehensive(
  searchTerm: string
): Promise<NationalPark[]> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    // Search across multiple fields using OR conditions
    const { data, error } = await supabase
      .from("national_parks")
      .select("*")
      .or(
        `national_park_name.ilike.%${searchLower}%,state.ilike.%${searchLower}%,main_entrance_name.ilike.%${searchLower}%`
      )
      .order("national_park_name", { ascending: true })
      .limit(100); // Get more results to deduplicate

    if (error) {
      console.error("Error searching parks comprehensively:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Deduplicate by park_code, keeping the first occurrence (prefer primary entrance if available)
    const parkMap = new Map<string, NationalPark>();
    
    for (const park of data) {
      const existing = parkMap.get(park.park_code);
      
      // If no existing park, or if this one has a primary entrance and existing doesn't
      if (!existing || (park.primary_entrance_visitor_center && !existing.primary_entrance_visitor_center)) {
        parkMap.set(park.park_code, park);
      }
    }

    // Convert map values to array and sort
    const uniqueParks = Array.from(parkMap.values()).sort((a, b) =>
      a.national_park_name.localeCompare(b.national_park_name)
    );

    return uniqueParks;
  } catch (error) {
    console.error("Error searching parks comprehensively:", error);
    return [];
  }
}

/**
 * Get all unique national parks (deduplicated by park_code)
 * Useful for displaying all available parks
 */
export async function getAllUniqueNationalParks(): Promise<NationalPark[]> {
  try {
    const { data, error } = await supabase
      .from("national_parks")
      .select("*")
      .order("national_park_name", { ascending: true });

    if (error) {
      console.error("Error fetching all unique parks:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Deduplicate by park_code, keeping the first occurrence (prefer primary entrance if available)
    const parkMap = new Map<string, NationalPark>();
    
    for (const park of data) {
      const existing = parkMap.get(park.park_code);
      
      // If no existing park, or if this one has a primary entrance and existing doesn't
      if (!existing || (park.primary_entrance_visitor_center && !existing.primary_entrance_visitor_center)) {
        parkMap.set(park.park_code, park);
      }
    }

    // Convert map values to array and sort
    const uniqueParks = Array.from(parkMap.values()).sort((a, b) =>
      a.national_park_name.localeCompare(b.national_park_name)
    );

    return uniqueParks;
  } catch (error) {
    console.error("Error fetching all unique parks:", error);
    return [];
  }
}

/**
 * Get primary entrance for a park (where primary_entrance_visitor_center is not null)
 */
export async function getPrimaryEntrance(
  parkCode: string
): Promise<NationalPark | null> {
  try {
    const { data, error } = await supabase
      .from("national_parks")
      .select("*")
      .eq("park_code", parkCode)
      .not("primary_entrance_visitor_center", "is", null)
      .limit(1)
      .single();

    if (error) {
      // If no primary entrance found, get the first one
      const { data: fallbackData } = await supabase
        .from("national_parks")
        .select("*")
        .eq("park_code", parkCode)
        .limit(1)
        .single();
      return fallbackData || null;
    }

    return data || null;
  } catch (error) {
    console.error("Error fetching primary entrance:", error);
    return null;
  }
}

/**
 * Convert park name to park code (comprehensive mapping)
 */
export function getParkCodeFromName(parkName: string): string {
  const parkCodeMap: Record<string, string> = {
    "Acadia National Park": "acad",
    "National Park of American Samoa": "npsa",
    "Arches National Park": "arch",
    "Badlands National Park": "badl",
    "Big Bend National Park": "bibe",
    "Biscayne National Park": "bisc",
    "Black Canyon of the Gunnison National Park": "blca",
    "Bryce Canyon National Park": "brca",
    "Canyonlands National Park": "cany",
    "Capitol Reef National Park": "care",
    "Carlsbad Caverns National Park": "cave",
    "Channel Islands National Park": "chis",
    "Congaree National Park": "cong",
    "Crater Lake National Park": "crla",
    "Cuyahoga Valley National Park": "cuva",
    "Death Valley National Park": "deva",
    "Denali National Park and Preserve": "dena",
    "Dry Tortugas National Park": "drto",
    "Everglades National Park": "ever",
    "Gates of the Arctic National Park and Preserve": "gaar",
    "Gateway Arch National Park": "jeff",
    "Glacier National Park": "glac",
    "Glacier Bay National Park and Preserve": "glba",
    "Grand Canyon National Park": "grca",
    "Grand Teton National Park": "grte",
    "Great Basin National Park": "grba",
    "Great Sand Dunes National Park and Preserve": "grsa",
    "Great Smoky Mountains National Park": "grsm",
    "Guadalupe Mountains National Park": "gumo",
    "Haleakalā National Park": "hale",
    "Hawaiʻi Volcanoes National Park": "havo",
    "Hot Springs National Park": "hosp",
    "Indiana Dunes National Park": "indu",
    "Isle Royale National Park": "isro",
    "Joshua Tree National Park": "jotr",
    "Katmai National Park and Preserve": "katm",
    "Kenai Fjords National Park": "kefj",
    "Kings Canyon National Park": "kica",
    "Kobuk Valley National Park": "kova",
    "Lake Clark National Park and Preserve": "lacl",
    "Lassen Volcanic National Park": "lavo",
    "Mammoth Cave National Park": "maca",
    "Mesa Verde National Park": "meve",
    "Mount Rainier National Park": "mora",
    "New River Gorge National Park and Preserve": "neri",
    "North Cascades National Park": "noca",
    "Olympic National Park": "olym",
    "Petrified Forest National Park": "pefo",
    "Pinnacles National Park": "pinn",
    "Redwood National and State Parks": "redw",
    "Rocky Mountain National Park": "romo",
    "Saguaro National Park": "sagu",
    "Sequoia National Park": "seki",
    "Shenandoah National Park": "shen",
    "Theodore Roosevelt National Park": "thro",
    "Virgin Islands National Park": "viis",
    "Voyageurs National Park": "voya",
    "White Sands National Park": "whsa",
    "Wind Cave National Park": "wica",
    "Wrangell–St. Elias National Park and Preserve": "wrst",
    "Yellowstone National Park": "yell",
    "Yosemite National Park": "yose",
    "Zion National Park": "zion",
  };

  return parkCodeMap[parkName] || parkName.toLowerCase().replace(/\s+/g, "-");
}

