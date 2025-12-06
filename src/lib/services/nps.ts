/**
 * National Park Service API Service
 * 
 * TODO: Implement real NPS API integration
 * API Documentation: https://www.nps.gov/subjects/developer/api-documentation.htm
 */

export interface ParkInfo {
  parkCode: string;
  fullName: string;
  description: string;
  latitude: string;
  longitude: string;
  states: string;
  url: string;
  weatherInfo?: string;
  operatingHours?: Array<{
    name: string;
    description: string;
    standardHours: Record<string, string>;
  }>;
}

export interface ParkAlert {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  parkCode: string;
}

export interface ParksResponse {
  data: ParkInfo[];
  total: string;
  limit: string;
  start: string;
}

/**
 * Fetch park information by park code
 * @param parkCode - NPS park code (e.g., "yell" for Yellowstone)
 */
export async function fetchParkInfo(
  parkCode: string
): Promise<ParkInfo | null> {
  // TODO: Implement real NPS API call
  // const apiKey = process.env.NPS_API_KEY;
  // const response = await fetch(
  //   `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${apiKey}`
  // );
  // const data: ParksResponse = await response.json();
  // return data.data[0] || null;

  // Mock data for development
  const mockParks: Record<string, ParkInfo> = {
    yell: {
      parkCode: "yell",
      fullName: "Yellowstone National Park",
      description:
        "Yellowstone National Park is a nearly 3,500-sq.-mile wilderness recreation area atop a volcanic hot spot.",
      latitude: "44.4280",
      longitude: "-110.5885",
      states: "WY,MT,ID",
      url: "https://www.nps.gov/yell/index.htm",
      weatherInfo:
        "Yellowstone's weather can vary dramatically. Summer days can be warm, but nights are cool.",
    },
    grte: {
      parkCode: "grte",
      fullName: "Grand Teton National Park",
      description:
        "Rising above a scene rich with extraordinary wildlife, pristine lakes, and alpine terrain.",
      latitude: "43.7904",
      longitude: "-110.6818",
      states: "WY",
      url: "https://www.nps.gov/grte/index.htm",
      weatherInfo:
        "Weather in Grand Teton is highly variable and can change rapidly.",
    },
  };

  return mockParks[parkCode.toLowerCase()] || null;
}

/**
 * Fetch alerts for a specific park
 * @param parkCode - NPS park code
 */
export async function fetchAlerts(parkCode: string): Promise<ParkAlert[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NPS_API_KEY;
    const url = apiKey
      ? `https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&api_key=${apiKey}`
      : `https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TerraTraks/1.0',
      },
    });

    if (!response.ok) {
      console.error(`NPS API error for ${parkCode}:`, response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return (data.data || []).map((alert: any) => ({
      id: alert.id,
      title: alert.title,
      description: alert.description || alert.title,
      category: alert.category || "Information",
      url: alert.url,
      parkCode: parkCode.toLowerCase(),
    }));
  } catch (error) {
    console.error(`Error fetching alerts for ${parkCode}:`, error);
    return [];
  }
}

/**
 * Fetch alerts for multiple parks using Next.js API route (recommended)
 * @param parkCodes - Array of NPS park codes
 */
export async function fetchAlertsForParks(parkCodes: string[]): Promise<ParkAlert[]> {
  if (parkCodes.length === 0) {
    return [];
  }

  try {
    // Use Next.js API route to avoid CORS and keep API key secure
    const params = new URLSearchParams();
    parkCodes.forEach((code) => params.append("parkCode", code));
    
    const apiUrl = `/api/nps/alerts?${params.toString()}`;
    console.log("🔔 Calling NPS alerts API:", apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error fetching alerts from API route:", response.status, response.statusText, errorText);
      return [];
    }

    const data = await response.json();
    console.log("✅ Received alerts data:", data);
    const alerts = data.data || [];
    console.log(`✅ Parsed ${alerts.length} alerts`);
    
    return alerts;
  } catch (error) {
    console.error("❌ Error fetching alerts for parks:", error);
    return [];
  }
}

/**
 * Search parks by name or state
 * @param query - Search query
 */
export async function searchParks(query: string): Promise<ParkInfo[]> {
  // TODO: Implement real NPS API search
  // const apiKey = process.env.NPS_API_KEY;
  // const response = await fetch(
  //   `https://developer.nps.gov/api/v1/parks?q=${encodeURIComponent(query)}&api_key=${apiKey}`
  // );
  // const data: ParksResponse = await response.json();
  // return data.data || [];

  // Mock data for development
  return [];
}

