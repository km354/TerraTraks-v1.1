"use client";

import { useState, useMemo, useEffect } from "react";
import { getHikingTrailsByParkCode, getAllHikingTrails } from "@/lib/services/hikingTrails";
import { getParkCodeFromName } from "@/lib/services/nationalParks";
import type { HikingTrail } from "@/lib/types/hikingTrails";

export interface Activity {
  id: string;
  title: string;
  tagline: string;
  difficulty: "easy" | "moderate" | "hard";
  type: "hike" | "viewpoint" | "scenic-drive" | "activity";
  requiresPermit: boolean;
  requiresShuttle: boolean;
  linkUrl?: string;
  permitUrl?: string;
}

interface AddActivityDrawerProps {
  isOpen: boolean;
  selectedDay: number | null;
  availableDays: number[];
  parks: string[];
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
  onDayChange: (day: number | null) => void;
}

const TYPE_LABELS: Record<Activity["type"], string> = {
  hike: "Hikes",
  viewpoint: "Viewpoints",
  "scenic-drive": "Scenic Drives",
  activity: "Activities",
};

export default function AddActivityDrawer({
  isOpen,
  selectedDay,
  availableDays,
  parks,
  onClose,
  onAddActivity,
  onDayChange,
}: AddActivityDrawerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hikingTrails, setHikingTrails] = useState<HikingTrail[]>([]);
  const [isLoadingTrails, setIsLoadingTrails] = useState(false);
  const [difficulty, setDifficulty] = useState<{
    easy: boolean;
    moderate: boolean;
    hard: boolean;
  }>({
    easy: false,
    moderate: false,
    hard: false,
  });
  const [type, setType] = useState<{
    hike: boolean;
    viewpoint: boolean;
    "scenic-drive": boolean;
    activity: boolean;
  }>({
    hike: false,
    viewpoint: false,
    "scenic-drive": false,
    activity: false,
  });
  const [requiresPermit, setRequiresPermit] = useState(false);
  const [requiresShuttle, setRequiresShuttle] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customActivityName, setCustomActivityName] = useState("");
  const [customActivityType, setCustomActivityType] = useState<Activity["type"]>("activity");
  const [customLinkUrl, setCustomLinkUrl] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [customTime, setCustomTime] = useState("");

  // Fetch hiking trails from Supabase when parks change
  useEffect(() => {
    const fetchHikingTrails = async () => {
      if (parks.length === 0) {
        setHikingTrails([]);
        return;
      }

      setIsLoadingTrails(true);
      try {
        // First, test if database has ANY data
        const allTrailsTest = await getAllHikingTrails();
        console.log("🧪 TEST: Total hikes in database:", allTrailsTest.length);
        if (allTrailsTest.length > 0) {
          console.log("🧪 TEST: Sample hike:", allTrailsTest[0]);
          console.log("🧪 TEST: Sample park_code:", allTrailsTest[0].park_code);
          console.log("🧪 TEST: Sample park_name:", allTrailsTest[0].park_name);
        }
        
        // Convert park names to park codes for more reliable querying
        const parkCodes = parks.map((parkName) => getParkCodeFromName(parkName));
        console.log("🔍 Fetching hikes for parks:", parks);
        console.log("🔍 Converted to park codes:", parkCodes);
        
        // Try park code first
        let trails = await getHikingTrailsByParkCode(parkCodes);
        console.log("✅ Fetched trails by park code:", trails.length);
        
        // If no results, try by park name as fallback
        if (trails.length === 0) {
          console.log("⚠️ No results by park code, trying park name...");
          const { getHikingTrailsByParkName } = await import("@/lib/services/hikingTrails");
          trails = await getHikingTrailsByParkName(parks);
          console.log("✅ Fetched trails by park name:", trails.length);
        }
        
        // If still no results, show all trails for debugging
        if (trails.length === 0 && allTrailsTest.length > 0) {
          console.log("⚠️ No matches found, but database has data. Showing all trails for debugging.");
          trails = allTrailsTest;
        }
        
        console.log("✅ Final trails:", trails.length, trails);
        setHikingTrails(trails);
      } catch (error) {
        console.error("❌ Error fetching hiking trails:", error);
        setHikingTrails([]);
      } finally {
        setIsLoadingTrails(false);
      }
    };

    if (isOpen) {
      fetchHikingTrails();
    }
  }, [parks, isOpen]);

  // Convert hiking trails to Activity format
  const hikingTrailActivities: Activity[] = useMemo(() => {
    const activities = hikingTrails.map((trail) => {
      // Map difficulty: "strenuous" -> "hard"
      const mappedDifficulty: "easy" | "moderate" | "hard" =
        trail.difficulty === "strenuous" ? "hard" : trail.difficulty;

      return {
        id: `trail-${trail.id}`,
        title: trail.hike_name,
        tagline: `${trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)} • ${trail.park_name}`,
        difficulty: mappedDifficulty,
        type: "hike" as const,
        requiresPermit: trail.permit_required,
        requiresShuttle: false, // Hiking trails don't have shuttle info in DB
        linkUrl: trail.hike_url,
        permitUrl: trail.permit_url || undefined,
      };
    });
    console.log("🔄 Converted to activities:", activities.length, activities);
    return activities;
  }, [hikingTrails]);

  // Use only hikes from Supabase - no mock activities
  const allActivities = useMemo(() => {
    console.log("📋 All activities (before filtering):", hikingTrailActivities.length);
    return hikingTrailActivities;
  }, [hikingTrailActivities]);

  const filteredActivities = useMemo(() => {
    let filtered = allActivities;
    console.log("🔍 Starting filter with", filtered.length, "activities");
    console.log("🔍 Filters - search:", searchTerm, "difficulty:", difficulty, "type:", type, "permit:", requiresPermit, "shuttle:", requiresShuttle);

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchLower) ||
          activity.tagline.toLowerCase().includes(searchLower)
      );
      console.log("🔍 After search filter:", filtered.length);
    }

    // Difficulty filter
    const hasDifficultyFilter =
      difficulty.easy || difficulty.moderate || difficulty.hard;
    if (hasDifficultyFilter) {
      filtered = filtered.filter((activity) => {
        if (difficulty.easy && activity.difficulty === "easy") return true;
        if (difficulty.moderate && activity.difficulty === "moderate")
          return true;
        if (difficulty.hard && activity.difficulty === "hard") return true;
        return false;
      });
      console.log("🔍 After difficulty filter:", filtered.length);
    }

    // Type filter
    const hasTypeFilter =
      type.hike || type.viewpoint || type["scenic-drive"] || type.activity;
    if (hasTypeFilter) {
      filtered = filtered.filter((activity) => {
        if (type.hike && activity.type === "hike") return true;
        if (type.viewpoint && activity.type === "viewpoint") return true;
        if (type["scenic-drive"] && activity.type === "scenic-drive")
          return true;
        if (type.activity && activity.type === "activity") return true;
        return false;
      });
      console.log("🔍 After type filter:", filtered.length);
    }

    // Permit filter
    if (requiresPermit) {
      filtered = filtered.filter((activity) => activity.requiresPermit);
      console.log("🔍 After permit filter:", filtered.length);
    }

    // Shuttle filter
    if (requiresShuttle) {
      filtered = filtered.filter((activity) => activity.requiresShuttle);
      console.log("🔍 After shuttle filter:", filtered.length);
    }

    console.log("✅ Final filtered activities:", filtered.length);
    return filtered;
  }, [allActivities, searchTerm, difficulty, type, requiresPermit, requiresShuttle]);

  const handleDifficultyToggle = (level: "easy" | "moderate" | "hard") => {
    setDifficulty((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const handleTypeToggle = (
    activityType: "hike" | "viewpoint" | "scenic-drive" | "activity"
  ) => {
    setType((prev) => ({
      ...prev,
      [activityType]: !prev[activityType],
    }));
  };

  const handleAddActivity = (activity: Activity) => {
    onAddActivity(activity);
  };

  const handleSaveCustomActivity = () => {
    if (!customActivityName.trim()) {
      return; // Don't save if name is empty
    }

    const customActivity: Activity = {
      id: `custom-${Date.now()}`,
      title: customActivityName,
      tagline: customActivityType.charAt(0).toUpperCase() + customActivityType.slice(1),
      difficulty: "moderate", // Default difficulty
      type: customActivityType,
      requiresPermit: false,
      requiresShuttle: false,
      linkUrl: customLinkUrl || undefined,
    };

    onAddActivity(customActivity);
    
    // Reset form
    setCustomActivityName("");
    setCustomActivityType("activity");
    setCustomLinkUrl("");
    setCustomDuration("");
    setCustomTime("");
    setShowCustomForm(false);
  };

  const handleCancelCustomActivity = () => {
    setCustomActivityName("");
    setCustomActivityType("activity");
    setCustomLinkUrl("");
    setCustomDuration("");
    setCustomTime("");
    setShowCustomForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-surface-divider flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-text-primary">
            Add activities
          </h2>
          <div className="relative">
            <select
              value={selectedDay || "all"}
              onChange={(e) => {
                const value = e.target.value;
                onDayChange(value === "all" ? null : parseInt(value, 10));
              }}
              className="appearance-none rounded-lg border border-surface-divider px-3 py-2 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
              style={{ maxHeight: "120px" }}
            >
              <option value="all">All days</option>
              {availableDays.map((day) => (
                <option key={day} value={day.toString()}>
                  Day {day}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-gray-900 text-xl font-semibold flex-shrink-0"
          aria-label="Close drawer"
        >
          ×
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Filters */}
          <div className="space-y-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm md:text-base font-medium text-text-primary mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {(["easy", "moderate", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleDifficultyToggle(level)}
                    className={`px-3 py-1.5 rounded-full text-sm md:text-base font-medium transition ${
                      difficulty[level]
                        ? "bg-primary text-white"
                        : "bg-surface-background text-text-primary hover:bg-surface-divider"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm md:text-base font-medium text-text-primary mb-2">
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  ["hike", "viewpoint", "scenic-drive", "activity"] as const
                ).map((activityType) => (
                  <button
                    key={activityType}
                    type="button"
                    onClick={() => handleTypeToggle(activityType)}
                    className={`px-3 py-1.5 rounded-full text-sm md:text-base font-medium transition ${
                      type[activityType]
                        ? "bg-primary text-white"
                        : "bg-surface-background text-text-primary hover:bg-surface-divider"
                    }`}
                  >
                    {TYPE_LABELS[activityType]}
                  </button>
                ))}
              </div>
            </div>

            {/* Permits Filter */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresPermit}
                  onChange={(e) => setRequiresPermit(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-divider text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm md:text-base text-text-primary">
                  Requires permit
                </span>
              </label>
            </div>

            {/* Shuttle Filter */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresShuttle}
                  onChange={(e) => setRequiresShuttle(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-divider text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm md:text-base text-text-primary">
                  Requires shuttle
                </span>
              </label>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Browse suggestions or search for specific hikes, viewpoints, and POIs"
              className="flex-1 rounded-xl border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Add Custom Activity Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="w-full px-4 py-2 rounded-lg bg-primary text-white text-sm md:text-base font-medium hover:bg-primary-dark transition"
            >
              Add activity
            </button>
          </div>

          {/* Custom Activity Form */}
          {showCustomForm && (
            <div className="space-y-4 p-4 border border-surface-divider rounded-xl bg-surface-background">
              <div>
                <label className="block text-sm md:text-base font-medium text-text-primary mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customActivityName}
                  onChange={(e) => setCustomActivityName(e.target.value)}
                  placeholder="Enter activity name"
                  className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium text-text-primary mb-2">
                  Type of activity <span className="text-red-500">*</span>
                </label>
                <select
                  value={customActivityType}
                  onChange={(e) => setCustomActivityType(e.target.value as Activity["type"])}
                  className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="hike">Hike</option>
                  <option value="viewpoint">Viewpoint</option>
                  <option value="scenic-drive">Scenic Drive</option>
                  <option value="activity">Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium text-text-primary mb-2">
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={customLinkUrl}
                  onChange={(e) => setCustomLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm md:text-base font-medium text-text-primary mb-2">
                    Duration (optional)
                  </label>
                  <input
                    type="text"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="e.g., 2 hours"
                    className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base font-medium text-text-primary mb-2">
                    Time (optional)
                  </label>
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="e.g., 9:00 AM"
                    className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveCustomActivity}
                  disabled={!customActivityName.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm md:text-base font-medium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save activity
                </button>
                <button
                  type="button"
                  onClick={handleCancelCustomActivity}
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-background text-text-primary text-sm md:text-base font-medium hover:bg-surface-divider transition border border-surface-divider"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-medium text-text-primary">
              Results ({filteredActivities.length})
              {isLoadingTrails && (
                <span className="text-xs text-text-secondary ml-2">(Loading hikes...)</span>
              )}
            </h3>
            <div className="space-y-2">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border border-surface-divider bg-white hover:bg-surface-background transition"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-text-primary mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-xs md:text-sm text-text-secondary mb-2">
                      {activity.tagline}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activity.requiresPermit && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-badge-warning text-text-primary border border-surface-divider">
                          Permit Required
                        </span>
                      )}
                      {activity.requiresShuttle && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-badge-warning text-text-primary border border-surface-divider">
                          Shuttle Required
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddActivity(activity)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-sm md:text-base font-medium hover:bg-primary-dark transition"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
            {filteredActivities.length === 0 && (
              <p className="text-sm md:text-base text-text-secondary text-center py-8">
                No activities found. Try adjusting your filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

