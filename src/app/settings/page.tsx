"use client";

import { useState } from "react";

type SettingsSection = "account" | "subscription" | "billing" | "itineraries" | "notifications" | "security";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");
  const [fullName, setFullName] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const email = "terratraks00@gmail.com"; // Read-only
  const accountCreated = "November 12, 2025";

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
    { id: "itineraries" as SettingsSection, label: "Itineraries", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { id: "notifications" as SettingsSection, label: "Notifications", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
    { id: "security" as SettingsSection, label: "Security", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
                  Update your personal information and account details
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
                  Full Name
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-primary flex-1">
                    {fullName || "Not set"}
                  </span>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="rounded-lg border border-surface-divider px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 rounded-lg border border-surface-divider text-sm font-medium hover:bg-surface-background transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditName}
                      className="px-3 py-1.5 rounded-lg border border-surface-divider text-sm font-medium text-text-primary hover:bg-surface-background transition"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Account Created */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Account Created
                </label>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-text-primary">{accountCreated}</span>
                </div>
              </div>
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
            <div className="bg-white rounded-xl border border-surface-divider p-6">
              <p className="text-sm text-text-secondary">Subscription content coming soon...</p>
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
                Manage your billing information.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-surface-divider p-6">
              <p className="text-sm text-text-secondary">Billing content coming soon...</p>
            </div>
          </div>
        );

      case "itineraries":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
                Itineraries
              </h2>
              <p className="text-sm text-text-secondary">
                Manage your itinerary preferences.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-surface-divider p-6">
              <p className="text-sm text-text-secondary">Itineraries content coming soon...</p>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
                Notifications
              </h2>
              <p className="text-sm text-text-secondary">
                Manage your notification preferences.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-surface-divider p-6">
              <p className="text-sm text-text-secondary">Notifications content coming soon...</p>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
                Security
              </h2>
              <p className="text-sm text-text-secondary">
                Manage your security settings.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-surface-divider p-6">
              <p className="text-sm text-text-secondary">Security content coming soon...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
