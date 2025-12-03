"use client";

import { useState, useMemo } from "react";

export interface Activity {
  id: string;
  title: string;
  tagline: string;
  difficulty: "easy" | "moderate" | "hard";
  type: "hike" | "viewpoint" | "scenic-drive" | "activity";
  requiresPermit: boolean;
  requiresShuttle: boolean;
}

interface AddActivityDrawerProps {
  isOpen: boolean;
  selectedDay: number | null;
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
}

// Mock activities data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "Old Faithful Geyser",
    tagline: "0.5 miles • Easy • 30 minutes",
    difficulty: "easy",
    type: "viewpoint",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "2",
    title: "Grand Prismatic Spring Overlook Trail",
    tagline: "1.2 miles • Easy • 1 hour",
    difficulty: "easy",
    type: "hike",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "3",
    title: "Upper Geyser Basin Loop",
    tagline: "3.2 miles • Moderate • 2–3 hours",
    difficulty: "moderate",
    type: "hike",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "4",
    title: "Lamar Valley Wildlife Viewing",
    tagline: "Scenic Drive • Easy • 2–3 hours",
    difficulty: "easy",
    type: "scenic-drive",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "5",
    title: "Mount Washburn Trail",
    tagline: "6.2 miles • Hard • 4–5 hours",
    difficulty: "hard",
    type: "hike",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "6",
    title: "Artist Point",
    tagline: "0.1 miles • Easy • 15 minutes",
    difficulty: "easy",
    type: "viewpoint",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "7",
    title: "The Narrows",
    tagline: "9.4 miles • Hard • 6–8 hours",
    difficulty: "hard",
    type: "hike",
    requiresPermit: true,
    requiresShuttle: true,
  },
  {
    id: "8",
    title: "Angels Landing",
    tagline: "5.4 miles • Hard • 4–5 hours",
    difficulty: "hard",
    type: "hike",
    requiresPermit: true,
    requiresShuttle: false,
  },
  {
    id: "9",
    title: "Emerald Pools Trail",
    tagline: "3.0 miles • Moderate • 2–3 hours",
    difficulty: "moderate",
    type: "hike",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "10",
    title: "Canyon Overlook Trail",
    tagline: "1.0 mile • Easy • 1 hour",
    difficulty: "easy",
    type: "hike",
    requiresPermit: false,
    requiresShuttle: false,
  },
  {
    id: "11",
    title: "Zion Scenic Drive",
    tagline: "Scenic Drive • Easy • 1–2 hours",
    difficulty: "easy",
    type: "scenic-drive",
    requiresPermit: false,
    requiresShuttle: true,
  },
  {
    id: "12",
    title: "Riverside Walk",
    tagline: "2.2 miles • Easy • 1–2 hours",
    difficulty: "easy",
    type: "hike",
    requiresPermit: false,
    requiresShuttle: true,
  },
];

const TYPE_LABELS: Record<Activity["type"], string> = {
  hike: "Hikes",
  viewpoint: "Viewpoints",
  "scenic-drive": "Scenic Drives",
  activity: "Activities",
};

export default function AddActivityDrawer({
  isOpen,
  selectedDay,
  onClose,
  onAddActivity,
}: AddActivityDrawerProps) {
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredActivities = useMemo(() => {
    let filtered = MOCK_ACTIVITIES;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchLower) ||
          activity.tagline.toLowerCase().includes(searchLower)
      );
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
    }

    // Permit filter
    if (requiresPermit) {
      filtered = filtered.filter((activity) => activity.requiresPermit);
    }

    // Shuttle filter
    if (requiresShuttle) {
      filtered = filtered.filter((activity) => activity.requiresShuttle);
    }

    return filtered;
  }, [searchTerm, difficulty, type, requiresPermit, requiresShuttle]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-screen w-[480px] bg-white border-l border-surface-divider shadow-card z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-divider flex-shrink-0">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Add activities
        </h2>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-gray-900 text-xl font-semibold"
          aria-label="Close drawer"
        >
          ×
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Day Indicator */}
          {selectedDay !== null && (
            <div className="text-sm md:text-base text-text-primary font-medium">
              Adding activities to Day {selectedDay}
            </div>
          )}

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
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Browse suggestions or search for specific hikes, viewpoints, and POIs"
              className="w-full rounded-xl border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Results List */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-medium text-text-primary">
              Results ({filteredActivities.length})
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

