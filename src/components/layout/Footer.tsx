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
              className="text-sm text-text-primary hover:text-brand-primary"
            >
              Home
            </Link>
            <Link
              href="/trips"
              className="text-sm text-text-primary hover:text-brand-primary"
            >
              Your Trips
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-text-primary hover:text-brand-primary"
            >
              Pricing
            </Link>
          </div>

          {/* Right text */}
          <p className="text-sm text-text-primary">
            Proud supporter of the National Park Service and National Park Foundation.
          </p>
        </div>

        {/* Bottom row */}
        <div className="text-xs md:text-sm text-text-secondary flex flex-wrap gap-4 justify-between">
          <span>© TerraTraks Inc. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/legal/terms"
              className="hover:text-text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/risk"
              className="hover:text-text-primary"
            >
              Risk & Medical Disclaimer
            </Link>
            <Link
              href="/legal/accessibility"
              className="hover:text-text-primary"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

