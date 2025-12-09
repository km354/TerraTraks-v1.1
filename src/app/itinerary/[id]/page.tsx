"use client";

import { useState, useEffect, useRef, Suspense, useMemo, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import AddActivityDrawer, {
  Activity,
} from "@/components/itinerary/AddActivityDrawer";
import MapPanel, {
  ParkMarker,
  ActivityMarker,
} from "@/components/itinerary/MapPanel";
import { getPrimaryEntrance, getParkCodeFromName } from "@/lib/services/nationalParks";
import { fetchAlertsForParks, type ParkAlert } from "@/lib/services/nps";
import type { NationalPark } from "@/lib/types/nationalParks";
import AuthModal from "@/components/auth/AuthModal";
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
  { id: "accommodation", label: "Accommodation", sectionId: "section-accommodation" },
];

// Park tier system for day allocation
const PARK_TIERS: Record<string, "A" | "B" | "C"> = {
  // Tier A: Major, iconic parks (2-3 days default)
  "Yellowstone National Park": "A",
  "Grand Canyon National Park": "A",
  "Yosemite National Park": "A",
  "Zion National Park": "A",
  "Glacier National Park": "A",
  "Rocky Mountain National Park": "A",
  "Great Smoky Mountains National Park": "A",
  "Olympic National Park": "A",
  "Sequoia National Park": "A",
  "Kings Canyon National Park": "A",
  "Grand Teton National Park": "A",
  "Arches National Park": "A",
  "Canyonlands National Park": "A",
  "Bryce Canyon National Park": "A",
  "Capitol Reef National Park": "A",
  // Tier B: Medium complexity (1.5-2 days default)
  "Acadia National Park": "B",
  "Badlands National Park": "B",
  "Crater Lake National Park": "B",
  // Tier C: Small, quick highlights (1 day default)
  // All other parks default to Tier C
};

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
  description?: string;
  requiresPermit?: boolean;
  requiresShuttle?: boolean;
};

interface SortableParkItemProps {
  park: string;
  index: number;
  days: number;
  onRemove: () => void;
  onDaysChange: (days: number) => void;
  canDecrease: boolean;
  canIncrease: boolean;
}

