"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { searchPlaces, type GeocodingFeature } from "@/lib/services/mapboxGeocoding";
import { searchAirports } from "@/lib/services/airports";
import type { Airport } from "@/lib/types/airports";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Preset park configurations
const PRESET_PARKS: Record<string, string[]> = {
  "yellowstone-grand-teton": [
    "Yellowstone National Park",
    "Grand Teton National Park",
  ],
  "utah-mighty-5": [
    "Zion National Park",
    "Bryce Canyon National Park",
    "Arches National Park",
    "Canyonlands National Park",
    "Capitol Reef National Park",
  ],
  "grand-canyon-zion-bryce": [
    "Grand Canyon National Park",
    "Zion National Park",
    "Bryce Canyon National Park",
  ],
};

const ALL_PARKS = [
  "Yellowstone National Park",
  "Grand Canyon National Park",
  "Zion National Park",
  "Yosemite National Park",
  "Rocky Mountain National Park",
  "Grand Teton National Park",
  "Glacier National Park",
  "Acadia National Park",
  "Bryce Canyon National Park",
  "Arches National Park",
  "Canyonlands National Park",
  "Capitol Reef National Park",
  "Great Smoky Mountains National Park",
  "Olympic National Park",
  "Sequoia National Park",
  "Kings Canyon National Park",
];

// Popular US starting locations for trip planning
const POPULAR_STARTING_LOCATIONS: GeocodingFeature[] = [
  {
    id: "popular-las-vegas",
    type: "Feature",
    place_type: ["place"],
    relevance: 1,
    properties: {},
    text: "Las Vegas",
    place_name: "Las Vegas, NV, United States",
    center: [-115.1372, 36.1699],
    geometry: {
      type: "Point",
      coordinates: [-115.1372, 36.1699],
    },
    context: [
      { id: "place.123", text: "Las Vegas" },
      { id: "region.456", text: "Nevada", short_code: "US-NV" },
    ],
  },
  {
    id: "popular-salt-lake-city",
    type: "Feature",
    place_type: ["place"],
    relevance: 1,
    properties: {},
    text: "Salt Lake City",
    place_name: "Salt Lake City, UT, United States",
    center: [-111.8910, 40.7608],
    geometry: {
      type: "Point",
      coordinates: [-111.8910, 40.7608],
    },
    context: [
      { id: "place.123", text: "Salt Lake City" },
      { id: "region.456", text: "Utah", short_code: "US-UT" },
    ],
  },
  {
    id: "popular-phoenix",
    type: "Feature",
    place_type: ["place"],
    relevance: 1,
    properties: {},
    text: "Phoenix",
    place_name: "Phoenix, AZ, United States",
    center: [-112.0740, 33.4484],
    geometry: {
      type: "Point",
      coordinates: [-112.0740, 33.4484],
    },
    context: [
      { id: "place.123", text: "Phoenix" },
      { id: "region.456", text: "Arizona", short_code: "US-AZ" },
    ],
  },
];

// Helper to convert Airport to GeocodingFeature for display
function airportToGeocodingFeature(airport: Airport): GeocodingFeature {
  return {
    id: `airport-${airport.id}`,
    type: "Feature",
    place_type: ["poi"], // Mark as POI for airport detection
    relevance: 1,
    properties: {
      category: "airport",
      maki: "airport",
    },
    text: airport.name,
    place_name: `${airport.name}, ${airport.city}, ${airport.state}`,
    center: [airport.longitude, airport.latitude],
    geometry: {
      type: "Point",
      coordinates: [airport.longitude, airport.latitude],
    },
    context: [
      { id: "place.airport", text: airport.city },
      { id: "region.airport", text: airport.state, short_code: `US-${airport.state}` },
    ],
  };
}

// Helper to get state abbreviation
function getStateAbbreviation(stateName: string): string | null {
  const stateMap: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
  };
  return stateMap[stateName] || null;
}

