"use client";

import { useEffect, useRef, useState } from "react";

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

// Mock coordinates for parks
const PARK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Yellowstone National Park": { lat: 44.4280, lng: -110.5885 },
  "Grand Teton National Park": { lat: 43.7904, lng: -110.6818 },
  "Grand Canyon National Park": { lat: 36.1069, lng: -112.1129 },
  "Zion National Park": { lat: 37.2982, lng: -113.0263 },
  "Bryce Canyon National Park": { lat: 37.5930, lng: -112.1871 },
};

// Mock coordinates for activities (relative to parks)
const getActivityCoordinates = (
  parkName: string,
  activityIndex: number
): { lat: number; lng: number } => {
  const parkCoords = PARK_COORDINATES[parkName] || { lat: 44.4280, lng: -110.5885 };
  // Add small offset for each activity
  return {
    lat: parkCoords.lat + (activityIndex * 0.01),
    lng: parkCoords.lng + (activityIndex * 0.01),
  };
};

export default function MapPanel({
  parks,
  activities,
  selectedDay,
  onParkClick,
  onActivityHover,
}: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);

  // Calculate map center from parks and activities
  const getMapCenter = () => {
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
  };

  const center = getMapCenter();

  // Filter activities by selected day
  const visibleActivities = selectedDay
    ? activities.filter((a) => a.day === selectedDay)
    : activities;

  // Filter parks by selected day
  const visibleParks = selectedDay
    ? parks.filter((p) => p.day === selectedDay || !p.isSelected)
    : parks;

  const handleParkMarkerClick = (parkId: string) => {
    if (onParkClick) {
      onParkClick(parkId);
    }
  };

  const handleActivityHover = (activityId: string | null) => {
    setHoveredActivity(activityId);
    if (onActivityHover) {
      onActivityHover(activityId);
    }
  };

  return (
    <div className="w-full lg:w-[40%] h-[400px] lg:h-[600px] rounded-xl border border-surface-divider bg-surface-background relative overflow-hidden">
      {/* Placeholder for Google Maps */}
      <div
        ref={mapRef}
        className="w-full h-full bg-surface-background relative"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #E9ECEF 0%, #F6F6F6 50%, #E9ECEF 100%)",
        }}
      >
        {/* Map placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-4xl">🗺️</div>
            <p className="text-sm text-text-secondary">Google Maps will load here</p>
            <p className="text-xs text-text-secondary">
              {parks.length} parks, {activities.length} activities
            </p>
          </div>
        </div>

        {/* Mock markers overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Park markers */}
          {visibleParks.map((park) => {
            const isSelected = park.isSelected;
            const isHighlighted = selectedDay
              ? park.day === selectedDay
              : true;

            // Calculate position (mock - would use actual map projection)
            const x = 50 + (park.lng + 110) * 2;
            const y = 50 + (park.lat - 44) * 2;

            return (
              <div
                key={park.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${Math.min(Math.max(x, 5), 95)}%`,
                  top: `${Math.min(Math.max(y, 5), 95)}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => handleParkMarkerClick(park.id)}
                title={park.name + (park.day ? ` - Day ${park.day}` : "")}
              >
                <div
                  className={`flex items-center justify-center rounded-full transition-all ${
                    isSelected && isHighlighted
                      ? "bg-brand-primary text-white shadow-lg"
                      : "bg-gray-400 text-white opacity-50"
                  }`}
                  style={{
                    width: isSelected ? "20px" : "14px",
                    height: isSelected ? "20px" : "14px",
                    fontSize: isSelected ? "12px" : "10px",
                  }}
                >
                  🌲
                </div>
                {isSelected && park.day && (
                  <div className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {park.day}
                  </div>
                )}
              </div>
            );
          })}

          {/* Activity markers */}
          {visibleActivities.map((activity, index) => {
            const isHovered = hoveredActivity === activity.id;
            const isHighlighted = selectedDay
              ? activity.day === selectedDay
              : true;

            // Calculate position (mock - would use actual map projection)
            const x = 50 + (activity.lng + 110) * 2;
            const y = 50 + (activity.lat - 44) * 2;

            return (
              <div
                key={activity.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${Math.min(Math.max(x, 5), 95)}%`,
                  top: `${Math.min(Math.max(y, 5), 95)}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => handleActivityHover(activity.id)}
                onMouseLeave={() => handleActivityHover(null)}
                title={activity.name}
              >
                <div
                  className={`flex items-center justify-center rounded-full transition-all ${
                    isHovered || isHighlighted
                      ? "bg-blue-500 text-white shadow-md scale-110"
                      : "bg-gray-500 text-white opacity-70"
                  }`}
                  style={{
                    width: isHovered ? "16px" : "12px",
                    height: isHovered ? "16px" : "12px",
                    fontSize: "8px",
                  }}
                >
                  📍
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

