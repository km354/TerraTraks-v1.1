"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
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
  { id: "itinerary", label: "Itinerary", sectionId: "section-itinerary" },
  { id: "alerts", label: "Alerts & Permits", sectionId: "section-alerts" },
];

const BOTTOM_ITEMS = [
  { id: "settings", label: "Settings", href: "/settings" },
  { id: "support", label: "Support", href: "/support" },
  { id: "logout", label: "Logout", href: "#" },
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
  const itineraryId = params.id as string;
  const [activeSection, setActiveSection] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [parks, setParks] = useState([
    "Yellowstone National Park",
    "Grand Teton National Park",
  ]);

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
    {
      id: "5",
      name: "Jenny Lake",
      type: "hike",
      day: 3,
      park: "Grand Teton National Park",
      linkUrl: "https://www.nps.gov/grte/planyourvisit/jennylake.htm",
    },
    {
      id: "6",
      name: "Teton Range Viewpoint",
      type: "viewpoint",
      day: 3,
      park: "Grand Teton National Park",
    },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDayForActivities, setSelectedDayForActivities] = useState<number | null>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Get unique days from activities
  const availableDays = useMemo(() => {
    const days = Array.from(new Set(activities.map((a) => a.day))).sort(
      (a, b) => a - b
    );
    return days;
  }, [activities]);

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

    SIDEBAR_ITEMS.forEach((item) => {
      const section = sectionRefs.current[item.sectionId];
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveSection(item.id);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "-100px 0px -50% 0px",
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleSidebarClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRemovePark = (index: number) => {
    setParks(parks.filter((_, i) => i !== index));
  };

  const handleAddPark = () => {
    // Stub: would open a modal or navigate to add park
    console.log("Add park clicked");
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
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex flex-col md:flex-row gap-0 h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 border-r border-surface-divider bg-white h-full overflow-y-auto">
        <div className="md:sticky md:top-24 space-y-2 text-sm md:text-base flex flex-col h-full p-4">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.sectionId)}
              className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between text-left ${
                activeSection === item.id
                  ? "bg-surface-background text-text-primary font-semibold border border-black/10"
                  : "text-text-secondary hover:bg-surface-background"
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mt-auto space-y-2 pt-4 border-t border-surface-divider">
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
                className="px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between text-left text-text-secondary hover:bg-surface-background w-full"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 h-full overflow-hidden">
        {/* Itinerary Content - Scrollable */}
        <div className="flex-1 overflow-y-auto h-full">
          <div className="max-w-2xl mx-auto p-6 space-y-8">
            {/* Sticky Search Bar */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-surface-divider py-3 mb-4 -mx-6 px-6">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities, viewpoints, hikes, and POIs"
              className="flex-1 rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20 bg-white"
              style={{ maxHeight: "120px" }}
            >
              <option value="all">All days</option>
              {availableDays.map((day) => (
                <option key={day} value={day.toString()}>
                  Day {day}
                </option>
              ))}
            </select>
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
                  June 15 - June 20, 2024
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Number of Parks</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  {parks.length} parks
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Pace</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  Balanced
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Total Driving</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  12 hours • 450 miles
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Travelers</label>
                <p className="text-base md:text-lg font-medium text-text-primary">
                  2 travelers
                </p>
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
          className="space-y-4"
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
          <button
            onClick={handleAddPark}
            className="w-full mt-4 px-4 py-2 rounded-lg border border-surface-divider bg-white hover:bg-surface-background text-sm md:text-base text-text-primary font-medium transition"
          >
            Add another park
          </button>
        </section>

        {/* Itinerary Section */}
        <section
          id="section-itinerary"
          ref={(el) => {
            sectionRefs.current["section-itinerary"] = el;
          }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            Itinerary
          </h2>
          <div className="space-y-4">
            {filteredDays.length > 0 ? (
              filteredDays.map((day) => {
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
                            className="flex items-start justify-between gap-3 p-3 rounded-lg border border-surface-divider bg-white hover:bg-surface-background transition group"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm md:text-base font-medium text-text-primary">
                                  {activity.name}
                                </span>
                                <span className="text-xs text-text-secondary capitalize">
                                  {activity.type}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {activity.linkUrl && (
                                  <a
                                    href={activity.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-brand-primary hover:text-brand-hover underline"
                                  >
                                    View details
                                  </a>
                                )}
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
                              onClick={() => handleDeleteActivity(activity.id)}
                              className="opacity-0 group-hover:opacity-100 transition text-xs text-text-secondary hover:text-red-500 flex-shrink-0"
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
                      className="mt-2 px-4 py-2 rounded-lg border border-surface-divider bg-white hover:bg-surface-background text-sm md:text-base text-text-primary font-medium transition"
                    >
                      Add activity
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl border border-surface-divider p-6">
                <p className="text-sm md:text-base text-text-secondary">
                  {searchTerm
                    ? "No activities match your search."
                    : "No activities added yet."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Alerts & Permits Section */}
        <section
          id="section-alerts"
          ref={(el) => {
            sectionRefs.current["section-alerts"] = el;
          }}
          className="space-y-4"
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
          </div>
        </div>

        {/* Map Panel - Fixed full height */}
        <div className="hidden lg:flex w-[45%] xl:w-[50%] flex-shrink-0 border-l border-surface-divider h-full overflow-hidden">
          <MapPanel
            parks={parkMarkers}
            activities={activityMarkers}
            selectedDay={selectedDay === "all" ? null : parseInt(selectedDay)}
            onParkClick={handleParkClick}
            onActivityHover={handleActivityHover}
          />
        </div>
      </div>

      {/* Add Activity Drawer */}
      <AddActivityDrawer
        isOpen={isDrawerOpen}
        selectedDay={selectedDayForActivities}
        onClose={handleCloseDrawer}
        onAddActivity={handleAddActivity}
      />
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItineraryContent />
    </Suspense>
  );
}
