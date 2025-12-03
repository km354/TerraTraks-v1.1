"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

const ALL_PARKS = [
  "Yellowstone National Park",
  "Grand Canyon National Park",
  "Zion National Park",
  "Yosemite National Park",
  "Rocky Mountain National Park",
  "Grand Teton National Park",
  "Glacier National Park",
  "Acadia National Park",
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
      className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-sm md:text-base cursor-move shadow-md"
    >
      <span
        {...attributes}
        {...listeners}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white font-semibold cursor-grab active:cursor-grabbing"
      >
        {index + 1}
      </span>
      <span className="text-text-primary">{park}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-text-secondary hover:text-gray-900 ml-1"
        aria-label={`Remove ${park}`}
      >
        ×
      </button>
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [selectedParks, setSelectedParks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const availableParks = ALL_PARKS.filter((p) => !selectedParks.includes(p));

  let options: string[];
  if (searchTerm === "") {
    options = showAllOptions ? availableParks : [];
  } else {
    options = availableParks
      .filter((park) =>
        park.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort()
      .slice(0, 8);
  }

  const handleSelectPark = (park: string) => {
    setSelectedParks([...selectedParks, park]);
    setSearchTerm("");
    setShowAllOptions(false);
    setIsInputFocused(false);
  };

  const handleRemovePark = (index: number) => {
    setSelectedParks(selectedParks.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedParks((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleStartPlanning = () => {
    if (selectedParks.length > 0) {
      const params = new URLSearchParams();
      selectedParks.forEach((park) => {
        params.append("parks", park);
      });
      router.push(`/filters?${params.toString()}`);
    }
  };

  const handleInputClick = () => {
    setIsInputFocused(true);
    setShowAllOptions(true);
  };

  return (
    <section
      id="hero-input"
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[35vh] md:min-h-[40vh] flex items-center"
    >
      {/* Full-width background image */}
      <div className="absolute inset-0 -z-0">
        <Image
          src="/images/landing-page-yosemite.jpg"
          alt="Yosemite National Park"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content overlaid on image */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          {/* Large centered headline */}
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Your Personal Planner for National Parks
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/95 drop-shadow-md">
              Plan multi-park road trips without spreadsheets.
            </p>
          </div>

          {/* Prominent search bar */}
          <div className="w-full max-w-4xl relative">
            <div className="bg-white rounded-2xl shadow-2xl p-2 md:p-3">
              <div className="flex items-center">
                <input
                  id="park-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleInputClick}
                  onClick={handleInputClick}
                  onBlur={() => {
                    // Delay to allow click events on suggestions
                    setTimeout(() => {
                      setIsInputFocused(false);
                      setShowAllOptions(false);
                    }, 200);
                  }}
                  placeholder="Search for national parks..."
                  className="flex-1 rounded-xl border-0 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleInputClick}
                  className="ml-2 rounded-xl bg-primary text-white px-6 md:px-8 py-2 md:py-3 font-semibold hover:bg-primary-dark transition flex items-center gap-2"
                >
                  <span>Search</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Show options only when input is focused/clicked */}
            {isInputFocused && options.length > 0 && (
              <div className="absolute top-full mt-2 w-full rounded-xl border border-surface-divider bg-white shadow-xl overflow-hidden z-20 max-h-64 overflow-y-auto">
                {options.map((park) => (
                  <button
                    key={park}
                    type="button"
                    onClick={() => handleSelectPark(park)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full px-4 py-3 text-left hover:bg-surface-divider cursor-pointer text-base border-b border-surface-divider last:border-b-0"
                  >
                    {park}
                  </button>
                ))}
              </div>
            )}

            {/* Selected parks display with drag and drop */}
            {selectedParks.length > 0 && (
              <div className="mt-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={selectedParks}>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedParks.map((park, index) => (
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

                {/* Start Planning Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleStartPlanning}
                    className="rounded-xl bg-primary text-white px-8 md:px-12 py-2 md:py-3 text-base md:text-lg font-semibold hover:bg-primary-dark transition shadow-lg"
                  >
                    Start Planning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}