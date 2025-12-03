export default function BeforeAfterSection() {
  return (
    <section className="bg-white py-12 md:py-16 space-y-4 md:space-y-6">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-primary">
          See how TerraTraks changes your planning
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Before TerraTraks */}
          <div>
            <label className="text-xs md:text-sm uppercase tracking-wide font-semibold text-text-secondary block mb-3">
              Before TerraTraks
            </label>
            <div className="bg-white rounded-xl border border-primary/10 p-6 md:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-text-secondary flex-shrink-0">
                  ×
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text-primary mb-1">
                    Manual spreadsheet planning
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary">
                    Spend hours copying park information, calculating distances, and organizing your itinerary across multiple spreadsheets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-text-secondary flex-shrink-0">
                  ×
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text-primary mb-1">
                    Unclear route optimization
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary">
                    Guess at the best route between parks, leading to wasted time and fuel on inefficient paths.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-text-secondary flex-shrink-0">
                  ×
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text-primary mb-1">
                    Scattered information sources
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary">
                    Jump between multiple websites, apps, and guides to find park hours, permits, and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* After TerraTraks */}
          <div>
            <label className="text-xs md:text-sm uppercase tracking-wide font-semibold text-text-secondary block mb-3">
              After TerraTraks
            </label>
            <div className="bg-white rounded-xl border border-primary/10 p-6 md:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text-primary mb-1">
                    Automated itinerary generation
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary">
                    Get a complete, optimized itinerary with park details, routes, and recommendations in minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text-primary mb-1">
                    Optimized route planning
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary">
                    Automatically calculate the most efficient route between parks, saving time and reducing travel costs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text-primary mb-1">
                    All-in-one platform
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary">
                    Access everything you need in one place: park information, permits, weather, and personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
