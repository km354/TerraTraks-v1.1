"use client";

import { useState } from "react";
import Link from "next/link";

const RECOMMENDED_ARTICLES = [
  {
    title: "Creating Your First Itinerary",
    description: "Learn how to generate and customize your first national park itinerary",
    readTime: "5 min",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "Planning Multi-Park Road Trips",
    description: "Discover how to plan epic road trips across multiple national parks",
    readTime: "10 min",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Understanding Pro Features",
    description: "Explore all the premium features available with TerraTraks Pro",
    readTime: "8 min",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: "Exporting and Sharing Itineraries",
    description: "Learn how to export PDFs and share your trips with friends and family",
    readTime: "5 min",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
];

const BROWSE_TOPICS = [
  {
    title: "Getting Started",
    description: "Learn the basics of creating and managing your first...",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Billing & Subscriptions",
    description: "Manage your subscription, update payment methods, an...",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: "Trip Planning",
    description: "Tips for planning single and multi-park trips, customizing...",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Account Settings",
    description: "Update your profile, preferences, and manage yo...",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Export & Sharing",
    description: "Export PDFs, share itineraries, and collaborate with others",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    title: "Troubleshooting",
    description: "Fix common issues with maps, AI generation, and app...",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Multi-Park Trips",
    description: "Plan epic road trips across multiple national parks",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Pro Features",
    description: "Unlock advanced features with TerraTraks Pro subscription",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: "Collaboration",
    description: "Share and collaborate on itineraries with friends and...",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const POPULAR_TOPICS = [
  "Getting started",
  "Billing & subscriptions",
  "Trip planning",
  "Account settings",
  "Troubleshooting",
  "Export & sharing",
  "Multi-park trips",
  "Pro features",
];

const POPULAR_ARTICLES = [
  {
    title: "How do I generate my first itinerary?",
    description: "Start by visiting the Plan Trip page. Enter your destination park, travel dates, and preferences.",
    tags: ["Getting started", "Planning"],
  },
  {
    title: "What's included in the free plan vs Pro?",
    description: "The free plan includes basic itinerary generation. Pro unlocks unlimited itineraries and advanced features.",
    tags: ["Billing", "Plans"],
  },
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary">
            How can we help?
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ask a question or search a topic..."
              className="w-full rounded-xl border border-surface-divider pl-12 pr-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Popular Topics Links */}
          <div className="flex flex-wrap gap-4">
            {POPULAR_TOPICS.slice(0, 6).map((topic) => (
              <Link
                key={topic}
                href="#"
                className="text-sm text-primary hover:text-primary-dark underline"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended for you */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
              Recommended for you
            </h2>
            <Link href="#" className="text-sm text-primary hover:text-primary-dark">
              Browse all topics →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOMMENDED_ARTICLES.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-surface-divider p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {article.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-text-primary mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      {article.description}
                    </p>
                    <span className="text-xs text-text-secondary">{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by topic */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
            Browse by topic
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BROWSE_TOPICS.map((topic, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-surface-divider p-5 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-primary">
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-primary mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular articles */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
            Popular articles
          </h2>
          <div className="space-y-4">
            {POPULAR_ARTICLES.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-surface-divider p-5 hover:shadow-md transition cursor-pointer"
              >
                <h3 className="text-base md:text-lg font-semibold text-text-primary mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  {article.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
        {/* Popular topics */}
        <div className="bg-white rounded-xl border border-surface-divider p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Popular topics
          </h3>
          <div className="space-y-2">
            {POPULAR_TOPICS.map((topic) => (
              <Link
                key={topic}
                href="#"
                className="block text-sm text-primary hover:text-primary-dark"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact support */}
        <div className="bg-primary text-white rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-2">24/7 help from our support staff</h3>
          <p className="text-sm text-white/90 mb-4">terratraks00@gmail.com</p>
          <p className="text-xs text-white/80 mb-4">We typically respond within 24-48 hours</p>
          <a
            href="mailto:terratraks00@gmail.com"
            className="inline-flex items-center justify-center w-full rounded-lg bg-white text-primary px-4 py-2.5 text-sm font-semibold hover:bg-white/90 transition"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </a>
        </div>

        {/* Solve your issue */}
        <div className="bg-white rounded-xl border border-surface-divider p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Solve your issue
              </h3>
              <p className="text-sm text-text-secondary">
                Need help fast? Find solutions to common issues here.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
