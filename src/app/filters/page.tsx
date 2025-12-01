"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";

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

const DEFAULT_PARKS = [
  "Yellowstone National Park",
  "Grand Canyon National Park",
];

function FiltersContent() {
  const searchParams = useSearchParams();
  const [tripParks, setTripParks] = useState<string[]>([]);
  const [startingPoint, setStartingPoint] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [isFlexibleDates, setIsFlexibleDates] = useState(false);
  const [tripPace, setTripPace] = useState<"relaxed" | "balanced" | "packed">(
    "balanced"
  );
  const [maxMilesPerDay, setMaxMilesPerDay] = useState("");
  const [maxHoursHiking, setMaxHoursHiking] = useState("");
  const [difficulty, setDifficulty] = useState<{
    easy: boolean;
    moderate: boolean;
    hard: boolean;
  }>({
    easy: false,
    moderate: false,
    hard: false,
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Initialize parks from preset or default
  useEffect(() => {
    const preset = searchParams.get("preset");
    if (preset && PRESET_PARKS[preset]) {
      setTripParks(PRESET_PARKS[preset]);
    } else {
      setTripParks(DEFAULT_PARKS);
    }
  }, [searchParams]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  const handleRemovePark = (index: number) => {
    setTripParks(tripParks.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newParks = [...tripParks];
    const [removed] = newParks.splice(draggedIndex, 1);
    newParks.splice(dropIndex, 0, removed);
    setTripParks(newParks);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDifficultyChange = (level: "easy" | "moderate" | "hard") => {
    setDifficulty((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const formatDateRange = () => {
    if (!dateRange[0]) return "Select dates";
    if (!dateRange[1]) {
      return dateRange[0].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return `${dateRange[0].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${dateRange[1].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-text-slate">
        Customize your trip
      </h1>

      {/* Trip Parks Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-slate">
          Trip Parks
        </h2>
        <div className="space-y-2">
          {tripParks.map((park, index) => (
            <div
              key={`${park}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className="flex items-center gap-3 p-3 rounded-lg border border-surface-divider bg-white hover:bg-surface-background transition cursor-move group"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-forest text-xs text-white font-semibold flex-shrink-0">
                {index + 1}
              </span>
              <span className="flex-1 text-sm md:text-base text-text-slate">
                {park}
              </span>
              <button
                type="button"
                onClick={() => handleRemovePark(index)}
                className="opacity-0 group-hover:opacity-100 transition text-gray-600 hover:text-gray-900 text-sm md:text-base"
                aria-label={`Remove ${park}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Starting Point Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-slate">
          Starting Point
        </h2>
        <input
          type="text"
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
          placeholder="City, airport, or address"
          className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-forest/60"
        />
      </section>

      {/* Dates Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-slate">
          Dates
        </h2>
        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base text-left focus:outline-none focus:ring-2 focus:ring-brand-forest/60 bg-white"
          >
            {formatDateRange()}
          </button>
          {showDatePicker && (
            <div className="absolute z-50 mt-2 bg-white rounded-xl border border-surface-divider shadow-card p-4">
              <DatePicker
                selected={dateRange[0]}
                onChange={(dates) => {
                  const [start, end] = dates as [Date | null, Date | null];
                  setDateRange([start, end]);
                }}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                selectsRange
                monthsShown={2}
                minDate={minDate}
                maxDate={maxDate}
                inline
                calendarClassName="!border-0"
                className="!border-0"
              />
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFlexibleDates}
            onChange={(e) => setIsFlexibleDates(e.target.checked)}
            className="w-4 h-4 rounded border-surface-divider text-brand-forest focus:ring-brand-forest"
          />
          <span className="text-sm md:text-base text-text-slate">
            I&apos;m flexible with dates
          </span>
        </label>
      </section>

      {/* Trip Pace Section */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-text-slate">
          Trip Pace
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTripPace("relaxed")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm md:text-base font-medium transition ${
              tripPace === "relaxed"
                ? "bg-brand-forest text-white"
                : "bg-surface-background text-text-slate hover:bg-surface-divider"
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
                ? "bg-brand-forest text-white"
                : "bg-surface-background text-text-slate hover:bg-surface-divider"
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
                ? "bg-brand-forest text-white"
                : "bg-surface-background text-text-slate hover:bg-surface-divider"
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
        <h2 className="text-xl md:text-2xl font-semibold text-text-slate">
          Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm md:text-base text-text-slate mb-2">
              Max miles driven per day <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="number"
              value={maxMilesPerDay}
              onChange={(e) => setMaxMilesPerDay(e.target.value)}
              placeholder="e.g., 300"
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-forest/60"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base text-text-slate mb-2">
              Max hours hiking per day <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="number"
              value={maxHoursHiking}
              onChange={(e) => setMaxHoursHiking(e.target.value)}
              placeholder="e.g., 6"
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-forest/60"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base text-text-slate mb-3">
              Difficulty <span className="text-gray-500">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={difficulty.easy}
                  onChange={() => handleDifficultyChange("easy")}
                  className="w-4 h-4 rounded border-surface-divider text-brand-forest focus:ring-brand-forest"
                />
                <span className="text-sm md:text-base text-text-slate">Easy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={difficulty.moderate}
                  onChange={() => handleDifficultyChange("moderate")}
                  className="w-4 h-4 rounded border-surface-divider text-brand-forest focus:ring-brand-forest"
                />
                <span className="text-sm md:text-base text-text-slate">Moderate</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={difficulty.hard}
                  onChange={() => handleDifficultyChange("hard")}
                  className="w-4 h-4 rounded border-surface-divider text-brand-forest focus:ring-brand-forest"
                />
                <span className="text-sm md:text-base text-text-slate">Hard</span>
              </label>
            </div>
          </div>
        </div>
      </section>
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

