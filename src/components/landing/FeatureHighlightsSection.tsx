const FEATURES = [
  {
    icon: "🗺️",
    title: "Smart Route Planning",
    description: "Automatically optimize your route between parks to minimize driving time and maximize your adventure.",
  },
  {
    icon: "📅",
    title: "Flexible Itineraries",
    description: "Build custom itineraries that adapt to your schedule, interests, and travel preferences.",
  },
  {
    icon: "🎫",
    title: "Permit Management",
    description: "Stay on top of park permits, reservations, and entry requirements all in one place.",
  },
  {
    icon: "🌲",
    title: "Park Insights",
    description: "Get detailed information about each park including best times to visit, must-see attractions, and local tips.",
  },
];

export default function FeatureHighlightsSection() {
  return (
    <section className="space-y-4 md:space-y-6">
      <h2 className="text-3xl md:text-4xl font-semibold text-text-slate">
        Why travelers use TerraTraks
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {FEATURES.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-card p-4 md:p-5 space-y-2"
          >
            <div className="text-2xl">{feature.icon}</div>
            <h3 className="text-base md:text-lg font-semibold text-text-slate">
              {feature.title}
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
