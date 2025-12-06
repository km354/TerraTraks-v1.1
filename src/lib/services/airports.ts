import { supabase } from "@/lib/supabaseClient";
import type { Airport } from "@/lib/types/airports";

/**
 * Search airports by code, name, or city
 */
export async function searchAirports(query: string): Promise<Airport[]> {
  if (!query || query.trim().length < 1) {
    return [];
  }

  try {
    const searchTerm = query.trim().toLowerCase();
    
    // Search by code (exact match or partial)
    const codeQuery = supabase
      .from("airports")
      .select("*")
      .ilike("code", `%${searchTerm}%`)
      .order("code", { ascending: true })
      .limit(10);

    // Search by name (partial match)
    const nameQuery = supabase
      .from("airports")
      .select("*")
      .ilike("name", `%${searchTerm}%`)
      .order("name", { ascending: true })
      .limit(10);

    // Search by city (partial match)
    const cityQuery = supabase
      .from("airports")
      .select("*")
      .ilike("city", `%${searchTerm}%`)
      .order("city", { ascending: true })
      .limit(10);

    // Execute all queries in parallel
    const [codeResults, nameResults, cityResults] = await Promise.all([
      codeQuery,
      nameQuery,
      cityQuery,
    ]);

    // Combine and deduplicate results
    const allAirports = new Map<number, Airport>();

    // Add code results first (highest priority)
    if (codeResults.data) {
      codeResults.data.forEach((airport) => {
        allAirports.set(airport.id, airport);
      });
    }

    // Add name results
    if (nameResults.data) {
      nameResults.data.forEach((airport) => {
        allAirports.set(airport.id, airport);
      });
    }

    // Add city results
    if (cityResults.data) {
      cityResults.data.forEach((airport) => {
        allAirports.set(airport.id, airport);
      });
    }

    // Log errors if any
    if (codeResults.error) {
      console.error("❌ Error searching airports by code:", codeResults.error);
    }
    if (nameResults.error) {
      console.error("❌ Error searching airports by name:", nameResults.error);
    }
    if (cityResults.error) {
      console.error("❌ Error searching airports by city:", cityResults.error);
    }

    const airports = Array.from(allAirports.values());
    console.log(`✅ Found ${airports.length} airports for query: "${query}"`);
    
    return airports;
  } catch (error) {
    console.error("❌ EXCEPTION in searchAirports:", error);
    return [];
  }
}

/**
 * Get all airports (for popular airports list)
 */
export async function getAllAirports(): Promise<Airport[]> {
  try {
    const { data, error } = await supabase
      .from("airports")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("❌ Error fetching all airports:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("❌ EXCEPTION in getAllAirports:", error);
    return [];
  }
}

