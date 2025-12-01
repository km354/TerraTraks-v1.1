"use client";

import { useState } from "react";

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

export default function HeroSection() {
  const [selectedParks, setSelectedParks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const availableParks = ALL_PARKS.filter((p) => !selectedParks.includes(p));

  let options: string[];
  if (searchTerm === "") {
    options = availableParks.slice(0, 5);
  } else {
    options = availableParks
      .filter((park) =>
        park.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort()
      .slice(0, 4);
  }

  const handleSelectPark = (park: string) => {
    setSelectedParks([...selectedParks, park]);
    setSearchTerm("");
  };

  const handleRemovePark = (index: number) => {
    setSelectedParks(selectedParks.filter((_, i) => i !== index));
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

    const newParks = [...selectedParks];
    const [removed] = newParks.splice(draggedIndex, 1);
    newParks.splice(dropIndex, 0, removed);
    setSelectedParks(newParks);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <section id="hero-input" className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
          Your Personal Planner for National Parks
        </h1>
        <p className="mt-4 text-base md:text-lg text-text-secondary">
          Plan multi-park road trips without spreadsheets.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-surface-divider bg-white p-4 md:p-6 shadow-card space-y-3">
        <label
          htmlFor="park-search"
          className="text-sm md:text-base font-medium text-text-primary"
        >
          Which National Parks are you visiting?
        </label>

        <div className="relative">
          <input
            id="park-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a park name..."
            className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20"
          />

          {options.length > 0 && (
            <div className="mt-2 rounded-lg border border-surface-divider bg-white shadow-card overflow-hidden">
              {options.map((park) => (
                <button
                  key={park}
                  type="button"
                  onClick={() => handleSelectPark(park)}
                  className="w-full px-3 py-2 text-sm md:text-base hover:bg-surface-divider cursor-pointer text-left"
                >
                  {park}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedParks.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedParks.map((park, index) => (
              <div
                key={`${park}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className="inline-flex items-center gap-2 rounded-full bg-surface-divider px-3 py-1.5 text-sm md:text-base cursor-move"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-xs text-white">
                  {index + 1}
                </span>
                <span>{park}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePark(index)}
                  className="text-xs text-text-secondary hover:text-gray-900 ml-1"
                  aria-label={`Remove ${park}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
