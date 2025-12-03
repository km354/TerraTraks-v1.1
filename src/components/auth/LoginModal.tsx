"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement Supabase auth
    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    //   });
    //   if (error) throw error;
    //   onClose();
    // } catch (error) {
    //   console.error("Login error:", error);
    // } finally {
    //   setIsLoading(false);
    // }

    // Mock implementation
    console.log("Login attempt:", { email, password });
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-card p-6 md:p-8 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
            Log in
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-gray-900 text-xl font-semibold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-surface-divider px-3 py-2 text-base focus:outline-none focus:border-secondary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-surface-divider px-3 py-2 text-base focus:outline-none focus:border-secondary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