// Helper to check if a feature is an airport
function isAirportFeature(feature: GeocodingFeature): boolean {
  const types = feature.place_type || [];
  const category = feature.properties?.category?.toLowerCase() || '';
  const maki = feature.properties?.maki?.toLowerCase() || '';
  const text = (feature.text || '').toLowerCase();
  const placeName = (feature.place_name || '').toLowerCase();
  
  // Check if it's a POI with airport category (even though POI might not work in v5)
  if (types.includes('poi') && (category === 'airport' || maki === 'airport')) {
    return true;
  }
  
  // Check if category or maki indicates airport
  if (category === 'airport' || maki === 'airport') {
    return true;
  }
  
  // IMPORTANT: Check if text/place_name contains airport-related terms
  // This will catch airports that come back as "place" type (since POI doesn't work in Mapbox v5)
  const airportKeywords = ['airport', 'international', 'airfield', 'air base', 'aviation'];
  const hasAirportKeyword = airportKeywords.some(keyword => 
    text.includes(keyword) || placeName.includes(keyword)
  );
  
  if (hasAirportKeyword) {
    return true;
  }
  
  // Check for common airport name patterns (e.g., "DFW Airport", "JFK International")
  const airportCodePattern = /\b([A-Z]{2,4})\s+(airport|international)\b/i;
  if (airportCodePattern.test(text) || airportCodePattern.test(placeName)) {
    return true;
  }
  
  // Check for airport codes in the name (DFW, JFK, LAX, etc.)
  const commonAirportCodes = ['dfw', 'jfk', 'lax', 'ord', 'atl', 'den', 'sfo', 'sea', 'msp', 'dtw', 'phx', 'clt', 'mia', 'bwi', 'iad', 'dul', 'slc', 'iah', 'mco', 'ewr', 'lga', 'bos', 'pdx', 'san', 'stl', 'bna', 'msy', 'iad', 'dca'];
  const hasAirportCode = commonAirportCodes.some(code => 
    text.includes(code) || placeName.includes(code)
  );
  
  if (hasAirportCode && (text.includes('airport') || placeName.includes('airport') || text.includes('international') || placeName.includes('international'))) {
    return true;
  }
  
  return false;
}

// Format place name to "City, ST" format using context array, or full address for addresses
function formatPlaceName(feature: GeocodingFeature): string {
  // Check if it's an airport first (even if returned as address)
  const isAirport = isAirportFeature(feature);
  if (isAirport) {
    // For airports, prefer place_name which usually includes "Airport Name, City, ST"
    return feature.place_name || feature.text || '';
  }
  
  // For addresses, show the full place_name (includes street, city, state, zip)
  const isAddress = feature.place_type?.includes('address');
  if (isAddress) {
    return feature.place_name || feature.text || '';
  }
  
  // For POIs (other than airports), show the full place_name
  const isPOI = feature.place_type?.includes('poi');
  if (isPOI) {
    return feature.place_name || feature.text || '';
  }
  
  // For places/cities, format as "City, ST" (no zip codes)
  if (feature.context && feature.context.length > 0) {
    // Find the place/locality context (city name)
    const placeContext = feature.context.find(ctx => 
      ctx.id.startsWith('place.') || ctx.id.startsWith('locality.')
    );
    // Find the region context (state) with short_code
    const regionContext = feature.context.find(ctx => 
      ctx.id.startsWith('region.') && ctx.short_code
    );
    
    if (placeContext && regionContext && regionContext.short_code) {
      // Extract state abbreviation from short_code (e.g., "US-IL" -> "IL")
      const stateCode = regionContext.short_code.split('-').pop()?.toUpperCase();
      if (stateCode) {
        return `${placeContext.text}, ${stateCode}`;
      }
    }
    
    // Fallback: try to extract from place_name
    const parts = feature.place_name.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      // Get the last part which should be the state
      const lastPart = parts[parts.length - 1];
      // If it's "United States", get the second-to-last part
      if (lastPart === "United States" && parts.length >= 3) {
        const statePart = parts[parts.length - 2];
        // Remove zip code if present (e.g., "NV 89101" -> "NV")
        const stateOnly = statePart.replace(/\s+\d{5}$/, '').replace(/^\d{5}\s+/, '');
        const stateAbbr = getStateAbbreviation(stateOnly);
        if (stateAbbr) {
          return `${parts[0]}, ${stateAbbr}`;
        }
      } else {
        // Remove zip code if present
        const stateOnly = lastPart.replace(/\s+\d{5}$/, '').replace(/^\d{5}\s+/, '');
        const stateAbbr = getStateAbbreviation(stateOnly);
        if (stateAbbr) {
          return `${parts[0]}, ${stateAbbr}`;
        }
        // Check if it's already a state abbreviation (2 letters)
        if (/^[A-Z]{2}$/.test(stateOnly)) {
          return `${parts[0]}, ${stateOnly}`;
        }
      }
    }
  }
  
  // Final fallback: try to extract city and state from place_name
  if (feature.place_name) {
    const parts = feature.place_name.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const city = parts[0];
      const lastPart = parts[parts.length - 1];
      const statePart = lastPart === "United States" && parts.length >= 3
        ? parts[parts.length - 2]
        : lastPart;
      
      // Remove zip code if present
      const stateOnly = statePart.replace(/\s+\d{5}$/, '').replace(/^\d{5}\s+/, '');
      const stateAbbr = getStateAbbreviation(stateOnly);
      if (stateAbbr) {
        return `${city}, ${stateAbbr}`;
      }
      // Check if it's already a state abbreviation (2 letters)
      if (/^[A-Z]{2}$/.test(stateOnly)) {
        return `${city}, ${stateOnly}`;
      }
    }
    return feature.place_name;
  }
  
  // Final fallback: return the main text
  return feature.text || '';
}

