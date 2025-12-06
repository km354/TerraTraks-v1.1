import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API route to fetch NPS alerts
 * This proxies requests to avoid CORS issues and keep API keys secure
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parkCodes = searchParams.getAll("parkCode");

    console.log("🔔 NPS Alerts API Route called with parkCodes:", parkCodes);

    if (parkCodes.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Try both env var names (server-side and client-side)
    const apiKey = process.env.NPS_API_KEY || process.env.NEXT_PUBLIC_NPS_API_KEY;
    
    if (!apiKey || apiKey === "your_nps_api_key") {
      console.warn("⚠️ NPS API key not found or is placeholder. Alerts may not be fetched.");
      return NextResponse.json({ data: [], error: "API key not configured" }, { status: 200 });
    }

    // Fetch alerts for all parks in parallel
    const alertPromises = parkCodes.map(async (parkCode) => {
      const url = `https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}`;

      console.log(`🔍 Fetching alerts for ${parkCode}...`);

      try {
        const headers: HeadersInit = {
          "Accept": "application/json",
          "User-Agent": "TerraTraks/1.0",
        };

        // NPS API requires API key in Authorization header OR as query param
        // Try both methods for compatibility
        if (apiKey) {
          headers["X-Api-Key"] = apiKey;
        }

        const response = await fetch(`${url}${apiKey ? `&api_key=${apiKey}` : ""}`, {
          headers,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ NPS API error for ${parkCode}:`, response.status, response.statusText, errorText);
          return [];
        }

        const data = await response.json();
        console.log(`📦 Raw API response for ${parkCode}:`, JSON.stringify(data, null, 2));
        
        // NPS API returns { data: [...] } format
        const rawAlerts = data.data || [];
        console.log(`📋 Raw alerts array length: ${rawAlerts.length}`);
        
        // Map alerts - include all alerts, not filtering any out
        const alerts = rawAlerts.map((alert: any) => {
          const mapped = {
            id: alert.id || String(Math.random()),
            title: alert.title || "Alert",
            description: alert.description || alert.title || "No description available",
            category: alert.category || alert.categoryName || "Information",
            url: alert.url || undefined,
            parkCode: parkCode.toLowerCase(),
          };
          console.log(`   Mapped alert:`, mapped);
          return mapped;
        });

        console.log(`✅ Found ${alerts.length} alerts for ${parkCode}`);
        if (alerts.length > 0) {
          console.log(`   Sample alert:`, alerts[0]);
        }

        return alerts;
      } catch (error) {
        console.error(`❌ Error fetching alerts for ${parkCode}:`, error);
        return [];
      }
    });

    const alertArrays = await Promise.all(alertPromises);
    const allAlerts = alertArrays.flat();

    console.log(`✅ Total alerts fetched: ${allAlerts.length}`);

    return NextResponse.json({ data: allAlerts }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in NPS alerts API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

