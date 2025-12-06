"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import type { Map, Marker } from "mapbox-gl";
import { calculateRouteBetweenParks } from "@/lib/services/mapboxDirections";

// SVG icon for national park markers
const createParkMarkerIcon = (isSelected: boolean): string => {
  const size = isSelected ? 56 : 52;
  const viewBoxSize = 32;
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer; display: block;">
      <!-- Outer pin -->
      <path
        d="M16 2.5C11.3 2.5 7.5 6.3 7.5 11C7.5 15.2 10.1 19.9 13.4 23.6C14.3 24.6 15.1 25.4 15.5 25.8C15.7 26 15.9 26.1 16.1 26.1C16.3 26.1 16.5 26 16.7 25.8C17.1 25.4 17.9 24.6 18.8 23.6C22.1 19.9 24.7 15.2 24.7 11C24.5 6.3 20.7 2.5 16 2.5Z"
        fill="#1F7A4D"
      />
      <!-- Inner circle background -->
      <circle
        cx="16"
        cy="11.2"
        r="6.4"
        fill="#FFFFFF"
      />
      <!-- Tree trunk -->
      <rect
        x="15.25"
        y="11.6"
        width="1.5"
        height="4.2"
        rx="0.6"
        fill="#5B4636"
      />
      <!-- Tree canopy (stylized evergreen) -->
      <!-- Top triangle -->
      <path
        d="M16 5.8L13.6 9.0H18.4L16 5.8Z"
        fill="#2F8F5F"
      />
      <!-- Middle triangle -->
      <path
        d="M16 7.8L12.8 11.4H19.2L16 7.8Z"
        fill="#2F8F5F"
      />
      <!-- Bottom triangle -->
      <path
        d="M16 9.8L12.2 13.9H19.8L16 9.8Z"
        fill="#2F8F5F"
      />
      <!-- Small base shadow for stability -->
      <ellipse
        cx="16"
        cy="27.2"
        rx="4.4"
        ry="1.4"
        fill="rgba(0,0,0,0.12)"
      />
    </svg>
  `;
};

export interface ParkMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isSelected: boolean;
  day?: number;
}

export interface ActivityMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  day: number;
  park?: string;
  type: "hike" | "viewpoint" | "poi" | "other";
}

interface StartingPoint {
  name: string;
  lat: number;
  lng: number;
}

interface MapPanelProps {
  parks: ParkMarker[];
  activities: ActivityMarker[];
  selectedDay?: number | null;
  startingPoint?: StartingPoint | null;
  onParkClick?: (parkId: string) => void;
  onActivityHover?: (activityId: string | null) => void;
}

// Mock coordinates for parks (used as fallback)
const PARK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Yellowstone National Park": { lat: 44.4280, lng: -110.5885 },
  "Grand Teton National Park": { lat: 43.7904, lng: -110.6818 },
  "Grand Canyon National Park": { lat: 36.1069, lng: -112.1129 },
  "Zion National Park": { lat: 37.2982, lng: -113.0263 },
  "Bryce Canyon National Park": { lat: 37.5930, lng: -112.1871 },
  "Rocky Mountain National Park": { lat: 40.3428, lng: -105.6836 },
  "Glacier National Park": { lat: 48.7596, lng: -113.7870 },
  "Acadia National Park": { lat: 44.3386, lng: -68.2733 },
  "Arches National Park": { lat: 38.7331, lng: -109.5925 },
  "Canyonlands National Park": { lat: 38.2490, lng: -109.8808 },
  "Capitol Reef National Park": { lat: 38.3670, lng: -111.2615 },
  "Great Smoky Mountains National Park": { lat: 35.6118, lng: -83.4895 },
  "Olympic National Park": { lat: 47.8021, lng: -123.6044 },
  "Sequoia National Park": { lat: 36.4864, lng: -118.5658 },
  "Kings Canyon National Park": { lat: 36.8879, lng: -118.5551 },
};

// SVG icon for starting point marker
const createStartingPointIcon = (): string => {
  const size = 48;
  const viewBoxSize = 32;
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer; display: block;">
      <!-- Outer pin -->
      <path
        d="M16 2.5C11.3 2.5 7.5 6.3 7.5 11C7.5 15.2 10.1 19.9 13.4 23.6C14.3 24.6 15.1 25.4 15.5 25.8C15.7 26 15.9 26.1 16.1 26.1C16.3 26.1 16.5 26 16.7 25.8C17.1 25.4 17.9 24.6 18.8 23.6C22.1 19.9 24.7 15.2 24.7 11C24.5 6.3 20.7 2.5 16 2.5Z"
        fill="#4285F4"
      />
      <!-- Inner circle background -->
      <circle
        cx="16"
        cy="11.2"
        r="6.4"
        fill="#FFFFFF"
      />
      <!-- Location pin icon -->
      <path
        d="M16 6.5C13.5 6.5 11.5 8.5 11.5 11C11.5 13.5 13.5 15.5 16 15.5C18.5 15.5 20.5 13.5 20.5 11C20.5 8.5 18.5 6.5 16 6.5ZM16 14C14.6 14 13.5 12.9 13.5 11.5C13.5 10.1 14.6 9 16 9C17.4 9 18.5 10.1 18.5 11.5C18.5 12.9 17.4 14 16 14Z"
        fill="#4285F4"
      />
      <circle
        cx="16"
        cy="11"
        r="2"
        fill="#4285F4"
      />
      <!-- Small base shadow for stability -->
      <ellipse
        cx="16"
        cy="27.2"
        rx="4.4"
        ry="1.4"
        fill="rgba(0,0,0,0.12)"
      />
    </svg>
  `;
};

