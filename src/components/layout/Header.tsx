"use client";

import { useState } from "react";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignupOpen(true);
  };

  return (
    <header className="border-b border-surface-divider bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-semibold text-text-primary">
          🌲 TerraTraks
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
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

      {/* Auth Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </header>
  );
}

