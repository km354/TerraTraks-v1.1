/**
 * Mapbox Geocoding API service
 * Uses the Mapbox Geocoding API to search for places and addresses
 */

export interface GeocodingFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    accuracy?: string;
    address?: string;
    category?: string;
    maki?: string;
    wikidata?: string;
  };
  text: string; // Main text (e.g., "Las Vegas")
  place_name: string; // Full place name (e.g., "Las Vegas, Nevada, United States")
  center: [number, number]; // [lng, lat]
  geometry: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

export interface GeocodingResponse {
  type: string;
  query: string[];
  features: GeocodingFeature[];
  attribution: string;
}

const MAPBOX_BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

/**
 * Search for places using Mapbox Geocoding API
 * @param query - Search query (e.g., "Las Vegas", "SLC Airport")
 * @param options - Optional parameters
 * @returns Promise with geocoding results
 */
export async function searchPlaces(
  query: string,
  options: {
    limit?: number;
    proximity?: [number, number]; // [lng, lat] - bias results towards this location
    types?: string; // Comma-separated list: country,region,postcode,district,place,locality,neighborhood,address
    country?: string; // ISO 3166-1 alpha-2 country code (e.g., "us")
  } = {}
): Promise<GeocodingFeature[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;

  if (!token) {
    console.error("NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN is not set");
    return [];
  }

  const trimmed = query.trim();

  // Optional: ignore very short/empty input
  if (trimmed.length < 1) {
    return [];
  }

  try {
    // Fully URL-encode the search text
    const encodedQuery = encodeURIComponent(trimmed);

    // Build URL with only one ? before query parameters
    const url = `${MAPBOX_BASE_URL}/${encodedQuery}.json?` +
      `access_token=${token}` +
      `&limit=${options.limit || 3}` +
      (options.types ? `&types=${options.types}` : "&types=place,locality,neighborhood,address,district") +
      (options.proximity ? `&proximity=${options.proximity[0]},${options.proximity[1]}` : "") +
      (options.country ? `&country=${options.country}` : "");

    const response = await fetch(url);

    if (!response.ok) {
      const body = await response.text(); // helpful for debugging
      console.error("Mapbox Geocoding API error", response.status, body);
      throw new Error(`Mapbox Geocoding API error: ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error fetching geocoding results:", error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to get place name
 * @param lng - Longitude
 * @param lat - Latitude
 * @returns Promise with place name
 */
export async function reverseGeocode(
  lng: number,
  lat: number
): Promise<GeocodingFeature | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;

  if (!token) {
    console.error("NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN is not set");
    return null;
  }

  try {
    // Build URL with only one ? before query parameters
    const url = `${MAPBOX_BASE_URL}/${lng},${lat}.json?access_token=${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      const body = await response.text(); // helpful for debugging
      console.error("Mapbox Geocoding API error", response.status, body);
      throw new Error(`Mapbox Geocoding API error: ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();
    return data.features && data.features.length > 0 ? data.features[0] : null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}

