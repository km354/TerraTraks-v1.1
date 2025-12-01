"use client";

import { useRouter } from "next/navigation";

const POPULAR_TRIPS = [
  {
    id: "yellowstone-grand-teton",
    name: "Yellowstone + Grand Teton",
    parks: 2,
    days: 6,
    imageUrl: "/images/trips/yellowstone-teton.jpg",
  },
  {
    id: "utah-mighty-5",
    name: "Utah Mighty 5",
    parks: 5,
    days: 10,
    imageUrl: "/images/trips/utah-mighty-5.jpg",
  },
  {
    id: "grand-canyon-zion-bryce",
    name: "Grand Canyon + Zion + Bryce",
    parks: 3,
    days: 7,
    imageUrl: "/images/trips/grand-canyon-zion-bryce.jpg",
  },
];

export default function PopularTripsSection() {
  const router = useRouter();

  const handleCardClick = (tripId: string) => {
    router.push(`/filters?preset=${tripId}`);
  };

  return (
    <section className="space-y-4 md:space-y-6">
      <h2 className="text-3xl md:text-4xl font-semibold text-text-primary">
        Or start with a popular trip
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {POPULAR_TRIPS.map((trip) => (
          <div
            key={trip.id}
            onClick={() => handleCardClick(trip.id)}
            className="flex flex-col rounded-xl bg-white shadow-card overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="h-40 w-full bg-surface-background relative">
              {/* Placeholder div - images will be added later */}
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                {trip.name}
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-base md:text-lg font-semibold text-text-primary">
                {trip.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {trip.parks} parks • {trip.days} days
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
