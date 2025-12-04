"use client";

import Link from "next/link";

export default function TripsPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="text-center max-w-md mx-auto px-4 space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            No trips yet
          </h2>
          <p className="text-base md:text-lg text-text-secondary">
            Start planning your first national park adventure and create your personalized itinerary.
          </p>
        </div>
        
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary text-white px-8 py-3 text-base md:text-lg font-semibold hover:bg-primary-dark transition shadow-md"
          >
            Start Planning My Trip
          </Link>
        </div>
      </div>
    </div>
  );
}

