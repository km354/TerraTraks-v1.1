"use client";

import { useState } from "react";

const RECOMMENDED_TOPICS = [
  {
    title: "Getting started with TerraTraks",
    description: "Learn how to create your first itinerary",
  },
  {
    title: "Adding parks to your trip",
    description: "How to select and organize multiple parks",
  },
  {
    title: "Customizing your itinerary",
    description: "Add activities, adjust dates, and set preferences",
  },
  {
    title: "Sharing your itinerary",
    description: "Collaborate with friends and family",
  },
];

const TOPICS = [
  { title: "Getting started", icon: "🚀" },
  { title: "Billing", icon: "💳" },
  { title: "Itinerary planner", icon: "🗺️" },
  { title: "Account settings", icon: "⚙️" },
  { title: "Troubleshooting", icon: "🔧" },
  { title: "Mobile app", icon: "📱" },
];

const FAQ_ITEMS = [
  {
    question: "How do I create my first itinerary?",
    answer:
      "Start by selecting the parks you want to visit on the home page. Then click 'Start Planning My Trip' to customize your itinerary with dates, pace, and preferences.",
  },
  {
    question: "Can I share my itinerary with others?",
    answer:
      "Yes! You can share your itinerary with collaborators. Go to Settings to configure collaboration permissions - you can allow others to view, suggest changes, or directly edit.",
  },
  {
    question: "How does the route optimization work?",
    answer:
      "TerraTraks automatically calculates the most efficient route between parks based on your selected parks and starting point. The route considers driving time and distance to minimize travel.",
  },
  {
    question: "Can I export my itinerary?",
    answer:
      "Yes, you can export your itinerary as a PDF from the itinerary page. This makes it easy to share or print your trip plan.",
  },
  {
    question: "What if I need to change my dates?",
    answer:
      "You can update your trip dates at any time from the Filters page. The itinerary will automatically adjust based on your new dates.",
  },
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
        How can we help?
      </h1>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search help articles and FAQs"
          className="w-full rounded-lg border border-surface-divider px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>

      {/* Recommended for you */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Recommended for you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDED_TOPICS.map((topic, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-surface-divider p-4 hover:shadow-card transition cursor-pointer"
            >
              <h3 className="text-sm md:text-base font-semibold text-text-primary mb-1">
                {topic.title}
              </h3>
              <p className="text-xs md:text-sm text-text-secondary">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by topic */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Browse by topic
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TOPICS.map((topic, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-surface-divider p-4 text-center hover:shadow-card transition cursor-pointer"
            >
              <div className="text-2xl mb-2">{topic.icon}</div>
              <h3 className="text-sm md:text-base font-medium text-text-primary">
                {topic.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          FAQ
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-surface-divider overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenFaqIndex(openFaqIndex === index ? null : index)
                }
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-surface-background transition"
              >
                <span className="text-sm md:text-base font-medium text-text-primary">
                  {item.question}
                </span>
                <span className="text-lg text-text-secondary">
                  {openFaqIndex === index ? "−" : "+"}
                </span>
              </button>
              {openFaqIndex === index && (
                <div className="px-4 pb-3">
                  <p className="text-sm md:text-base text-text-secondary">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact us */}
      <section className="bg-white rounded-xl border border-surface-divider p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary mb-2">
          Contact us
        </h2>
        <p className="text-sm md:text-base text-text-secondary">
          Email us at{" "}
          <a
            href="mailto:terratraks00@gmail.com"
            className="text-brand-primary hover:text-brand-hover underline"
          >
            terratraks00@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
