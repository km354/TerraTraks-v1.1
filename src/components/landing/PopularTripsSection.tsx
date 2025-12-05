"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <section className="bg-white pt-0 pb-12 md:pb-16 space-y-4 md:space-y-6">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-primary">
          Or start with a popular trip
        </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {POPULAR_TRIPS.map((trip, index) => (
          <div
            key={trip.id}
            onClick={() => handleCardClick(trip.id)}
            className="flex flex-col rounded-xl bg-white border border-primary/10 shadow-sm overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-md hover:border-primary/20"
          >
            <div className="h-40 w-full bg-[#2d4a3e] relative overflow-hidden">
              <Image
                src={trip.imageUrl}
                alt={trip.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
                quality={85}
              />
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
      </div>
    </section>
  );
}