export default function MapPanel({
  parks,
  activities,
  selectedDay,
  startingPoint,
  onParkClick,
  onActivityHover,
}: MapPanelProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const startingPointMarkerRef = useRef<Marker | null>(null);
  const routeLayerRef = useRef<string | null>(null);
  const startingPointRouteLayerRef = useRef<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Calculate map center from parks, activities, and starting point
  const mapCenter = useMemo(() => {
    const allCoords = [
      ...(startingPoint ? [{ lat: startingPoint.lat, lng: startingPoint.lng }] : []),
      ...parks.map((p) => ({ lat: p.lat, lng: p.lng })),
      ...activities.map((a) => ({ lat: a.lat, lng: a.lng })),
    ];

    if (allCoords.length === 0) {
      return { lat: 44.4280, lng: -110.5885 }; // Default to Yellowstone
    }

    const avgLat =
      allCoords.reduce((sum, c) => sum + c.lat, 0) / allCoords.length;
    const avgLng =
      allCoords.reduce((sum, c) => sum + c.lng, 0) / allCoords.length;

    return { lat: avgLat, lng: avgLng };
  }, [parks, activities, startingPoint]);

  // Activity markers are not displayed on the map

  // Filter parks by selected day
  const visibleParks = useMemo(() => {
    return selectedDay
      ? parks.filter((p) => p.day === selectedDay || !p.isSelected)
      : parks;
  }, [parks, selectedDay]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;
    if (!token) {
      console.error("NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN is not set");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 6,
    });

    map.on("load", () => {
      setMapLoaded(true);
    });

    map.on("error", (e) => {
      console.error("Mapbox error:", e);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map center when parks/activities change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    mapRef.current.flyTo({
      center: [mapCenter.lng, mapCenter.lat],
      zoom: mapRef.current.getZoom(),
      duration: 1000,
    });
  }, [mapCenter, mapLoaded]);

  // Add/update markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    
    // Clear starting point marker
    if (startingPointMarkerRef.current) {
      startingPointMarkerRef.current.remove();
      startingPointMarkerRef.current = null;
    }

    // Add starting point marker
    if (startingPoint) {
      const el = document.createElement("div");
      el.className = "starting-point-marker";
      el.style.width = "48px";
      el.style.height = "48px";
      el.style.cursor = "pointer";
      el.style.position = "relative";
      el.title = startingPoint.name;
      el.innerHTML = createStartingPointIcon();

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([startingPoint.lng, startingPoint.lat])
        .addTo(map);

      startingPointMarkerRef.current = marker;
    }

    // Add park markers
    visibleParks.forEach((park) => {
      const isSelected = park.isSelected;
      const isHighlighted = selectedDay
        ? park.day === selectedDay
        : true;

      // Create custom marker element with SVG icon
      const el = document.createElement("div");
      el.className = "park-marker";
      el.style.width = isSelected ? "56px" : "52px";
      el.style.height = isSelected ? "56px" : "52px";
      el.style.cursor = "pointer";
      el.style.position = "relative";
      el.title = park.name + (park.day ? ` - Day ${park.day}` : "");
      
      // Insert SVG icon
      el.innerHTML = createParkMarkerIcon(isSelected && isHighlighted);

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([park.lng, park.lat])
        .addTo(map);

      el.addEventListener("click", () => {
        if (onParkClick) {
          onParkClick(park.id);
        }
      });

      markersRef.current.push(marker);
    });

    // Activity markers removed - not displaying on map
  }, [visibleParks, selectedDay, startingPoint, mapLoaded, onParkClick]);

  // Calculate and display route from starting point to first park
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !startingPoint) return;

    const map = mapRef.current;
    const selectedParks = visibleParks.filter((p) => p.isSelected);

    // Remove existing starting point route layer
    if (startingPointRouteLayerRef.current && map.getLayer(startingPointRouteLayerRef.current)) {
      map.removeLayer(startingPointRouteLayerRef.current);
    }
    if (startingPointRouteLayerRef.current && map.getSource(startingPointRouteLayerRef.current)) {
      map.removeSource(startingPointRouteLayerRef.current);
    }

    // Only show route from starting point to first park if we have at least one park
    if (selectedParks.length < 1) {
      startingPointRouteLayerRef.current = null;
      return;
    }

    const firstPark = selectedParks[0];
    const waypoints = [
      { lat: startingPoint.lat, lng: startingPoint.lng },
      { lat: firstPark.lat, lng: firstPark.lng },
    ];

    calculateRouteBetweenParks(waypoints).then((route) => {
      if (!route || !mapRef.current) return;

      const sourceId = "starting-point-route-source";
      const layerId = "starting-point-route-layer";

      // Add route source
      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.coordinates,
          },
        });
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route.coordinates,
            },
          },
        });
      }

      // Add route layer
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#4285F4",
            "line-width": 4,
            "line-opacity": 0.6,
            "line-dasharray": [2, 2],
          },
        });
      } else {
        map.setPaintProperty(layerId, "line-color", "#4285F4");
        map.setPaintProperty(layerId, "line-opacity", 0.6);
      }

      startingPointRouteLayerRef.current = layerId;
    });
  }, [startingPoint, visibleParks, mapLoaded]);

  // Calculate and display route between parks
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current;
    const selectedParks = visibleParks.filter((p) => p.isSelected);

    // Remove existing route layer
    if (routeLayerRef.current && map.getLayer(routeLayerRef.current)) {
      map.removeLayer(routeLayerRef.current);
    }
    if (routeLayerRef.current && map.getSource(routeLayerRef.current)) {
      map.removeSource(routeLayerRef.current);
    }

    // Only show route if we have 2+ selected parks
    if (selectedParks.length < 2) {
      routeLayerRef.current = null;
      return;
    }

    // Calculate route
    calculateRouteBetweenParks(
      selectedParks.map((p) => ({ lat: p.lat, lng: p.lng }))
    ).then((route) => {
      if (!route || !mapRef.current) return;

      const sourceId = "route-source";
      const layerId = "route-layer";

      // Add route source
      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.coordinates,
          },
        });
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route.coordinates,
            },
          },
        });
      }

      // Add route layer
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#4285F4",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });
      } else {
        // Update paint properties if layer already exists to ensure blue color
        map.setPaintProperty(layerId, "line-color", "#4285F4");
        map.setPaintProperty(layerId, "line-opacity", 0.8);
      }

      routeLayerRef.current = layerId;

      // Fit map to route bounds
      const coordinates = route.coordinates;
      const bounds = coordinates.reduce(
        (bounds, coord) => {
          return bounds.extend([coord[0], coord[1]]);
        },
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );

      map.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });
    });
  }, [visibleParks, mapLoaded]);

  // Handle resize - both window and container size changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !mapContainerRef.current) return;

    const handleResize = () => {
      mapRef.current?.resize();
    };

    // Listen to window resize
    window.addEventListener("resize", handleResize);

    // Use ResizeObserver to detect container size changes (e.g., when drawer opens/closes)
    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to ensure resize happens after layout update
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mapRef.current?.resize();
        });
      });
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [mapLoaded]);

  return (
    <div className="w-full h-full bg-surface-background relative overflow-hidden">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
