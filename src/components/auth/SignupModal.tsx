"use client";

import { useState } from "react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // TODO: Implement Supabase auth
    // try {
    //   const { data, error } = await supabase.auth.signUp({
    //     email,
    //     password,
    //     options: {
    //       data: {
    //         name,
    //       },
    //     },
    //   });
    //   if (error) throw error;
    //   onClose();
    // } catch (error) {
    //   console.error("Signup error:", error);
    // } finally {
    //   setIsLoading(false);
    // }

    // Mock implementation
    console.log("Signup attempt:", { name, email, password });
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
          <h2 className="text-xl md:text-2xl font-semibold text-text-slate">
            Create account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-xl font-semibold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="block text-sm font-medium text-text-slate mb-2"
            >
              Name
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest/60"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-text-slate mb-2"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest/60"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-text-slate mb-2"
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest/60"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-sm font-medium text-text-slate mb-2"
            >
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest/60"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-brand-forest text-white text-base font-semibold hover:bg-brand-sage transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

