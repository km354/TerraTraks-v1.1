export default function SampleItinerarySection() {
  return (
    <section className="space-y-4 md:space-y-6">
      <h2 className="text-3xl md:text-4xl font-semibold text-text-slate">
        What your TerraTraks Itinerary looks like
      </h2>

      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="aspect-[4/3] rounded-xl bg-surface-background flex items-center justify-center text-sm md:text-base text-gray-500">
          Sample itinerary screenshot
        </div>

        <div className="text-sm md:text-base text-gray-600 space-y-2">
          <p>
            Your personalized itinerary includes a day-by-day breakdown of your trip with recommended activities, driving times, and park highlights.
          </p>
          <p>
            Each day shows the best route, estimated travel time, and must-see attractions at each park, so you can make the most of your adventure.
          </p>
          <p>
            Export your itinerary as a PDF or share it with your travel companions to keep everyone on the same page.
          </p>
        </div>
      </div>
    </section>
  );
}
