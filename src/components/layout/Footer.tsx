"use client";

import Link from "next/link";

export default function Footer() {

  return (
    <footer className="border-t border-surface-divider bg-surface-background mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Three Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* TerraTraks Column */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-text-primary">
              TerraTraks
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI-powered national park itinerary planner. Plan your perfect adventure in seconds.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-text-primary">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm text-text-secondary hover:text-primary transition"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-text-secondary hover:text-primary transition"
              >
                Pricing
              </Link>
              <Link
                href="/trips"
                className="text-sm text-text-secondary hover:text-primary transition"
              >
                My Trips
              </Link>
            </nav>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-text-primary">
              Resources
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/support"
                className="text-sm text-text-secondary hover:text-primary transition"
              >
                Support
              </Link>
              <a
                href="https://www.nps.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-primary transition"
              >
                National Park Service
              </a>
              <a
                href="https://www.nationalparks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-primary transition"
              >
                National Park Foundation
              </a>
            </nav>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-surface-divider my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-text-secondary">
          <span>© 2025 TerraTraks. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/legal/terms"
              className="hover:text-primary transition"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-primary transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/risk"
              className="hover:text-primary transition"
            >
              Risk, Medical & AI Disclaimers
            </Link>
            <Link
              href="/legal/accessibility"
              className="hover:text-primary transition"
            >
              Accessibility
            </Link>
            <Link
              href="/legal/affiliate"
              className="hover:text-primary transition"
            >
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
