"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";

export default function Header() {
  const pathname = usePathname();
  const isItineraryPage = pathname?.startsWith("/itinerary/");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareMenu]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
      setShowShareMenu(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My TerraTraks Itinerary",
        text: "Check out my trip itinerary!",
        url: window.location.href,
      });
      setShowShareMenu(false);
    } else {
      // Fallback to copy link if Web Share API not available
      handleCopyLink();
    }
  };

  const handlePDFExport = () => {
    window.print();
    setShowShareMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowShareMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-surface-divider bg-white">
      <div className="w-full flex items-center gap-4 py-4 md:py-5">
        {/* Logo - far left */}
        <Link href="/" className="text-lg md:text-xl font-semibold text-text-primary pl-4 md:pl-6 flex-shrink-0">
          🌲 TerraTraks
        </Link>

        {/* Navigation - centered/far right */}
        <nav className="flex items-center gap-2 ml-auto pr-4 md:pl-6">
          {isItineraryPage ? (
            // Itinerary page navigation
            <>
              <Link
                href="/trips"
                className="text-sm md:text-base text-text-primary hover:bg-surface-divider px-3 py-1.5 rounded-full font-medium"
              >
                My Trips
              </Link>
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="text-sm md:text-base text-text-primary hover:bg-surface-divider px-3 py-1.5 rounded-full font-medium"
                >
                  Share
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-surface-divider shadow-xl z-50 min-w-[180px]">
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-3 text-left text-sm md:text-base text-text-primary hover:bg-surface-background border-b border-surface-divider first:rounded-t-xl"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full px-4 py-3 text-left text-sm md:text-base text-text-primary hover:bg-surface-background border-b border-surface-divider"
                    >
                      Share it
                    </button>
                    <button
                      onClick={handlePDFExport}
                      className="w-full px-4 py-3 text-left text-sm md:text-base text-text-primary hover:bg-surface-background border-b border-surface-divider"
                    >
                      PDF export
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-full px-4 py-3 text-left text-sm md:text-base text-text-primary hover:bg-surface-background last:rounded-b-xl"
                    >
                      Print
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Landing page navigation
            <>
              <Link
                href="/trips"
                className="text-sm md:text-base text-text-primary hover:bg-surface-divider px-3 py-1.5 rounded-full font-medium"
              >
                My Trips
              </Link>
              <Link
                href="/pricing"
                className="text-sm md:text-base text-text-primary hover:bg-surface-divider px-3 py-1.5 rounded-full font-medium"
              >
                Pricing
              </Link>
              <button
                onClick={handleLogin}
                className="text-sm md:text-base text-text-primary hover:bg-surface-divider px-3 py-1.5 rounded-full font-medium"
              >
                Log in
              </button>
              <button
                onClick={handleSignup}
                className="bg-primary text-white font-semibold text-sm md:text-base px-4 py-2 rounded-full hover:bg-primary-dark transition"
              >
                Sign up
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
}

