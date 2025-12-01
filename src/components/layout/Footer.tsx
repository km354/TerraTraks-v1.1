import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-surface-divider bg-surface-background mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left links */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="text-sm text-text-slate hover:text-brand-forest"
            >
              Home
            </Link>
            <Link
              href="/trips"
              className="text-sm text-text-slate hover:text-brand-forest"
            >
              Your Trips
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-text-slate hover:text-brand-forest"
            >
              Pricing
            </Link>
          </div>

          {/* Right text */}
          <p className="text-sm text-text-slate">
            Proud supporter of the National Park Service and National Park Foundation.
          </p>
        </div>

        {/* Bottom row */}
        <div className="text-xs md:text-sm text-gray-500 flex flex-wrap gap-4 justify-between">
          <span>© TerraTraks Inc. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/legal/terms"
              className="hover:text-text-slate"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-text-slate"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/risk"
              className="hover:text-text-slate"
            >
              Risk & Medical Disclaimer
            </Link>
            <Link
              href="/legal/accessibility"
              className="hover:text-text-slate"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

