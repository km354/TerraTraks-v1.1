"use client";

import { useState } from "react";
import Link from "next/link";

type SettingsSection = "account" | "subscription" | "billing" | "trips";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");
  const [fullName, setFullName] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const email = "terratraks00@gmail.com"; // Read-only

  const handleEditName = () => {
    setTempName(fullName || "");
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    setFullName(tempName || null);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setTempName("");
  };

  const menuItems = [
    { id: "account" as SettingsSection, label: "Account", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: "subscription" as SettingsSection, label: "Subscription", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )},
    { id: "billing" as SettingsSection, label: "Billing", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: "trips" as SettingsSection, label: "Trips", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
                Account
              </h2>
              <p className="text-sm text-text-secondary">
                Manage your account information.
              </p>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Profile Information
                </h3>
                <p className="text-sm text-text-secondary">
                  Update your personal information
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full rounded-lg border border-surface-divider pl-10 pr-4 py-2.5 text-sm bg-surface-background text-text-secondary cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1.5">
                  Email cannot be changed.
                </p>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Name
                </label>
                <div className="flex items-center gap-3">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter your name"
                        className="flex-1 rounded-lg border border-surface-divider px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 rounded-lg border border-surface-divider text-sm font-medium hover:bg-surface-background transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm text-text-primary flex-1">
                        {fullName || "Not set"}
                      </span>
                      <button
                        onClick={handleEditName}
                        className="px-4 py-2 rounded-lg border border-surface-divider text-sm font-medium text-text-primary hover:bg-surface-background transition"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Change Password
                </h3>
                <p className="text-sm text-text-secondary">
                  Update your password to keep your account secure
                </p>
              </div>
              <button
                onClick={() => {
                  // TODO: Implement password change
                  console.log("Change password clicked");
                }}
                className="px-4 py-2 rounded-lg border border-surface-divider text-sm font-medium text-text-primary hover:bg-surface-background transition"
              >
                Change Password
              </button>
            </div>

            {/* Delete Account Card */}
            <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-text-secondary">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => {
                  // TODO: Implement account deletion
                  console.log("Delete account clicked");
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        );

      case "subscription":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
                Subscription
              </h2>
              <p className="text-sm text-text-secondary">
                Manage your subscription plan.
              </p>
            </div>

            {/* Current Plan Card */}
            <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Current Plan
                </h3>
                <p className="text-sm text-text-secondary">
                  Your active subscription plan
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-text-primary">Free</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Renewal date: N/A
                  </p>
                </div>
              </div>
            </div>

            {/* Trial Info (if applicable) */}
            <div className="bg-white rounded-xl border border-primary/20 p-6 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-text-primary">
                  No active trial
                </p>
              </div>
            </div>

            {/* Upgrade/Downgrade Options */}
            <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Change Plan
                </h3>
                <p className="text-sm text-text-secondary">
                  Upgrade or downgrade your subscription
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    // TODO: Implement upgrade
                    console.log("Upgrade clicked");
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition"
                >
                  Upgrade to Explorer
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement upgrade to Pro
                    console.log("Upgrade to Pro clicked");
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>

            {/* Cancel Subscription */}
            <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-1">
                  Cancel Subscription
                </h3>
                <p className="text-sm text-text-secondary">
                  Cancel your subscription. You&apos;ll continue to have access until the end of your billing period.
                </p>
              </div>
              <button
                onClick={() => {
                  // TODO: Implement cancellation
                  console.log("Cancel subscription clicked");
                }}
                className="px-4 py-2 rounded-lg border border-red-600 text-red-600 text-sm font-medium hover:bg-red-50 transition"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
                Billing
              </h2>
              <p className="text-sm text-text-secondary">
                Manage your payment methods and billing history.
              </p>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Payment Method
                </h3>
                <p className="text-sm text-text-secondary">
                  Your current payment method
                </p>
              </div>
              <div className="border border-surface-divider rounded-lg p-4 bg-surface-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-text-primary">No payment method on file</p>
                      <p className="text-xs text-text-secondary">Add a payment method to enable subscriptions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: Implement Stripe card component
                      console.log("Update card clicked");
                    }}
                    className="px-4 py-2 rounded-lg border border-surface-divider text-sm font-medium text-text-primary hover:bg-surface-background transition"
                  >
                    Update Card
                  </button>
                </div>
              </div>
            </div>

            {/* Billing History Card */}
            <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Billing History
                </h3>
                <p className="text-sm text-text-secondary">
                  View and download your invoices
                </p>
              </div>
              <div className="border border-surface-divider rounded-lg p-4">
                <p className="text-sm text-text-secondary text-center py-4">
                  No billing history available
                </p>
              </div>
            </div>
          </div>
        );

      case "trips":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
                  Trips
                </h2>
                <p className="text-sm text-text-secondary">
                  Manage your saved itineraries.
                </p>
              </div>
              <Link
                href="/filters"
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition"
              >
                Create New Trip
              </Link>
            </div>

            {/* Trips List */}
            <div className="bg-white rounded-xl border border-surface-divider p-6 space-y-4">
              <div className="space-y-3">
                {/* Example trip item */}
                <div className="border border-surface-divider rounded-lg p-4 hover:bg-surface-background transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-text-primary mb-1">
                        Yellowstone & Grand Teton Adventure
                      </h3>
                      <p className="text-sm text-text-secondary">
                        June 15-20, 2025 • 5 days
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // TODO: Implement edit
                          console.log("Edit trip clicked");
                        }}
                        className="px-3 py-1.5 rounded-lg border border-surface-divider text-sm font-medium text-text-primary hover:bg-surface-background transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement duplicate
                          console.log("Duplicate trip clicked");
                        }}
                        className="px-3 py-1.5 rounded-lg border border-surface-divider text-sm font-medium text-text-primary hover:bg-surface-background transition"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement delete
                          console.log("Delete trip clicked");
                        }}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Empty state */}
                <div className="border border-surface-divider rounded-lg p-8 text-center">
                  <svg className="w-12 h-12 text-text-secondary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-text-secondary mb-2">No trips saved yet</p>
                  <Link
                    href="/filters"
                    className="inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition"
                  >
                    Create Your First Trip
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Page Title */}
      <div className="lg:hidden">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
          Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Left Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="lg:hidden mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            Settings
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your account settings and preferences.
          </p>
        </div>
        <nav className="bg-white rounded-xl border border-surface-divider p-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-primary hover:bg-surface-background"
                }`}
              >
                <span className={isActive ? "text-primary" : "text-text-secondary"}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            );
          })}
          <button
            onClick={() => {
              // TODO: Handle sign out
              console.log("Sign out clicked");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition mt-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="flex-1 text-left">Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Right Content Area */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
