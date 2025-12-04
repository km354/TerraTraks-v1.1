"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="border-t border-surface-divider bg-surface-background mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Four Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
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

          {/* Stay Updated Column */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-text-primary">
              Stay Updated
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Get travel tips and park updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 rounded-lg border border-surface-divider px-3 py-2 text-sm bg-white text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-primary text-white px-4 py-2 hover:bg-primary-dark transition flex items-center justify-center"
                aria-label="Subscribe"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-surface-divider my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-text-secondary">
          <span>© 2025 TerraTraks Inc. All rights reserved.</span>
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
              Risk & Medical Disclaimers
            </Link>
            <Link
              href="/legal/accessibility"
              className="hover:text-primary transition"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
