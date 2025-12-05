"use client";

import { useState, useEffect } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleSignup = async (e: React.FormEvent) => {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement Supabase password reset
    // try {
    //   const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //     redirectTo: `${window.location.origin}/reset-password`,
    //   });
    //   if (error) throw error;
    //   setResetEmailSent(true);
    // } catch (error) {
    //   console.error("Password reset error:", error);
    //   alert("Failed to send reset email. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }

    // Mock implementation
    console.log("Password reset request:", { email });
    setTimeout(() => {
      setIsLoading(false);
      setResetEmailSent(true);
    }, 500);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      // Reset state when closing
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setName("");
      setConfirmPassword("");
      setResetEmailSent(false);
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setResetEmailSent(false);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-card p-6 md:p-8 mx-4">
        {/* Toggle between Login and Signup - Only show when not in forgot password mode */}
        {mode !== "forgot" && (
          <div className="flex items-center justify-center mb-6 relative">
            <div className="flex gap-1 bg-surface-divider rounded-lg p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  mode === "login"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  mode === "signup"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Sign up
              </button>
            </div>
            <button
              onClick={handleBackdropClick}
              className="absolute right-0 text-text-secondary hover:text-gray-900 text-xl font-semibold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}

        {/* Close button for forgot password mode */}
        {mode === "forgot" && (
          <div className="flex items-center justify-end mb-6">
            <button
              onClick={handleBackdropClick}
              className="text-text-secondary hover:text-gray-900 text-xl font-semibold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}

        {/* Forgot Password View */}
        {mode === "forgot" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-2">
                Reset password
              </h2>
              <p className="text-sm text-text-secondary">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {resetEmailSent ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    If an account exists with that email, we&apos;ve sent a password reset link.
                  </p>
                </div>
                <button
                  onClick={() => switchMode("login")}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary-dark transition"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-surface-divider px-3 py-2 text-base focus:outline-none focus:border-secondary"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="w-full text-sm text-text-secondary hover:text-text-primary"
                >
                  Back to login
                </button>
              </form>
            )}
          </div>
        ) : mode === "login" ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-6 text-center">
              Welcome back
            </h2>

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
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  Forgot password?
                </button>
              </div>
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

            <p className="text-sm text-center text-text-secondary">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign up
              </button>
            </p>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup} className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-6">
              Create your account
            </h2>

            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-surface-divider px-3 py-2 text-base focus:outline-none focus:border-secondary"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Email
              </label>
              <input
                id="signup-email"
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
                htmlFor="signup-password"
                className="block text-sm font-medium text-text-primary mb-2"
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
                className="w-full rounded-xl border border-surface-divider px-3 py-2 text-base focus:outline-none focus:border-secondary"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-text-secondary">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-sm font-medium text-text-primary mb-2"
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
                className="w-full rounded-xl border border-surface-divider px-3 py-2 text-base focus:outline-none focus:border-secondary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-sm text-center text-text-secondary">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

