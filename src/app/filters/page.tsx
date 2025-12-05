"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
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
  const datePickerRef = useRef<HTMLDivElement>(null);
  const parkInputRef = useRef<HTMLDivElement>(null);

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
      return;
    }

    const preset = searchParams.get("preset");
    if (preset && PRESET_PARKS[preset]) {
      setTripParks(PRESET_PARKS[preset]);
    } else {
      setTripParks([]);
    }
  }, [searchParams]);

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
    };

    const handleScroll = () => {
      setShowDatePicker(false);
    };

    if (showDatePicker || showAddPark) {
      document.addEventListener("mousedown", handleClickOutside);
      if (showDatePicker) {
        window.addEventListener("scroll", handleScroll, true);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showDatePicker, showAddPark]);

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
    if (startingPoint) params.append("startingPoint", startingPoint);
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
        <input
          type="text"
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
          placeholder="City, airport, or address (e.g., Las Vegas, SLC Airport)"
          className="w-full rounded-xl border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:border-secondary"
        />
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
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                  <label className="flex items-center gap-3 cursor-pointer group">
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
        <div className="space-y-6">
          <div>
            <label className="block text-sm md:text-base text-text-primary mb-3">
              Driving time per day:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
              <label className="flex items-center gap-3 cursor-pointer group">
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
