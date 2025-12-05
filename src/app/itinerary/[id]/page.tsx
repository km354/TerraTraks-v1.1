"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AddActivityDrawer, {
  Activity,
} from "@/components/itinerary/AddActivityDrawer";
import MapPanel, {
  ParkMarker,
  ActivityMarker,
} from "@/components/itinerary/MapPanel";
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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SIDEBAR_ITEMS = [
  { id: "overview", label: "Trip Overview", sectionId: "section-overview" },
  { id: "parks", label: "Parks", sectionId: "section-parks" },
  { id: "alerts", label: "Alerts & Permits", sectionId: "section-alerts" },
];

const BOTTOM_ITEMS = [
  { id: "settings", label: "Settings", href: "/settings" },
  { id: "support", label: "Support", href: "/support" },
  { id: "logout", label: "Logout", href: "#" },
];

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

type ItineraryActivity = {
  id: string;
  name: string;
  type: "hike" | "viewpoint" | "poi" | "other";
  day: number;
  park?: string;
  linkUrl?: string;
  requiresPermit?: boolean;
  requiresShuttle?: boolean;
};

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

function ItineraryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const itineraryId = params.id as string;
  const [activeSection, setActiveSection] = useState("overview");
  const isScrollingRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  
  // Initialize parks from URL params
  const [parks, setParks] = useState<string[]>(() => {
    const parksFromUrl = searchParams.getAll("parks");
    return parksFromUrl.length > 0 ? parksFromUrl : [
      "Yellowstone National Park",
      "Grand Teton National Park",
    ];
  });
  const [showAddPark, setShowAddPark] = useState(false);
  const [parkSearchTerm, setParkSearchTerm] = useState("");
  const [isParkInputFocused, setIsParkInputFocused] = useState(false);
  const parkInputRef = useRef<HTMLDivElement>(null);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const guestSelectorRef = useRef<HTMLDivElement>(null);

  // Prevent body scrolling on itinerary page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Sync parks with URL params
  useEffect(() => {
    const parksFromUrl = searchParams.getAll("parks");
    if (parksFromUrl.length > 0) {
      setParks(parksFromUrl);
    }
  }, [searchParams]);

  // Read preferences from URL params
  const pace = searchParams.get("pace") || "balanced";
  const drivingTime = searchParams.get("drivingTime") || "no-preference";
  const hikingTime = searchParams.get("hikingTime") || "no-preference";
  const startingPoint = searchParams.get("startingPoint") || "";
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");
  
  // Calculate number of days from date range
  const numberOfDays = useMemo(() => {
    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    }
    return 3; // Default to 3 days if no dates provided
  }, [startDateStr, endDateStr]);
  
  // Format dates for display
  const formattedDateRange = useMemo(() => {
    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      return `${startDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} - ${endDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return "Dates not set";
  }, [startDateStr, endDateStr]);
  
  // Format pace for display
  const formattedPace = useMemo(() => {
    if (pace === "relaxed") return "Relaxed";
    if (pace === "packed") return "Packed";
    return "Balanced";
  }, [pace]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for parks
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setParks((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const [activities, setActivities] = useState<ItineraryActivity[]>([
    {
      id: "1",
      name: "Old Faithful",
      type: "viewpoint",
      day: 1,
      park: "Yellowstone National Park",
      linkUrl: "https://www.nps.gov/yell/planyourvisit/oldfaithful.htm",
    },
    {
      id: "2",
      name: "Grand Prismatic Spring",
      type: "viewpoint",
      day: 1,
      park: "Yellowstone National Park",
      linkUrl: "https://www.nps.gov/yell/planyourvisit/grandprismaticspring.htm",
    },
    {
      id: "3",
      name: "Yellowstone Lake",
      type: "poi",
      day: 2,
      park: "Yellowstone National Park",
    },
    {
      id: "4",
      name: "Lamar Valley",
      type: "viewpoint",
      day: 2,
      park: "Yellowstone National Park",
    },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDayForActivities, setSelectedDayForActivities] = useState<number | null>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Get unique days from activities - use numberOfDays if no activities
  const availableDays = useMemo(() => {
    const daysFromActivities = Array.from(new Set(activities.map((a) => a.day))).sort(
      (a, b) => a - b
    );
    // If we have a calculated numberOfDays but no activities for all days, include all days
    if (daysFromActivities.length === 0 || daysFromActivities.length < numberOfDays) {
      return Array.from({ length: numberOfDays }, (_, i) => i + 1);
    }
    return daysFromActivities;
  }, [activities, numberOfDays]);

  // Filter activities based on search and selected day
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by day
    if (selectedDay !== "all") {
      const dayNum = parseInt(selectedDay);
      filtered = filtered.filter((activity) => activity.day === dayNum);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.name.toLowerCase().includes(searchLower) ||
          activity.type.toLowerCase().includes(searchLower) ||
          (activity.park && activity.park.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [activities, searchTerm, selectedDay]);

  // Group activities by day
  const activitiesByDay = useMemo(() => {
    const grouped: { [day: number]: ItineraryActivity[] } = {};
    filteredActivities.forEach((activity) => {
      if (!grouped[activity.day]) {
        grouped[activity.day] = [];
      }
      grouped[activity.day].push(activity);
    });
    return grouped;
  }, [filteredActivities]);

  // Get unique days from filtered activities for display
  const filteredDays = useMemo(() => {
    return Array.from(new Set(filteredActivities.map((a) => a.day))).sort(
      (a, b) => a - b
    );
  }, [filteredActivities]);

  // IntersectionObserver for scrollspy
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;
    
    if (!scrollContainer) return;

    // Observe all sections (overview, parks, itinerary, alerts, and days)
    const allSections = [
      ...SIDEBAR_ITEMS.map(item => ({ id: item.id, sectionId: item.sectionId })),
      ...availableDays.map(day => ({ id: `day-${day}`, sectionId: `day-${day}` }))
    ];

    allSections.forEach(({ id, sectionId }) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          // Don't update active section while programmatically scrolling
          if (isScrollingRef.current) return;

          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
              setActiveSection(id);
            }
          });
        },
        {
          root: scrollContainer,
          threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1],
          rootMargin: "-120px 0px -60% 0px",
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [availableDays]);

  const handleSidebarClick = (sectionId: string) => {
    const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;
    const section = document.getElementById(sectionId);
    if (section && scrollContainer) {
      // Convert sectionId to active section id
      const sectionIdToActiveId = (id: string) => {
        if (id.startsWith('day-')) {
          return id;
        }
        const item = SIDEBAR_ITEMS.find(item => item.sectionId === id);
        return item ? item.id : id;
      };
      
      // Immediately update active section for responsive UI
      const activeId = sectionIdToActiveId(sectionId);
      setActiveSection(activeId);
      
      // Set scrolling flag to prevent intersection observer from interfering
      isScrollingRef.current = true;
      
      // Calculate scroll position relative to container
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;
      const currentScroll = scrollContainer.scrollTop;
      const targetScroll = currentScroll + (sectionTop - containerTop) - 100; // 100px offset for sticky header
      
      scrollContainer.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: "smooth"
      });
      
      // Re-enable intersection observer after scroll animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  const handleRemovePark = (index: number) => {
    setParks(parks.filter((_, i) => i !== index));
  };

  const availableParks = ALL_PARKS.filter((p) => !parks.includes(p));

  const parkOptions = parkSearchTerm === ""
    ? availableParks.sort().slice(0, 8)
    : availableParks
        .filter((park) =>
          park.toLowerCase().includes(parkSearchTerm.toLowerCase())
        )
        .sort()
        .slice(0, 8);

  // Close park search and guest selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        parkInputRef.current &&
        !parkInputRef.current.contains(event.target as Node)
      ) {
        setIsParkInputFocused(false);
        setShowAddPark(false);
      }
      if (
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target as Node)
      ) {
        setShowGuestSelector(false);
      }
    };

    if (showAddPark || showGuestSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddPark, showGuestSelector]);

  const handleAddPark = (park: string) => {
    setParks([...parks, park]);
    setParkSearchTerm("");
    setIsParkInputFocused(false);
    setShowAddPark(false);
  };

  const handleOpenDrawer = (day: number) => {
    setSelectedDayForActivities(day);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDayForActivities(null);
  };

  const handleAddActivity = (activity: Activity) => {
    if (selectedDayForActivities === null) return;

    const newActivity: ItineraryActivity = {
      id: Date.now().toString(),
      name: activity.title,
      type: activity.type === "hike" ? "hike" : activity.type === "viewpoint" ? "viewpoint" : "other",
      day: selectedDayForActivities,
      park: parks[0], // Default to first park, could be improved
      linkUrl: undefined,
      requiresPermit: activity.requiresPermit,
      requiresShuttle: activity.requiresShuttle,
    };

    setActivities((prev) => [...prev, newActivity]);
  };

  const handleDeleteActivity = (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;

    const confirmed = window.confirm(
      "Remove this activity from your itinerary?"
    );
    if (confirmed) {
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    }
  };

  // Get park name for a day (from first activity or default)
  const getParkForDay = (day: number): string => {
    const dayActivity = activities.find((a) => a.day === day);
    return dayActivity?.park || parks[0] || "Unknown Park";
  };

  // Convert parks to marker format
  const parkMarkers: ParkMarker[] = useMemo(() => {
    return parks.map((parkName, index) => {
      const parkActivities = activities.filter((a) => a.park === parkName);
      const firstDay = parkActivities.length > 0 ? parkActivities[0].day : undefined;
      
      // Get coordinates from mock data
      const PARK_COORDINATES: Record<string, { lat: number; lng: number }> = {
        "Yellowstone National Park": { lat: 44.4280, lng: -110.5885 },
        "Grand Teton National Park": { lat: 43.7904, lng: -110.6818 },
        "Grand Canyon National Park": { lat: 36.1069, lng: -112.1129 },
        "Zion National Park": { lat: 37.2982, lng: -113.0263 },
        "Bryce Canyon National Park": { lat: 37.5930, lng: -112.1871 },
      };
      
      const coords = PARK_COORDINATES[parkName] || { lat: 44.4280, lng: -110.5885 };
      
      return {
        id: `park-${index}`,
        name: parkName,
        lat: coords.lat,
        lng: coords.lng,
        isSelected: true,
        day: firstDay,
      };
    });
  }, [parks, activities]);

  // Convert activities to marker format
  const activityMarkers: ActivityMarker[] = useMemo(() => {
    return activities.map((activity, index) => {
      if (!activity.park) {
        // Fallback coordinates
        return {
          id: activity.id,
          name: activity.name,
          lat: 44.4280,
          lng: -110.5885,
          day: activity.day,
          park: activity.park,
          type: activity.type,
        };
      }

      const PARK_COORDINATES: Record<string, { lat: number; lng: number }> = {
        "Yellowstone National Park": { lat: 44.4280, lng: -110.5885 },
        "Grand Teton National Park": { lat: 43.7904, lng: -110.6818 },
        "Grand Canyon National Park": { lat: 36.1069, lng: -112.1129 },
        "Zion National Park": { lat: 37.2982, lng: -113.0263 },
        "Bryce Canyon National Park": { lat: 37.5930, lng: -112.1871 },
      };

      const parkCoords = PARK_COORDINATES[activity.park] || { lat: 44.4280, lng: -110.5885 };
      
      // Add small offset for each activity
      const activityIndex = activities.filter((a) => a.park === activity.park && a.day === activity.day).indexOf(activity);
      return {
        id: activity.id,
        name: activity.name,
        lat: parkCoords.lat + (activityIndex * 0.01),
        lng: parkCoords.lng + (activityIndex * 0.01),
        day: activity.day,
        park: activity.park,
        type: activity.type,
      };
    });
  }, [activities]);

  const handleParkClick = (parkId: string) => {
    const parkMarker = parkMarkers.find((p) => p.id === parkId);
    if (parkMarker && parkMarker.day) {
      // Scroll to that day in the itinerary
      const dayElement = document.getElementById(`day-${parkMarker.day}`);
      if (dayElement) {
        dayElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Also update selected day filter
      setSelectedDay(parkMarker.day.toString());
    }
    console.log("Park clicked:", parkMarker?.name);
  };

  const handleActivityHover = (activityId: string | null) => {
    if (activityId) {
      console.log("Activity hovered:", activityId);
    }
  };

  return (
    <div className="fixed inset-0 top-[5rem] flex flex-col md:flex-row gap-0 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-[173px] flex-shrink-0 border-r border-surface-divider bg-white h-full overflow-hidden flex flex-col">
        {/* Scrollable sidebar items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
          {SIDEBAR_ITEMS.filter(item => item.id !== "alerts").map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.sectionId)}
              className={`px-2 py-2 rounded-lg cursor-pointer flex items-center text-left whitespace-nowrap w-full ${
                activeSection === item.id
                  ? "bg-surface-background text-text-primary font-semibold border border-black/10"
                  : "text-text-secondary hover:bg-surface-background"
              }`}
            >
              <span className="text-base">{item.label}</span>
            </button>
          ))}
          
          {/* Alerts & Permits - between Parks and Days */}
          {SIDEBAR_ITEMS.filter(item => item.id === "alerts").map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.sectionId)}
              className={`px-2 py-2 rounded-lg cursor-pointer flex items-center text-left whitespace-nowrap w-full ${
                activeSection === item.id
                  ? "bg-surface-background text-text-primary font-semibold border border-black/10"
                  : "text-text-secondary hover:bg-surface-background"
              }`}
            >
              <span className="text-base">{item.label}</span>
            </button>
          ))}
          
          {/* Day navigation */}
          {availableDays.length > 0 && (
            <>
              {availableDays.map((day) => (
                <button
                  key={`day-${day}`}
                  onClick={() => handleSidebarClick(`day-${day}`)}
                  className={`px-2 py-2 rounded-lg cursor-pointer flex items-center text-left whitespace-nowrap w-full ${
                    activeSection === `day-${day}`
                      ? "bg-surface-background text-text-primary font-semibold border border-black/10"
                      : "text-text-secondary hover:bg-surface-background"
                  }`}
                >
                  <span className="text-base">Day {day}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Fixed bottom items */}
        <div className="flex-shrink-0 p-3 space-y-2 pt-4 border-t border-surface-divider">
          {BOTTOM_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.href !== "#") {
                  window.location.href = item.href;
                } else {
                  // Handle logout
                  console.log("Logout clicked");
                }
              }}
              className="px-2 py-2 rounded-lg cursor-pointer flex items-center text-left text-text-secondary hover:bg-surface-background w-full whitespace-nowrap"
            >
              <span className="text-base">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 h-full overflow-hidden">
        {/* Itinerary Content - Scrollable */}
        <div className="w-full lg:w-[515px] flex-shrink-0 overflow-y-auto h-full border-r border-surface-divider" data-scroll-container>
          <div className="p-4">
            {/* Sticky Search Bar */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-surface-divider py-3 mb-4 -mx-4 px-4">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities, viewpoints, hikes, and POIs"
              className="flex-1 rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <div className="relative">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
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
        </div>

        {/* Trip Overview Section */}
        <section
          id="section-overview"
          ref={(el) => {
            sectionRefs.current["section-overview"] = el;
          }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            Trip Overview
          </h2>
          <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-secondary">Dates</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  {formattedDateRange}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Number of Parks</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  {parks.length} parks
                </p>
              </div>
              {startingPoint && (
                <div>
                  <label className="text-sm text-text-secondary">Starting Point</label>
                  <p className="text-base md:text-lg font-medium text-text-primary">
                    {startingPoint}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-text-secondary">Pace</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  {formattedPace}
                </p>
              </div>
              {drivingTime !== "no-preference" && (
                <div>
                  <label className="text-sm text-text-secondary">Driving Time</label>
                  <p className="text-base md:text-lg font-medium text-text-primary">
                    {drivingTime === "<2" ? "< 2 hours/day" : 
                     drivingTime === "2-4" ? "2-4 hours/day" : 
                     drivingTime === "4+" ? "4+ hours/day" : drivingTime}
                  </p>
                </div>
              )}
              {hikingTime !== "no-preference" && (
                <div>
                  <label className="text-sm text-text-secondary">Hiking Time</label>
                  <p className="text-base md:text-lg font-medium text-text-primary">
                    {hikingTime === "0-1" ? "0-1 hrs/day" :
                     hikingTime === "1-3" ? "1-3 hrs/day" :
                     hikingTime === "4-6" ? "4-6 hrs/day" :
                     hikingTime === "all-day" ? "All-Day" : hikingTime}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-text-secondary">Total Driving</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  12 hours • 450 miles
                </p>
              </div>
              <div className="relative" ref={guestSelectorRef}>
                <label className="text-sm text-text-secondary">Travelers</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowGuestSelector(!showGuestSelector)}
                    className={`w-full text-left rounded-lg border border-surface-divider px-3 py-2 pr-8 text-base md:text-lg font-medium hover:border-primary transition focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white ${
                      adults + kids === 0
                        ? "text-text-secondary"
                        : "text-text-primary"
                    }`}
                  >
                    {adults + kids === 0
                      ? "Add travelers"
                      : adults + kids === 1
                      ? "1 traveler"
                      : `${adults + kids} travelers`}
                  </button>
                  {adults + kids > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdults(0);
                        setKids(0);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
                      aria-label="Clear travelers"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {showGuestSelector && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border border-surface-divider shadow-xl z-50 p-6">
                    <div className="space-y-6">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-medium text-text-primary">
                            Adults
                          </div>
                          <div className="text-sm text-text-secondary">
                            Ages 13 or above
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(0, adults - 1))}
                            disabled={adults <= 0}
                            className="w-8 h-8 rounded-full border border-surface-divider flex items-center justify-center hover:border-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Decrease adults"
                          >
                            <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-base font-medium text-text-primary">
                            {adults}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="w-8 h-8 rounded-full border border-surface-divider flex items-center justify-center hover:border-primary transition"
                            aria-label="Increase adults"
                          >
                            <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-surface-divider"></div>

                      {/* Kids */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-medium text-text-primary">
                            Children
                          </div>
                          <div className="text-sm text-text-secondary">
                            Ages 2-12
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setKids(Math.max(0, kids - 1))}
                            disabled={kids <= 0}
                            className="w-8 h-8 rounded-full border border-surface-divider flex items-center justify-center hover:border-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Decrease children"
                          >
                            <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-base font-medium text-text-primary">
                            {kids}
                          </span>
                          <button
                            type="button"
                            onClick={() => setKids(kids + 1)}
                            className="w-8 h-8 rounded-full border border-surface-divider flex items-center justify-center hover:border-primary transition"
                            aria-label="Increase children"
                          >
                            <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Clear Button */}
                      {adults + kids > 0 && (
                        <>
                          <div className="border-t border-surface-divider"></div>
                          <button
                            type="button"
                            onClick={() => {
                              setAdults(0);
                              setKids(0);
                            }}
                            className="w-full text-left text-sm text-primary hover:text-primary-dark font-medium transition"
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Parks Section */}
        <section
          id="section-parks"
          ref={(el) => {
            sectionRefs.current["section-parks"] = el;
          }}
          className="space-y-4 mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            Parks
          </h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={parks}>
              <div className="space-y-2">
                {parks.map((park, index) => (
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
          <div className="relative mt-4" ref={parkInputRef}>
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
              <button
                onClick={() => {
                  setShowAddPark(true);
                  setIsParkInputFocused(true);
                }}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm md:text-base font-medium transition"
              >
                Add another park
              </button>
            )}
          </div>
        </section>

        {/* Alerts & Permits Section */}
        <section
          id="section-alerts"
          ref={(el) => {
            sectionRefs.current["section-alerts"] = el;
          }}
          className="space-y-4 mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            Alerts & Permits
          </h2>
          <div className="bg-white rounded-xl border border-surface-divider p-6">
            <p className="text-sm md:text-base text-text-secondary">
              Any closures, alerts, shuttle requirements, or permits will appear here.
            </p>
          </div>
        </section>

        {/* Itinerary Section */}
        <section
          id="section-itinerary"
          ref={(el) => {
            sectionRefs.current["section-itinerary"] = el;
          }}
          className="space-y-4 mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            Itinerary
          </h2>
          <div className="space-y-4">
            {Array.from({ length: numberOfDays }, (_, i) => i + 1).map((day) => {
                const dayActivities = activitiesByDay[day] || [];
                return (
                  <div
                    id={`day-${day}`}
                    key={day}
                    className="bg-white rounded-xl border border-surface-divider p-6 space-y-3"
                  >
                    <h3 className="text-lg md:text-xl font-semibold text-text-primary">
                      Day {day} – {getParkForDay(day)}
                    </h3>
                    {dayActivities.length > 0 ? (
                      <div className="space-y-2">
                        {dayActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-surface-divider bg-white hover:bg-surface-background transition group"
                          >
                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => {
                                if (activity.linkUrl) {
                                  window.open(activity.linkUrl, '_blank', 'noopener,noreferrer');
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm md:text-base font-medium text-text-primary">
                                  {activity.name}
                                </span>
                                <span className="text-xs text-text-secondary">
                                  {activity.type === "poi" ? "POI" : activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {activity.requiresPermit && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-badge-warning text-text-primary border border-surface-divider">
                                    Permit
                                  </span>
                                )}
                                {activity.requiresShuttle && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-badge-warning text-text-primary border border-surface-divider">
                                    Shuttle
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteActivity(activity.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition text-base md:text-lg text-text-secondary hover:text-red-500 flex-shrink-0 flex items-center justify-center h-6 w-6"
                              aria-label={`Remove ${activity.name}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary">
                        No activities for this day.
                      </p>
                    )}
                    <button
                      onClick={() => handleOpenDrawer(day)}
                      className="mt-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm md:text-base font-medium transition"
                    >
                      Add activity
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
          </div>
        </div>

        {/* Add Activity Drawer - Part of layout, not fixed */}
        <div className={`hidden lg:flex flex-shrink-0 border-r border-surface-divider h-full transition-all duration-300 ease-in-out ${
          isDrawerOpen ? 'w-[442px]' : 'w-0 overflow-hidden'
        }`}>
          <AddActivityDrawer
            isOpen={isDrawerOpen}
            selectedDay={selectedDayForActivities}
            availableDays={availableDays}
            onClose={handleCloseDrawer}
            onAddActivity={handleAddActivity}
            onDayChange={setSelectedDayForActivities}
          />
        </div>

        {/* Map Panel - Adjusts width based on drawer state */}
        <div className="hidden lg:flex flex-1 flex-shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out">
          <MapPanel
            parks={parkMarkers}
            activities={activityMarkers}
            selectedDay={selectedDay === "all" ? null : parseInt(selectedDay)}
            onParkClick={handleParkClick}
            onActivityHover={handleActivityHover}
          />
        </div>
      </div>
    </div>
  );
}

function ItineraryPageContent() {
  return <ItineraryContent />;
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItineraryPageContent />
    </Suspense>
  );
}
