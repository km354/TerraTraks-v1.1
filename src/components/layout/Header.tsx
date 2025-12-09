"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isItineraryPage = pathname?.startsWith("/itinerary/");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth check from Supabase
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  // Close share menu and profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
        setShowLogoutConfirm(false);
      }
    };

    if (showShareMenu || showProfileDropdown || showLogoutConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareMenu, showProfileDropdown, showLogoutConfirm]);

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
            // Itinerary page navigation - My Trips, Share, and Profile Picture
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
              {/* Profile picture in top right for itinerary pages */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-surface-divider hover:border-primary transition-colors group"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-background flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Pencil icon on hover */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-tl-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-surface-divider shadow-xl w-48 overflow-hidden z-50">
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          setShowLogoutConfirm(true);
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm md:text-base text-text-primary hover:bg-surface-background transition"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            router.push("/settings");
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm md:text-base text-text-primary hover:bg-surface-background transition border-b border-surface-divider"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            setAuthMode("login");
                            setIsAuthOpen(true);
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm md:text-base text-text-primary hover:bg-surface-background transition"
                        >
                          Login
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Logout Confirmation */}
                {showLogoutConfirm && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-surface-divider shadow-xl p-4 w-64 z-50">
                    <p className="text-sm md:text-base text-text-primary mb-4">
                      Are you sure you want to logout?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setShowLogoutConfirm(false);
                          // TODO: Call Supabase auth.signOut() here
                          console.log("User logged out");
                        }}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition text-sm md:text-base font-medium"
                      >
                        Yes, logout
                      </button>
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 bg-surface-background text-text-primary px-4 py-2 rounded-lg hover:bg-surface-divider transition text-sm md:text-base font-medium"
                      >
                        Cancel
                      </button>
                    </div>
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

