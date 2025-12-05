"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import type { Map, Marker } from "mapbox-gl";
import { calculateRouteBetweenParks } from "@/lib/services/mapboxDirections";

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

interface MapPanelProps {
  parks: ParkMarker[];
  activities: ActivityMarker[];
  selectedDay?: number | null;
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

export default function MapPanel({
  parks,
  activities,
  selectedDay,
  onParkClick,
  onActivityHover,
}: MapPanelProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const routeLayerRef = useRef<string | null>(null);
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Calculate map center from parks and activities
  const mapCenter = useMemo(() => {
    if (parks.length === 0 && activities.length === 0) {
      return { lat: 44.4280, lng: -110.5885 }; // Default to Yellowstone
    }

    const allCoords = [
      ...parks.map((p) => ({ lat: p.lat, lng: p.lng })),
      ...activities.map((a) => ({ lat: a.lat, lng: a.lng })),
    ];

    const avgLat =
      allCoords.reduce((sum, c) => sum + c.lat, 0) / allCoords.length;
    const avgLng =
      allCoords.reduce((sum, c) => sum + c.lng, 0) / allCoords.length;

    return { lat: avgLat, lng: avgLng };
  }, [parks, activities]);

  // Filter activities by selected day
  const visibleActivities = useMemo(() => {
    return selectedDay
      ? activities.filter((a) => a.day === selectedDay)
      : activities;
  }, [activities, selectedDay]);

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

    // Add park markers
    visibleParks.forEach((park) => {
      const isSelected = park.isSelected;
      const isHighlighted = selectedDay
        ? park.day === selectedDay
        : true;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "park-marker";
      el.style.width = isSelected ? "24px" : "18px";
      el.style.height = isSelected ? "24px" : "18px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = isSelected && isHighlighted ? "#1D3B2A" : "#9CA3AF";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.fontSize = "12px";
      el.title = park.name + (park.day ? ` - Day ${park.day}` : "");

      const marker = new mapboxgl.Marker(el)
        .setLngLat([park.lng, park.lat])
        .addTo(map);

      el.addEventListener("click", () => {
        if (onParkClick) {
          onParkClick(park.id);
        }
      });

      markersRef.current.push(marker);

      // Add day badge if selected
      if (isSelected && park.day) {
        const badge = document.createElement("div");
        badge.textContent = park.day.toString();
        badge.style.position = "absolute";
        badge.style.top = "-8px";
        badge.style.right = "-8px";
        badge.style.width = "20px";
        badge.style.height = "20px";
        badge.style.borderRadius = "50%";
        badge.style.backgroundColor = "#1D3B2A";
        badge.style.color = "white";
        badge.style.fontSize = "10px";
        badge.style.fontWeight = "bold";
        badge.style.display = "flex";
        badge.style.alignItems = "center";
        badge.style.justifyContent = "center";
        badge.style.border = "2px solid white";
        badge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
        el.appendChild(badge);
      }
    });

    // Add activity markers
    visibleActivities.forEach((activity) => {
      const isHovered = hoveredActivity === activity.id;
      const isHighlighted = selectedDay
        ? activity.day === selectedDay
        : true;

      const el = document.createElement("div");
      el.className = "activity-marker";
      el.style.width = isHovered ? "20px" : "16px";
      el.style.height = isHovered ? "20px" : "16px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = isHovered || isHighlighted ? "#3B82F6" : "#6B7280";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      el.style.transition = "all 0.2s";
      el.title = activity.name;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([activity.lng, activity.lat])
        .addTo(map);

      el.addEventListener("mouseenter", () => {
        setHoveredActivity(activity.id);
        if (onActivityHover) {
          onActivityHover(activity.id);
        }
      });

      el.addEventListener("mouseleave", () => {
        setHoveredActivity(null);
        if (onActivityHover) {
          onActivityHover(null);
        }
      });

      markersRef.current.push(marker);
    });
  }, [visibleParks, visibleActivities, hoveredActivity, selectedDay, mapLoaded, onParkClick, onActivityHover]);

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
            "line-color": "#1D3B2A",
            "line-width": 4,
            "line-opacity": 0.7,
          },
        });
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

  // Handle resize
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const handleResize = () => {
      mapRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
