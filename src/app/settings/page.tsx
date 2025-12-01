"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email] = useState("john.doe@example.com"); // Read-only
  const [timezone, setTimezone] = useState("America/Denver");
  const [collaboration, setCollaboration] = useState("only-me");
  const [emailAlerts, setEmailAlerts] = useState({
    newItinerary: true,
    parkAlerts: true,
    tripReminders: true,
  });

  const handleSave = () => {
    // TODO: Save settings to Supabase
    console.log("Settings saved", {
      name,
      timezone,
      collaboration,
      emailAlerts,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
        Settings
      </h1>

      {/* Account Section */}
      <section className="bg-white rounded-xl border border-surface-divider p-4 md:p-6 space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Account
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base bg-surface-background text-text-secondary cursor-not-allowed"
            />
            <p className="text-xs text-text-secondary mt-1">
              Email cannot be changed at this time
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Time Zone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-surface-divider px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black/20 bg-white"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Anchorage">Alaska Time (AKT)</option>
              <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Subscription & Billing Section */}
      <section className="bg-white rounded-xl border border-surface-divider p-4 md:p-6 space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Subscription & Billing
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm md:text-base text-text-primary mb-2">
              Current Plan: <span className="font-medium">Free</span>
            </p>
            <p className="text-xs text-text-secondary">
              Upgrade to unlock premium features
            </p>
          </div>
          <button
            onClick={() => {
              // TODO: Navigate to billing or open upgrade modal
              console.log("Manage subscription clicked");
            }}
            className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm md:text-base font-medium hover:bg-brand-hover transition"
          >
            Manage subscription
          </button>
        </div>
      </section>

      {/* Itinerary Collaboration Section */}
      <section className="bg-white rounded-xl border border-surface-divider p-4 md:p-6 space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Itinerary Collaboration
        </h2>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="collaboration"
              value="only-me"
              checked={collaboration === "only-me"}
              onChange={(e) => setCollaboration(e.target.value)}
              className="mt-1 w-4 h-4 text-brand-primary focus:ring-brand-primary"
            />
            <div>
              <span className="text-sm md:text-base font-medium text-text-primary">
                Only me can edit
              </span>
              <p className="text-xs text-text-secondary mt-1">
                You are the only one who can make changes to your itineraries
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="collaboration"
              value="link-suggest"
              checked={collaboration === "link-suggest"}
              onChange={(e) => setCollaboration(e.target.value)}
              className="mt-1 w-4 h-4 text-brand-primary focus:ring-brand-primary"
            />
            <div>
              <span className="text-sm md:text-base font-medium text-text-primary">
                People with a link can suggest changes
              </span>
              <p className="text-xs text-text-secondary mt-1">
                Others can view and suggest edits, but you approve all changes
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="collaboration"
              value="collaborators-edit"
              checked={collaboration === "collaborators-edit"}
              onChange={(e) => setCollaboration(e.target.value)}
              className="mt-1 w-4 h-4 text-brand-primary focus:ring-brand-primary"
            />
            <div>
              <span className="text-sm md:text-base font-medium text-text-primary">
                Collaborators can edit
              </span>
              <p className="text-xs text-text-secondary mt-1">
                Invited collaborators can directly edit your itineraries
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-white rounded-xl border border-surface-divider p-4 md:p-6 space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Notifications
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm md:text-base font-medium text-text-primary">
                New itinerary
              </span>
              <p className="text-xs text-text-secondary">
                Get notified when a new itinerary is created
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts.newItinerary}
              onChange={(e) =>
                setEmailAlerts((prev) => ({
                  ...prev,
                  newItinerary: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-surface-divider text-brand-primary focus:ring-brand-primary"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm md:text-base font-medium text-text-primary">
                Park alerts
              </span>
              <p className="text-xs text-text-secondary">
                Receive alerts about closures and important park updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts.parkAlerts}
              onChange={(e) =>
                setEmailAlerts((prev) => ({
                  ...prev,
                  parkAlerts: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-surface-divider text-brand-primary focus:ring-brand-primary"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm md:text-base font-medium text-text-primary">
                Trip reminders
              </span>
              <p className="text-xs text-text-secondary">
                Get reminders before your trip starts
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts.tripReminders}
              onChange={(e) =>
                setEmailAlerts((prev) => ({
                  ...prev,
                  tripReminders: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-surface-divider text-brand-primary focus:ring-brand-primary"
            />
          </label>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white rounded-xl border border-surface-divider p-4 md:p-6 space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Security
        </h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              // TODO: Open change password modal
              console.log("Change password clicked");
            }}
            className="px-4 py-2 rounded-lg border border-surface-divider bg-white text-sm md:text-base font-medium text-text-primary hover:bg-surface-background transition"
          >
            Change password
          </button>
          <button
            onClick={() => {
              // TODO: Open 2FA setup
              console.log("Enable 2FA clicked");
            }}
            className="px-4 py-2 rounded-lg border border-surface-divider bg-white text-sm md:text-base font-medium text-text-primary hover:bg-surface-background transition"
          >
            Enable 2FA
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-brand-primary text-white text-sm md:text-base font-medium hover:bg-brand-hover transition"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
