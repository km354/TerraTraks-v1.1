"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/auth/AuthModal";

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-surface-divider bg-white">
      <div className="w-full flex items-center gap-4 py-4 md:py-5">
        {/* Logo - far left */}
        <Link href="/" className="text-lg md:text-xl font-semibold text-text-primary pl-4 md:pl-6 flex-shrink-0">
          🌲 TerraTraks
        </Link>

        {/* Navigation - centered/far right */}
        <nav className="flex items-center gap-2 ml-auto pr-4 md:pr-6">
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

