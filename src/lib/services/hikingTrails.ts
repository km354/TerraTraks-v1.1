import { supabase } from "@/lib/supabaseClient";
import type { HikingTrail } from "@/lib/types/hikingTrails";

/**
 * Fetch all hiking trails from Supabase
 */
export async function getAllHikingTrails(): Promise<HikingTrail[]> {
  try {
    console.log("🔍 Querying Supabase: getAllHikingTrails()");
    console.log("🔍 Table: 'hikes', Columns: '*'");
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .order("hike_name", { ascending: true });

    if (error) {
      console.error("❌ Supabase ERROR in getAllHikingTrails:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
      return [];
    }

    console.log("✅ getAllHikingTrails returned:", data?.length || 0, "rows");
    if (data && data.length > 0) {
      console.log("📋 Sample row:", data[0]);
    } else {
      console.warn("⚠️ getAllHikingTrails returned 0 rows - check RLS policies or table data");
    }
    return data || [];
  } catch (error) {
    console.error("❌ EXCEPTION in getAllHikingTrails:", error);
    return [];
  }
}

/**
 * Fetch hiking trails by park code(s)
 */
export async function getHikingTrailsByParkCode(
  parkCodes: string[]
): Promise<HikingTrail[]> {
  if (parkCodes.length === 0) {
    return [];
  }

  try {
    console.log("🔍 Querying Supabase: getHikingTrailsByParkCode()");
    console.log("🔍 Table: 'hikes', Column: 'park_code', Values:", parkCodes);
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .in("park_code", parkCodes)
      .order("hike_name", { ascending: true });

    if (error) {
      console.error("❌ Supabase ERROR in getHikingTrailsByParkCode:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
      return [];
    }

    console.log("✅ getHikingTrailsByParkCode returned:", data?.length || 0, "rows");
    if (data && data.length > 0) {
      console.log("📋 Sample row:", data[0]);
    } else {
      console.warn("⚠️ getHikingTrailsByParkCode returned 0 rows for park codes:", parkCodes);
      console.warn("⚠️ Check: 1) RLS policies allow SELECT, 2) park_code values match, 3) table has data");
    }
    return data || [];
  } catch (error) {
    console.error("❌ EXCEPTION in getHikingTrailsByParkCode:", error);
    return [];
  }
}

/**
 * Fetch hiking trails by park name(s)
 */
export async function getHikingTrailsByParkName(
  parkNames: string[]
): Promise<HikingTrail[]> {
  if (parkNames.length === 0) {
    return [];
  }

  try {
    console.log("🔍 Querying Supabase: getHikingTrailsByParkName()");
    console.log("🔍 Table: 'hikes', Column: 'park_name', Values:", parkNames);
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .in("park_name", parkNames)
      .order("hike_name", { ascending: true });

    if (error) {
      console.error("❌ Supabase ERROR in getHikingTrailsByParkName:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
      return [];
    }

    console.log("✅ getHikingTrailsByParkName returned:", data?.length || 0, "rows");
    if (data && data.length > 0) {
      console.log("📋 Sample row:", data[0]);
    } else {
      console.warn("⚠️ getHikingTrailsByParkName returned 0 rows for park names:", parkNames);
      console.warn("⚠️ Check: 1) RLS policies allow SELECT, 2) park_name values match exactly, 3) table has data");
    }
    return data || [];
  } catch (error) {
    console.error("❌ EXCEPTION in getHikingTrailsByParkName:", error);
    return [];
  }
}

/**
 * Search hiking trails by name
 */
export async function searchHikingTrails(
  searchTerm: string
): Promise<HikingTrail[]> {
  if (!searchTerm) {
    return [];
  }

  try {
    console.log("🔍 Querying Supabase: searchHikingTrails()");
    console.log("🔍 Table: 'hikes', Column: 'hike_name', Search:", searchTerm);
    const { data, error } = await supabase
      .from("hikes")
      .select("*")
      .ilike("hike_name", `%${searchTerm}%`)
      .order("hike_name", { ascending: true })
      .limit(50);

    if (error) {
      console.error("❌ Supabase ERROR in searchHikingTrails:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
      return [];
    }

    console.log("✅ searchHikingTrails returned:", data?.length || 0, "rows");
    return data || [];
  } catch (error) {
    console.error("❌ EXCEPTION in searchHikingTrails:", error);
    return [];
  }
}