interface SortableParkItemProps {
  park: string;
  index: number;
  onRemove: () => void;
}

function SortableParkItem({ park, index, onRemove }: SortableParkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: park });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-lg border border-surface-divider bg-white hover:bg-surface-background transition cursor-move group"
    >
      <span
        {...attributes}
        {...listeners}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white font-semibold flex-shrink-0 cursor-grab active:cursor-grabbing"
      >
        {index + 1}
      </span>
      <span className="flex-1 text-sm md:text-base text-text-primary">
        {park}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition text-text-secondary hover:text-gray-900 text-sm md:text-base"
        aria-label={`Remove ${park}`}
      >
        ×
      </button>
    </div>
  );
}

function FiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tripParks, setTripParks] = useState<string[]>([]);
  const [startingPoint, setStartingPoint] = useState("");
  const [startingPointFeature, setStartingPointFeature] = useState<GeocodingFeature | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [isFlexibleDates, setIsFlexibleDates] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<Date[]>([]);
  const [flexibleSeason, setFlexibleSeason] = useState<"no-preference" | "spring" | "summer" | "fall" | "winter">("no-preference");
  const [flexibleDuration, setFlexibleDuration] = useState<"no-preference" | "weekend" | "short" | "week-long">("no-preference");
  const [tripPace, setTripPace] = useState<"relaxed" | "balanced" | "packed">(
    "balanced"
  );
  const [drivingTime, setDrivingTime] = useState<"no-preference" | "<2" | "2-4" | "4+">("no-preference");
  const [hikingTime, setHikingTime] = useState<"no-preference" | "0-1" | "1-3" | "4-6" | "all-day">("no-preference");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddPark, setShowAddPark] = useState(false);
  const [parkSearchTerm, setParkSearchTerm] = useState("");
  const [isParkInputFocused, setIsParkInputFocused] = useState(false);
  const [startingPointSuggestions, setStartingPointSuggestions] = useState<GeocodingFeature[]>([]);
  const [showStartingPointSuggestions, setShowStartingPointSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const parkInputRef = useRef<HTMLDivElement>(null);
  const startingPointRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize parks from URL params, preset, or default
  useEffect(() => {
    const parksFromUrl = searchParams.getAll("parks");
    if (parksFromUrl.length > 0) {
      setTripParks(parksFromUrl);
    } else {
      const preset = searchParams.get("preset");
      if (preset && PRESET_PARKS[preset]) {
        setTripParks(PRESET_PARKS[preset]);
      } else {
        setTripParks([]);
      }
    }
  }, [searchParams]);

  // Initialize date range from URL params
  useEffect(() => {
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    if (startDateStr && endDateStr) {
      setDateRange([new Date(startDateStr), new Date(endDateStr)]);
    }
  }, [searchParams]);

  // Filter and sort suggestions - prioritize based on query type
  const filterValidSuggestions = useCallback((results: GeocodingFeature[], query: string): GeocodingFeature[] => {
    // First filter out invalid suggestions
    const validResults = results.filter((feature) => {
      const text = feature.text || "";
      const placeName = feature.place_name || "";
      
      // For addresses and airports, be more lenient with filtering
      const isAddress = feature.place_type?.includes('address');
      const isPOI = feature.place_type?.includes('poi');
      const isAirport = isAirportFeature(feature); // Check if it's an airport (even if not POI type)
      
      if (isAddress || isPOI || isAirport) {
        // Addresses and airports can have numbers or short codes, so just check for minimum length
        return text.trim().length >= 2 || placeName.trim().length >= 2;
      }
      
      // Filter out results that are:
      // 1. Just numbers or mostly numbers (like "745n")
      // 2. Too short (less than 2 characters)
      // 3. Only contain numbers and single letters
      // 4. Don't contain at least one letter
      
      const hasLetter = /[a-zA-Z]/.test(text);
      const isMostlyNumbers = /^\d+[a-z]?$/i.test(text.trim());
      const isTooShort = text.trim().length < 2;
      const isValidPlaceName = hasLetter && !isMostlyNumbers && !isTooShort;
      
      return isValidPlaceName;
    });

    const queryLower = query.trim().toLowerCase();
    // Detect if query looks like an address (contains numbers)
    const looksLikeAddress = /\d/.test(query.trim());
    // Detect if query looks like an airport
    const looksLikeAirport = /airport|airfield|airfield/i.test(query) || 
      /^[A-Z]{2,4}$/i.test(query.trim()) || // 2-4 letter acronyms like DFW, JFK, LAX
      /^[A-Z]{2,4}\s+airport$/i.test(query.trim()); // "DFW Airport"

    // Sort results: prioritize based on query type
    const getPriority = (feature: GeocodingFeature, isAddressQuery: boolean, isAirportQuery: boolean): number => {
      const types = feature.place_type || [];
      const isAddress = types.includes('address');
      const isPOI = types.includes('poi');
      const isAirport = isAirportFeature(feature);
      
      if (isAddressQuery) {
        // If query looks like an address, prioritize addresses (but not airports)
        if (isAirport) return 7; // Airports last for address queries
        if (isAddress) return 1;
        if (isPOI) return 2;
        if (types.includes('place')) return 3;
        if (types.includes('locality')) return 4;
        if (types.includes('neighborhood')) return 5;
        if (types.includes('district')) return 6;
        return 7;
      } else if (isAirportQuery) {
        // If query looks like an airport, prioritize airports (even if they're "place" type)
        if (isAirport) return 1; // Airports first for airport queries (regardless of type)
        // Then regular places (but airports already caught above)
        if (types.includes('place') && !isAirport) return 2;
        if (types.includes('locality')) return 3;
        if (types.includes('neighborhood')) return 4;
        if (types.includes('district')) return 5;
        if (isAddress) return 6;
        if (isPOI) return 7; // POI doesn't work in v5, but keep for compatibility
        return 8;
      } else {
        // Normal priority: places/cities first, but airports within places are prioritized
        // Check if place is actually an airport
        if (types.includes('place')) {
          return isAirport ? 1 : 2; // Airports in place type get priority 1, regular places get 2
        }
        if (types.includes('locality')) return 3;
        if (isAirport) return 4; // Airports in other types
        if (types.includes('neighborhood')) return 5;
        if (types.includes('district')) return 6;
        if (isAddress) return 7;
        if (isPOI) return 8; // POI doesn't work in v5, but keep for compatibility
        return 9;
      }
    };

    return validResults.sort((a, b) => {
      const priorityA = getPriority(a, looksLikeAddress, looksLikeAirport);
      const priorityB = getPriority(b, looksLikeAddress, looksLikeAirport);
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // If same priority, sort by relevance (higher relevance first)
      // Boost relevance for addresses when query contains numbers
      // Boost relevance for airports when query looks like an airport
      let relevanceA = a.relevance || 0;
      let relevanceB = b.relevance || 0;
      
      // Helper to check if feature is an airport
      const isAirportA = isAirportFeature(a);
      const isAirportB = isAirportFeature(b);
      
      if (looksLikeAddress) {
        const isAddressA = a.place_type?.includes('address') && !isAirportA;
        const isAddressB = b.place_type?.includes('address') && !isAirportB;
        if (isAddressA && !isAddressB) relevanceA += 1; // Boost addresses (but not airports)
        if (isAddressB && !isAddressA) relevanceB += 1; // Boost addresses (but not airports)
      }
      
      if (looksLikeAirport) {
        if (isAirportA && !isAirportB) relevanceA += 2; // Strong boost for airports
        if (isAirportB && !isAirportA) relevanceB += 2; // Strong boost for airports
      }
      
      return relevanceB - relevanceA;
    });
  }, []);

  // Debounced search for starting point
  const searchStartingPoint = useCallback(
    async (query: string) => {
      if (!query || query.trim().length < 1) {
        setStartingPointSuggestions([]);
        setShowStartingPointSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const queryLower = query.trim().toLowerCase();
        // Detect if query looks like an address (contains numbers)
        const looksLikeAddress = /\d/.test(query.trim());
        // Detect if query looks like an airport (contains "airport" or is a short acronym like "dfw", "jfk", etc.)
        const looksLikeAirport = /airport|airfield|airfield/i.test(query) || 
          /^[A-Z]{2,4}$/i.test(query.trim()) || // 2-4 letter acronyms like DFW, JFK, LAX
          /^[A-Z]{2,4}\s+airport$/i.test(query.trim()); // "DFW Airport"
        
        // Build types list - Note: POI type doesn't work in Mapbox v5 (removed as of Aug 2025)
        // Airports will come back as "place" type, so we detect them by name/keywords
        let types: string;
        if (looksLikeAddress) {
          types = "address,place,locality,neighborhood,district"; // Addresses first when numbers detected
        } else if (looksLikeAirport) {
          types = "place,locality,neighborhood,district,address"; // Places first for airport queries (airports come as "place")
        } else {
          types = "place,locality,neighborhood,district,address"; // Places first
        }
        
        // Search Supabase airports if query looks like an airport
        let supabaseAirports: GeocodingFeature[] = [];
        if (looksLikeAirport) {
          try {
            const airports = await searchAirports(query);
            supabaseAirports = airports.map(airportToGeocodingFeature);
            console.log(`✅ Found ${supabaseAirports.length} airports from Supabase for: "${query}"`);
          } catch (error) {
            console.error("❌ Error searching Supabase airports:", error);
          }
        }
        
        // Search for places, cities, and addresses
        // Note: Airports come back as "place" type in Mapbox v5 (POI type was removed)
        // We detect airports by checking their name/keywords in isAirportFeature()
        const mapboxResults = await searchPlaces(query, {
          limit: 15, // Fetch up to 15 results for scrolling
          types: types,
          country: "us", // Limit to USA only
        });
        
        // Debug: log results to see what we're getting
        if (looksLikeAirport) {
          console.log("🔍 Mapbox airport search results:", mapboxResults.map(r => ({
            text: r.text,
            place_name: r.place_name,
            place_type: r.place_type,
            category: r.properties?.category,
            maki: r.properties?.maki
          })));
        }
        
        // Merge Supabase airports with Mapbox results
        // Supabase airports get priority (they're more accurate for airport searches)
        const allResults = [...supabaseAirports, ...mapboxResults];
        
        // Filter and sort: prioritize addresses if query looks like an address, otherwise prioritize places/airports
        const validResults = filterValidSuggestions(allResults, query);
        setStartingPointSuggestions(validResults);
        setShowStartingPointSuggestions(true);
      } catch (error) {
        console.error("Error searching places:", error);
        setStartingPointSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [filterValidSuggestions]
  );

  // Debounce timer for starting point search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle starting point input change
  const handleStartingPointChange = (value: string) => {
    setStartingPoint(value);
    // Clear the selected feature if user is typing something different
    if (startingPointFeature) {
      const formattedName = formatPlaceName(startingPointFeature);
      if (value !== formattedName && value !== startingPointFeature.place_name) {
        setStartingPointFeature(null);
      }
    }

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If there's text, search immediately (will debounce)
    if (value.trim().length >= 1) {
      // Faster debounce for address-like queries (contains numbers)
      const looksLikeAddress = /\d/.test(value.trim());
      const debounceTime = looksLikeAddress ? 150 : 300; // Faster for addresses
      
      searchTimeoutRef.current = setTimeout(() => {
        searchStartingPoint(value);
      }, debounceTime);
    } else {
      // If empty, show popular locations
      setStartingPointSuggestions(POPULAR_STARTING_LOCATIONS);
      setShowStartingPointSuggestions(true);
    }
  };

  // Handle starting point focus - show popular locations or search results
  const handleStartingPointFocus = () => {
    if (startingPoint.trim().length >= 1) {
      // If there's text, search immediately
      searchStartingPoint(startingPoint);
    } else {
      // If empty, show popular US locations
      setStartingPointSuggestions(POPULAR_STARTING_LOCATIONS);
      setShowStartingPointSuggestions(true);
    }
  };

  // Handle starting point selection
  const handleSelectStartingPoint = (feature: GeocodingFeature) => {
    // Use formatted name for display, but keep full feature for coordinates
    const formattedName = formatPlaceName(feature);
    setStartingPoint(formattedName);
    setStartingPointFeature(feature);
    setStartingPointSuggestions([]);
    setShowStartingPointSuggestions(false);
  };

  // Close date picker when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        parkInputRef.current &&
        !parkInputRef.current.contains(event.target as Node)
      ) {
        setIsParkInputFocused(false);
        setShowAddPark(false);
      }
      if (
        startingPointRef.current &&
        !startingPointRef.current.contains(event.target as Node)
      ) {
        setShowStartingPointSuggestions(false);
      }
    };

    const handleScroll = (event: Event) => {
      // Only close date picker on scroll, not starting point suggestions
      // Check if scroll is happening inside the starting point dropdown
      const target = event.target as Node;
      if (startingPointRef.current?.contains(target)) {
        // Don't close if scrolling inside the dropdown
        return;
      }
      setShowDatePicker(false);
      // Don't close starting point suggestions on scroll
    };

    if (showDatePicker || showAddPark || showStartingPointSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      if (showDatePicker) {
        window.addEventListener("scroll", handleScroll, true);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [showDatePicker, showAddPark, showStartingPointSuggestions]);

  const handleRemovePark = (index: number) => {
    setTripParks(tripParks.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTripParks((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };


  const availableParks = ALL_PARKS.filter((p) => !tripParks.includes(p));

  const parkOptions = parkSearchTerm === ""
    ? availableParks.sort().slice(0, 8)
    : availableParks
        .filter((park) =>
          park.toLowerCase().includes(parkSearchTerm.toLowerCase())
        )
        .sort()
        .slice(0, 8);

  const handleAddPark = (park: string) => {
    setTripParks([...tripParks, park]);
    setParkSearchTerm("");
    setIsParkInputFocused(false);
    setShowAddPark(false);
  };

  const handleGenerateItinerary = () => {
    // TODO: Generate itinerary with all the filter data
    // For now, navigate to a placeholder itinerary page
    const params = new URLSearchParams();
    tripParks.forEach((park) => {
      params.append("parks", park);
    });
    if (startingPoint) {
      params.append("startingPoint", startingPoint);
      // Also pass coordinates if we have them
      if (startingPointFeature) {
        params.append("startingPointLng", startingPointFeature.center[0].toString());
        params.append("startingPointLat", startingPointFeature.center[1].toString());
      }
    }
    if (dateRange[0]) params.append("startDate", dateRange[0].toISOString());
    if (dateRange[1]) params.append("endDate", dateRange[1].toISOString());
    params.append("pace", tripPace);
    if (drivingTime !== "no-preference") params.append("drivingTime", drivingTime);
    if (hikingTime !== "no-preference") params.append("hikingTime", hikingTime);
    if (isFlexibleDates && flexibleSeason !== "no-preference") {
      params.append("season", flexibleSeason);
    }
    if (isFlexibleDates && flexibleDuration !== "no-preference") {
      params.append("tripDuration", flexibleDuration);
    }

    router.push(`/itinerary/new?${params.toString()}`);
  };

  const formatDateRange = () => {
    if (isFlexibleDates) {
      const seasonText = flexibleSeason !== "no-preference" 
        ? flexibleSeason.charAt(0).toUpperCase() + flexibleSeason.slice(1)
        : "";
      const durationText = flexibleDuration !== "no-preference"
        ? flexibleDuration === "weekend" ? "Weekend"
          : flexibleDuration === "short" ? "Short trip"
          : flexibleDuration === "week-long" ? "Week-long"
          : ""
        : "";
      if (seasonText || durationText) {
        return `${seasonText}${seasonText && durationText ? " • " : ""}${durationText}`;
      }
      return "Flexible dates";
    }
    if (dateRange[0] && dateRange[1]) {
      return `${dateRange[0].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${dateRange[1].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    if (!dateRange[0]) return "Select dates";
    if (!dateRange[1]) {
      return dateRange[0].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Select dates";
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
        Customize your trip
      </h1>

      {/* National Parks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
            National Parks
          </h2>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tripParks}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tripParks.map((park, index) => (
                <SortableParkItem
                  key={park}
                  park={park}
                  index={index}
                  onRemove={() => handleRemovePark(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Park Section */}
        <div className="relative" ref={parkInputRef}>
          {showAddPark && (
            <div className="mb-2 relative">
              <input
                type="text"
                value={parkSearchTerm}
                onChange={(e) => setParkSearchTerm(e.target.value)}
                onFocus={() => setIsParkInputFocused(true)}
                autoFocus
                placeholder="Search for a park..."
                className="w-full rounded-xl border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:border-secondary"
              />

              {isParkInputFocused && parkOptions.length > 0 && (
                <div className="absolute top-full mt-2 w-full rounded-xl border border-surface-divider bg-white shadow-xl overflow-hidden z-20 max-h-64 overflow-y-auto">
                  {parkOptions.map((park) => (
                    <button
                      key={park}
                      type="button"
                      onClick={() => handleAddPark(park)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="w-full px-4 py-3 text-left hover:bg-surface-divider cursor-pointer text-base border-b border-surface-divider last:border-b-0"
                    >
                      {park}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!showAddPark && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddPark(true);
                  setIsParkInputFocused(true);
                }}
                className="w-2/3 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark font-medium transition text-sm md:text-base"
              >
                + Add another park
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Starting Point Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
          Where are you starting your trip?
        </h2>
        <div className="relative" ref={startingPointRef}>
          <div className="relative">
            <input
              type="text"
              value={startingPoint}
              onChange={(e) => handleStartingPointChange(e.target.value)}
              onFocus={handleStartingPointFocus}
              placeholder="City, airport, or address (e.g., Las Vegas, SLC Airport)"
              className="w-full rounded-xl border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:border-secondary"
            />
            {isLoadingSuggestions && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>

          {showStartingPointSuggestions && startingPointSuggestions.length > 0 && (
            <div 
              className="absolute top-full mt-2 w-full rounded-xl border border-surface-divider bg-white shadow-xl overflow-hidden z-20 max-h-64 overflow-y-auto"
              onWheel={(e) => {
                // Prevent page scroll when scrolling inside dropdown
                e.stopPropagation();
                const element = e.currentTarget;
                const { scrollTop, scrollHeight, clientHeight } = element;
                const isAtTop = scrollTop === 0;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
                
                // Prevent page scroll when at boundaries
                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                  e.preventDefault();
                }
              }}
              onTouchMove={(e) => {
                // Prevent page scroll on touch devices
                const element = e.currentTarget;
                const { scrollTop, scrollHeight, clientHeight } = element;
                const isAtTop = scrollTop === 0;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
                
                if (isAtTop || isAtBottom) {
                  e.stopPropagation();
                }
              }}
              style={{ overscrollBehavior: 'contain' }}
            >
              {startingPointSuggestions.map((feature) => {
                const formattedName = formatPlaceName(feature);
                const isAddress = feature.place_type?.includes('address');
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => handleSelectStartingPoint(feature)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full px-4 py-3 text-left hover:bg-surface-divider cursor-pointer text-sm md:text-base border-b border-surface-divider last:border-b-0"
                  >
                    <div className="font-medium text-text-primary">
                      {formattedName}
                    </div>
                    {isAddress && feature.text !== feature.place_name && (
                      <div className="text-xs md:text-sm text-text-secondary mt-1">
                        {feature.place_name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dates Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
          Dates
        </h2>
        <div className="relative" ref={datePickerRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full rounded-xl border border-surface-divider px-3 py-2 pr-10 text-sm md:text-base text-left focus:outline-none focus:border-secondary bg-white"
            >
              {formatDateRange()}
            </button>
            {dateRange[0] && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDateRange([null, null]);
                  setShowDatePicker(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
                aria-label="Clear dates"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {showDatePicker && (
            <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-lg border border-surface-divider p-4">
              <DatePicker
                selected={dateRange[0]}
                onChange={(dates) => {
                  const [start, end] = dates as [Date | null, Date | null];
                  setDateRange([start, end]);
                  // Auto-save: don't close calendar automatically
                }}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                selectsRange
                monthsShown={2}
                minDate={minDate}
                maxDate={maxDate}
                inline
                calendarClassName="airbnb-calendar"
                className="airbnb-calendar-wrapper"
                shouldCloseOnSelect={false}
              />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setIsFlexibleDates(!isFlexibleDates);
              if (!isFlexibleDates) {
                // Reset flexible options when opening
                setFlexibleSeason("no-preference");
                setFlexibleDuration("no-preference");
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
              isFlexibleDates
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-surface-divider text-text-primary hover:bg-surface-background"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm md:text-base font-medium">
              I&apos;m flexible
            </span>
          </button>
          
          {isFlexibleDates && (
            <div className="space-y-6 pt-2 border-t border-surface-divider">
              <div>
                <label className="block text-sm md:text-base text-text-primary mb-3">
                  When are you planning to go?
                </label>
                <div className="space-y-2 pr-2">
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleSeason"
                      value="no-preference"
                      checked={flexibleSeason === "no-preference"}
                      onChange={(e) => setFlexibleSeason(e.target.value as typeof flexibleSeason)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">No preference</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleSeason"
                      value="spring"
                      checked={flexibleSeason === "spring"}
                      onChange={(e) => setFlexibleSeason(e.target.value as typeof flexibleSeason)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">Spring (Mar–May)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleSeason"
                      value="summer"
                      checked={flexibleSeason === "summer"}
                      onChange={(e) => setFlexibleSeason(e.target.value as typeof flexibleSeason)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">Summer (Jun–Aug)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleSeason"
                      value="fall"
                      checked={flexibleSeason === "fall"}
                      onChange={(e) => setFlexibleSeason(e.target.value as typeof flexibleSeason)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">Fall (Sep–Nov)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleSeason"
                      value="winter"
                      checked={flexibleSeason === "winter"}
                      onChange={(e) => setFlexibleSeason(e.target.value as typeof flexibleSeason)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">Winter (Dec–Feb)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm md:text-base text-text-primary mb-3">
                  How long is your trip?
                </label>
                <div className="space-y-2 pr-2">
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleDuration"
                      value="no-preference"
                      checked={flexibleDuration === "no-preference"}
                      onChange={(e) => setFlexibleDuration(e.target.value as typeof flexibleDuration)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">No preference</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleDuration"
                      value="weekend"
                      checked={flexibleDuration === "weekend"}
                      onChange={(e) => setFlexibleDuration(e.target.value as typeof flexibleDuration)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">Weekend (2–3 days)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleDuration"
                      value="short"
                      checked={flexibleDuration === "short"}
                      onChange={(e) => setFlexibleDuration(e.target.value as typeof flexibleDuration)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">Short trip (4–6 days)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                    <input
                      type="radio"
                      name="flexibleDuration"
                      value="week-long"
                      checked={flexibleDuration === "week-long"}
                      onChange={(e) => setFlexibleDuration(e.target.value as typeof flexibleDuration)}
                      className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm md:text-base text-text-primary">Week-long (7–9 days)</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trip Pace Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
          Trip Pace
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTripPace("relaxed")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm md:text-base font-medium transition ${
              tripPace === "relaxed"
                ? "bg-primary text-white"
                : "bg-surface-background text-text-primary hover:bg-surface-divider"
            }`}
          >
            Relaxed
            <span className="block text-xs mt-1 opacity-80">
              1–2 activities per day
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTripPace("balanced")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm md:text-base font-medium transition ${
              tripPace === "balanced"
                ? "bg-primary text-white"
                : "bg-surface-background text-text-primary hover:bg-surface-divider"
            }`}
          >
            Balanced
            <span className="block text-xs mt-1 opacity-80">
              2–3 activities per day
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTripPace("packed")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm md:text-base font-medium transition ${
              tripPace === "packed"
                ? "bg-primary text-white"
                : "bg-surface-background text-text-primary hover:bg-surface-divider"
            }`}
          >
            Packed
            <span className="block text-xs mt-1 opacity-80">
              3–5 activities per day
            </span>
          </button>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
          Preferences
        </h2>
        <div className="space-y-6 pr-2">
          <div>
            <label className="block text-sm md:text-base text-text-primary mb-3">
              Driving time per day:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="drivingTime"
                  value="no-preference"
                  checked={drivingTime === "no-preference"}
                  onChange={(e) => setDrivingTime(e.target.value as typeof drivingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">no preference</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="drivingTime"
                  value="<2"
                  checked={drivingTime === "<2"}
                  onChange={(e) => setDrivingTime(e.target.value as typeof drivingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">&lt; 2 hours/day</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="drivingTime"
                  value="2-4"
                  checked={drivingTime === "2-4"}
                  onChange={(e) => setDrivingTime(e.target.value as typeof drivingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">2–4 hours/day <span className="text-text-secondary">(recommended)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="drivingTime"
                  value="4+"
                  checked={drivingTime === "4+"}
                  onChange={(e) => setDrivingTime(e.target.value as typeof drivingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">4+ hours/day</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm md:text-base text-text-primary mb-3">
              Hiking time:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="hikingTime"
                  value="no-preference"
                  checked={hikingTime === "no-preference"}
                  onChange={(e) => setHikingTime(e.target.value as typeof hikingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">no preference</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="hikingTime"
                  value="0-1"
                  checked={hikingTime === "0-1"}
                  onChange={(e) => setHikingTime(e.target.value as typeof hikingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">0-1 hrs/day</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="hikingTime"
                  value="1-3"
                  checked={hikingTime === "1-3"}
                  onChange={(e) => setHikingTime(e.target.value as typeof hikingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">1–3 hrs/day</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="hikingTime"
                  value="4-6"
                  checked={hikingTime === "4-6"}
                  onChange={(e) => setHikingTime(e.target.value as typeof hikingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">4–6 hrs/day</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group overflow-visible">
                <input
                  type="radio"
                  name="hikingTime"
                  value="all-day"
                  checked={hikingTime === "all-day"}
                  onChange={(e) => setHikingTime(e.target.value as typeof hikingTime)}
                  className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                />
                <span className="text-sm md:text-base text-text-primary">All-Day</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Generate Itinerary Button */}
      <div className="flex justify-center pt-8">
        <button
          type="button"
          onClick={handleGenerateItinerary}
          disabled={tripParks.length === 0}
          className="rounded-xl bg-primary text-white px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold hover:bg-primary-dark transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Itinerary
        </button>
      </div>
    </div>
  );
}

export default function FiltersPage() {
  return (
    <Suspense fallback={<div className="space-y-8">Loading...</div>}>
      <FiltersContent />
    </Suspense>
  );
}
