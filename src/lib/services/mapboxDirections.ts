/**
 * Mapbox Directions API service
 * Uses the Mapbox Directions API to calculate routes between points
 */

export interface RouteResponse {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: {
    coordinates: [number, number][]; // [lng, lat] pairs
  };
}

export interface DirectionsResponse {
  routes: RouteResponse[];
  code: string;
}

/**
 * Get directions between multiple waypoints using Mapbox Directions API
 * @param waypoints Array of [lng, lat] coordinates
 * @returns Promise with route information
 */
export async function getDirections(
  waypoints: [number, number][]
): Promise<DirectionsResponse | null> {
  // Use public token for client-side calls
  const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;
  
  if (!token) {
    console.error("NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN is not set");
    return null;
  }

  if (waypoints.length < 2) {
    return null;
  }

  try {
    // Format waypoints as "lng,lat;lng,lat;..."
    const coordinates = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${token}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox Directions API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching directions:", error);
    return null;
  }
}

/**
 * Calculate route between parks in order
 * @param parks Array of park coordinates
 * @returns Promise with route geometry and summary
 */
export async function calculateRouteBetweenParks(
  parks: { lat: number; lng: number }[]
): Promise<{
  coordinates: [number, number][];
  distance: number;
  duration: number;
} | null> {
  if (parks.length < 2) {
    return null;
  }

  const waypoints: [number, number][] = parks.map((park) => [park.lng, park.lat]);
  const directions = await getDirections(waypoints);

  if (!directions || !directions.routes || directions.routes.length === 0) {
    return null;
  }

  const route = directions.routes[0];
  return {
    coordinates: route.geometry.coordinates as [number, number][],
    distance: route.distance,
    duration: route.duration,
  };
}

