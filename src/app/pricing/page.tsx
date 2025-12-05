"use client";

import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for planning your first national park adventure with basic itinerary features.",
      price: "Free",
      priceSubtext: "",
      features: [
        "1 trip itinerary per month",
        "Basic park recommendations",
        "Essential activity suggestions",
        "Trip overview and planning",
        "Email support",
      ],
    },
    {
      name: "Explorer",
      description: "For frequent travelers who want advanced planning features and multiple trip management.",
      price: "$6",
      priceSubtext: "/month",
      features: [
        "Unlimited trip itineraries",
        "Advanced park recommendations",
        "Custom activity suggestions",
        "Multiple park itineraries",
        "Priority email support",
        "Trip sharing and collaboration",
        "Export itineraries to PDF",
      ],
    },
    {
      name: "Pro",
      description: "For serious adventurers who need premium features, analytics, and priority support.",
      price: "$10",
      priceSubtext: "/month",
      features: [
        "Everything in Explorer plus:",
        "AI-powered trip optimization",
        "Real-time weather integration",
        "Permit and reservation tracking",
        "Advanced route planning",
        "24/7 priority support",
        "Trip analytics and insights",
        "Offline access to itineraries",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Choose Your Plan
        </h1>
        <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
          Select the perfect plan for your national park adventures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#1D3B2A] rounded-xl border border-[#1B5E20]/20 p-6 md:p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Plan Header */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {plan.name}
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.priceSubtext && (
                  <span className="text-base md:text-lg text-white/80">
                    {plan.priceSubtext}
                  </span>
                )}
              </div>
            </div>

            {/* Features List */}
            <div className="flex-1 mb-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-white flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm md:text-base text-white/95">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 rounded-lg bg-white text-[#1B5E20] font-medium hover:bg-white/90 transition text-sm md:text-base"
              >
                Get Started
              </Link>
              <p className="text-xs text-white/80 text-center mt-3">
                No Credit Card Required
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