function SortableParkItem({ park, index, days, onRemove, onDaysChange, canDecrease, canIncrease }: SortableParkItemProps) {
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
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canDecrease && days > 1) {
              onDaysChange(days - 1);
            }
          }}
          disabled={!canDecrease || days <= 1}
          className="w-7 h-7 rounded-lg border border-surface-divider bg-white hover:bg-surface-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-text-primary transition"
          aria-label={`Decrease days for ${park}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-sm md:text-base text-text-primary font-medium min-w-[3rem] text-center">
          {days} {days === 1 ? "day" : "days"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canIncrease) {
              onDaysChange(days + 1);
            }
          }}
          disabled={!canIncrease}
          className="w-7 h-7 rounded-lg border border-surface-divider bg-white hover:bg-surface-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-text-primary transition"
          aria-label={`Increase days for ${park}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
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
  const router = useRouter();
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
  const [parkCoordinates, setParkCoordinates] = useState<Record<string, { lat: number; lng: number }>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ left: 0, top: 0 });
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState<ParkAlert[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth check from Supabase
  const [openAccommodationDropdown, setOpenAccommodationDropdown] = useState<string | null>(null);
  const accommodationDropdownRef = useRef<HTMLDivElement>(null);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);

  // Calculate calendar position when it opens
  useEffect(() => {
    if (showDatePicker && datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      setCalendarPosition({
        left: rect.right + 8,
        top: rect.top
      });
    }
  }, [showDatePicker]);

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

  // Fetch alerts when parks change
  useEffect(() => {
    const fetchParkAlerts = async () => {
      if (parks.length === 0) {
        setAlerts([]);
        return;
      }

      setIsLoadingAlerts(true);
      try {
        // Convert park names to park codes
        const parkCodes = parks.map((parkName) => getParkCodeFromName(parkName));
        console.log("🔔 Fetching alerts for parks:", parks);
        console.log("🔔 Converted to park codes:", parkCodes);
        const parkAlerts = await fetchAlertsForParks(parkCodes);
        console.log("✅ Received alerts:", parkAlerts);
        setAlerts(parkAlerts);
      } catch (error) {
        console.error("❌ Error fetching alerts:", error);
        setAlerts([]);
      } finally {
        setIsLoadingAlerts(false);
      }
    };

    fetchParkAlerts();
  }, [parks]);

  // Read preferences from URL params
  const pace = searchParams.get("pace") || "balanced";
  const drivingTime = searchParams.get("drivingTime") || "no-preference";
  const hikingTime = searchParams.get("hikingTime") || "no-preference";
  const startingPoint = searchParams.get("startingPoint") || "";
  const startingPointLat = searchParams.get("startingPointLat");
  const startingPointLng = searchParams.get("startingPointLng");
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");
  
  // Date range state for date picker
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startDateStr ? new Date(startDateStr) : null,
    endDateStr ? new Date(endDateStr) : null,
  ]);
  
  // Update date range when URL params change
  useEffect(() => {
    setDateRange([
      startDateStr ? new Date(startDateStr) : null,
      endDateStr ? new Date(endDateStr) : null,
    ]);
  }, [startDateStr, endDateStr]);
  
  // Handle date change and update URL
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange([start, end]);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams.toString());
    if (start) {
      newParams.set("startDate", start.toISOString().split("T")[0]);
    } else {
      newParams.delete("startDate");
    }
    if (end) {
      newParams.set("endDate", end.toISOString().split("T")[0]);
    } else {
      newParams.delete("endDate");
    }
    
    router.push(`/itinerary/${itineraryId}?${newParams.toString()}`);
  };
  
  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDatePicker]);

  // Close accommodation dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accommodationDropdownRef.current &&
        !accommodationDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenAccommodationDropdown(null);
      }
    };
    
    if (openAccommodationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openAccommodationDropdown]);
  
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

  // Handle park days adjustment
  const handleParkDaysChange = useCallback((park: string, newDays: number) => {
    setParkDays((prev) => {
      const updated = { ...prev, [park]: newDays };
      const currentTotal = Object.values(updated).reduce((sum, days) => sum + days, 0);
      const diff = numberOfDays - currentTotal;
      
      if (diff !== 0) {
        // Auto-adjust other parks
        const otherParks = parks.filter(p => p !== park);
        if (otherParks.length > 0) {
          const sortedOtherParks = [...otherParks].sort((a, b) => updated[b] - updated[a]);
          for (let i = 0; i < Math.abs(diff); i++) {
            const adjustPark = sortedOtherParks[i % sortedOtherParks.length];
            if (diff > 0) {
              updated[adjustPark] = (updated[adjustPark] || 1) + 1;
            } else if (updated[adjustPark] > 1) {
              updated[adjustPark] -= 1;
            }
          }
        }
      }
      
      return updated;
    });
  }, [parks, numberOfDays]);

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
  const [activities, setActivities] = useState<ItineraryActivity[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDayForActivities, setSelectedDayForActivities] = useState<number | null>(null);
  const [parkDays, setParkDays] = useState<Record<string, number>>({});
  const [selectedActivity, setSelectedActivity] = useState<ItineraryActivity | null>(null);
  const activityModalRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Calculate initial days per park using weighted formula
  const calculateParkDays = useCallback((parksList: string[], totalDays: number, activitiesList: ItineraryActivity[], tripPace: string) => {
    if (parksList.length === 0) return {};
    
    // Count activities per park
    const activitiesPerPark: Record<string, number> = {};
    parksList.forEach(park => {
      activitiesPerPark[park] = activitiesList.filter(a => a.park === park).length;
    });
    
    // Calculate base days from tier
    const baseDays: Record<string, number> = {};
    parksList.forEach(park => {
      const tier = PARK_TIERS[park] || "C";
      if (tier === "A") {
        baseDays[park] = 2.5; // Default 2-3 days, use 2.5 as starting point
      } else if (tier === "B") {
        baseDays[park] = 1.75; // Default 1.5-2 days
      } else {
        baseDays[park] = 1; // Tier C: 1 day
      }
    });
    
    // Adjust based on activities (highest weight)
    const maxActivities = Math.max(...Object.values(activitiesPerPark), 1);
    parksList.forEach(park => {
      const activityCount = activitiesPerPark[park];
      if (activityCount > 0) {
        // More activities = more days needed
        const activityMultiplier = 1 + (activityCount / maxActivities) * 0.5;
        baseDays[park] *= activityMultiplier;
      }
    });
    
    // Adjust based on trip pace (high weight)
    const paceMultiplier = tripPace === "relaxed" ? 1.2 : tripPace === "packed" ? 0.9 : 1.0;
    parksList.forEach(park => {
      baseDays[park] *= paceMultiplier;
    });
    
    // Normalize to total days
    const totalBaseDays = Object.values(baseDays).reduce((sum, days) => sum + days, 0);
    const normalizedDays: Record<string, number> = {};
    parksList.forEach(park => {
      normalizedDays[park] = Math.max(1, Math.round((baseDays[park] / totalBaseDays) * totalDays));
    });
    
    // Ensure total equals totalDays (adjust if needed)
    const currentTotal = Object.values(normalizedDays).reduce((sum, days) => sum + days, 0);
    if (currentTotal !== totalDays) {
      const diff = totalDays - currentTotal;
      // Adjust the largest park(s) to make up the difference
      const sortedParks = [...parksList].sort((a, b) => normalizedDays[b] - normalizedDays[a]);
      for (let i = 0; i < Math.abs(diff); i++) {
        const park = sortedParks[i % sortedParks.length];
        if (diff > 0) {
          normalizedDays[park] += 1;
        } else if (normalizedDays[park] > 1) {
          normalizedDays[park] -= 1;
        }
      }
    }
    
    return normalizedDays;
  }, []);

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
      linkUrl: activity.linkUrl,
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

  // Fetch park coordinates from Supabase
  useEffect(() => {
    const fetchParkCoordinates = async () => {
      const coordinates: Record<string, { lat: number; lng: number }> = {};
      
      for (const parkName of parks) {
        const parkCode = getParkCodeFromName(parkName);
        const parkData = await getPrimaryEntrance(parkCode);
        
        if (parkData) {
          coordinates[parkName] = {
            lat: Number(parkData.latitude_deg),
            lng: Number(parkData.longitude_deg),
          };
        } else {
          // Fallback to default coordinates if not found
          coordinates[parkName] = { lat: 44.4280, lng: -110.5885 };
        }
      }
      
      setParkCoordinates(coordinates);
    };
    
    if (parks.length > 0) {
      fetchParkCoordinates();
    }
  }, [parks]);

  // Convert parks to marker format
  const parkMarkers: ParkMarker[] = useMemo(() => {
    return parks.map((parkName, index) => {
      const parkActivities = activities.filter((a) => a.park === parkName);
      const firstDay = parkActivities.length > 0 ? parkActivities[0].day : undefined;
      
      // Get coordinates from Supabase data or fallback
      const coords = parkCoordinates[parkName] || { lat: 44.4280, lng: -110.5885 };
      
      return {
        id: `park-${index}`,
        name: parkName,
        lat: coords.lat,
        lng: coords.lng,
        isSelected: true,
        day: firstDay,
      };
    });
  }, [parks, activities, parkCoordinates]);

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

      // Get coordinates from Supabase data or fallback
      const parkCoords = parkCoordinates[activity.park] || { lat: 44.4280, lng: -110.5885 };
      
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
  }, [activities, parkCoordinates]);

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
        {/* Fixed top section - Main navigation items */}
        <div className="flex-shrink-0 p-3 space-y-2 text-sm border-b border-surface-divider">
          {SIDEBAR_ITEMS.map((item) => (
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
        </div>

        {/* Scrollable bottom section - Day navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
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
          {/* Support */}
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push("/support");
            }}
            className="px-2 py-2 rounded-lg cursor-pointer flex items-center text-left text-text-secondary hover:bg-surface-background w-full whitespace-nowrap"
          >
            <span className="text-base">Support</span>
          </button>
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
              <div className="relative" ref={datePickerRef}>
                <label className="text-sm text-text-secondary">Dates</label>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="text-base md:text-lg font-medium text-text-primary hover:text-primary transition cursor-pointer text-left w-full"
                >
                  {formattedDateRange}
                </button>
                {showDatePicker && (
                  <div className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-surface-divider p-4" style={{ 
                    left: `${calendarPosition.left}px`,
                    top: `${calendarPosition.top}px`
                  }}>
                    <DatePicker
                      selected={dateRange[0]}
                      onChange={handleDateChange}
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
                {parks.map((park, index) => {
                  const days = parkDays[park] || 1;
                  const currentTotal = Object.values(parkDays).reduce((sum, d) => sum + d, 0);
                  const canIncrease = currentTotal < numberOfDays;
                  const canDecrease = days > 1;
                  
                  return (
                    <SortableParkItem
                      key={park}
                      park={park}
                      index={index}
                      days={days}
                      onRemove={() => handleRemovePark(index)}
                      onDaysChange={(newDays) => handleParkDaysChange(park, newDays)}
                      canDecrease={canDecrease}
                      canIncrease={canIncrease}
                    />
                  );
                })}
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
          <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
            {isLoadingAlerts ? (
              <p className="text-sm md:text-base text-text-secondary">
                Loading alerts...
              </p>
            ) : alerts.length === 0 ? (
              <p className="text-sm md:text-base text-text-secondary">
                No alerts or closures at this time. Any closures, alerts, shuttle requirements, or permits will appear here.
              </p>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="border-l-4 border-primary/50 bg-surface-background p-4 rounded-r-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base md:text-lg font-semibold text-text-primary">
                            {alert.title}
                          </h3>
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">
                            {alert.category}
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-text-secondary mb-2">
                          {alert.description}
                        </p>
                        {alert.url && (
                          <a
                            href={alert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Learn more
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Accommodation Section */}
        <section
          id="section-accommodation"
          ref={(el) => {
            sectionRefs.current["section-accommodation"] = el;
          }}
          className="space-y-4 mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            Accommodation
          </h2>
          <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-6">
            <p className="text-sm md:text-base text-text-secondary">
              This makes it easier to plan where you&apos;ll stay during each part of your journey.
            </p>
            
            {parks.map((park, index) => {
              // Extract city name from park name (e.g., "Yellowstone National Park" -> "Yellowstone")
              // Or use nearby city names for better search results
              const getLocationName = (parkName: string): string => {
                // Map of park names to nearby cities for better search results
                const parkCityMap: Record<string, string> = {
                  "Yellowstone National Park": "West Yellowstone",
                  "Grand Canyon National Park": "Grand Canyon",
                  "Zion National Park": "Springdale",
                  "Yosemite National Park": "Yosemite",
                  "Rocky Mountain National Park": "Estes Park",
                  "Grand Teton National Park": "Jackson",
                  "Glacier National Park": "West Glacier",
                  "Acadia National Park": "Bar Harbor",
                  "Bryce Canyon National Park": "Bryce",
                  "Arches National Park": "Moab",
                  "Canyonlands National Park": "Moab",
                  "Capitol Reef National Park": "Torrey",
                  "Great Smoky Mountains National Park": "Gatlinburg",
                  "Olympic National Park": "Port Angeles",
                  "Sequoia National Park": "Three Rivers",
                  "Kings Canyon National Park": "Three Rivers",
                  "Crater Lake National Park": "Bend",
                  "Badlands National Park": "Wall",
                };
                
                // Try to find a mapped city, otherwise extract from park name
                if (parkCityMap[parkName]) {
                  return parkCityMap[parkName];
                }
                
                // Extract first word from park name (e.g., "Yellowstone National Park" -> "Yellowstone")
                const firstWord = parkName.split(" ")[0];
                return firstWord;
              };

              const locationName = getLocationName(park);
              
              // Calculate nights for this park (simplified - assumes 1 night per park for now)
              const nights = 1;
              const startDate = new Date();
              startDate.setDate(startDate.getDate() + index);
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + nights - 1);
              
              const formatDate = (date: Date) => {
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              };

              return (
                <div key={park} className="space-y-4 pb-6 border-b border-surface-divider last:border-b-0 last:pb-0">
                  {/* Park Name */}
                  <h3 className="text-lg md:text-xl font-semibold text-text-primary">
                    {park}
                  </h3>
                  
                  {/* Nights and Date Info */}
                  <div className="flex items-center gap-2 text-sm md:text-base text-text-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                    <span className="text-text-secondary">•</span>
                    <span>{formatDate(startDate)}{nights > 1 ? `-${formatDate(endDate)}` : ""}</span>
                  </div>
                  
                  {/* Add Lodging Button */}
                  <button
                    className="w-full px-4 py-3 rounded-lg bg-primary text-white text-sm md:text-base font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Lodging</span>
                  </button>
                  
                  {/* Explore nearby areas Button with Dropdown */}
                  <div className="relative" ref={accommodationDropdownRef}>
                    <button
                      onClick={() => {
                        setOpenAccommodationDropdown(openAccommodationDropdown === park ? null : park);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-surface-divider bg-white text-text-primary text-sm md:text-base font-medium hover:bg-surface-background transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Explore nearby areas</span>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform ${openAccommodationDropdown === park ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openAccommodationDropdown === park && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl border border-surface-divider shadow-xl z-50 overflow-hidden">
                        <a
                          href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(locationName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpenAccommodationDropdown(null)}
                          className="block px-4 py-3 text-sm md:text-base text-text-primary hover:bg-surface-background transition border-b border-surface-divider"
                        >
                          Search Hotels in {locationName}
                        </a>
                        <a
                          href={`https://www.airbnb.com/s/${encodeURIComponent(locationName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpenAccommodationDropdown(null)}
                          className="block px-4 py-3 text-sm md:text-base text-text-primary hover:bg-surface-background transition border-b border-surface-divider"
                        >
                          Search Airbnbs in {locationName}
                        </a>
                        <a
                          href={`https://www.recreation.gov/search?q=${encodeURIComponent(locationName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpenAccommodationDropdown(null)}
                          className="block px-4 py-3 text-sm md:text-base text-text-primary hover:bg-surface-background transition"
                        >
                          Search Campgrounds near {locationName}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
                                setSelectedActivity(activity);
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
            parks={parks}
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
            startingPoint={
              startingPoint && startingPointLat && startingPointLng
                ? {
                    name: startingPoint,
                    lat: parseFloat(startingPointLat),
                    lng: parseFloat(startingPointLng),
                  }
                : null
            }
            onParkClick={handleParkClick}
            onActivityHover={handleActivityHover}
          />
        </div>
      </div>


      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={activityModalRef}
            className="bg-white rounded-xl border border-surface-divider shadow-xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xl md:text-2xl font-semibold text-text-primary">
                {selectedActivity.name}
              </h3>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-text-secondary hover:text-text-primary text-2xl font-semibold flex-shrink-0"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            {selectedActivity.description && (
              <p className="text-sm md:text-base text-text-secondary">
                {selectedActivity.description}
              </p>
            )}
            
            {selectedActivity.linkUrl && (
              <div className="pt-4 border-t border-surface-divider">
                <a
                  href={selectedActivity.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm md:text-base text-primary hover:text-primary-dark font-medium transition"
                >
                  <span>
                    View on {selectedActivity.linkUrl.includes('nps.gov') ? 'NPS' : selectedActivity.linkUrl.includes('alltrails.com') ? 'AllTrails' : 'Website'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          // TODO: When Supabase auth is implemented, check session here:
          // const { data: { session } } = await supabase.auth.getSession();
          // setIsLoggedIn(!!session);
          // For now, mock implementation - user stays logged out until auth is implemented
        }}
        initialMode={authMode}
      />
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
