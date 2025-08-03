"use client";
import React, { useState } from "react";
import Header from "./header";

const DEFAULT_SETTINGS = {
  autoFundingEnabled: false,
  monthlyGoal: 50000,
  maxFeeRate: 2.5,
  minimumInvoiceAmount: 1000,
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

export default function AutoFundingSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleNotification = (type) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/invoices/auto-funding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Save failed");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
      <Header activePage="auto-funding-settings" />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-bold font-montserrat text-[#1e293b]">
            Auto-Funding Settings
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg">
              Settings saved successfully!
            </div>
          )}

          {/* Toggle Auto-Funding */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#1e293b]">
                Enable Auto-Funding
              </h2>
              <p className="text-[#475569]">
                Automatically fund eligible invoices that meet your criteria.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoFundingEnabled}
                onChange={(e) =>
                  updateSetting("autoFundingEnabled", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-checked:bg-[#3b82f6] rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-6 after:w-6 after:rounded-full after:transition-transform peer-checked:after:translate-x-7" />
            </label>
          </div>

          {/* Funding Goals */}
          <div>
            <h2 className="text-xl font-semibold text-[#1e293b] mb-4">
              Funding Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Monthly Funding Goal",
                  value: settings.monthlyGoal,
                  key: "monthlyGoal",
                },
                {
                  label: "Minimum Invoice Amount",
                  value: settings.minimumInvoiceAmount,
                  key: "minimumInvoiceAmount",
                },
              ].map(({ label, value, key }) => (
                <div key={key}>
                  <label className="block text-[#475569] mb-2">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[#475569]">
                      $
                    </span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        updateSetting(key, Number(e.target.value))
                      }
                      className="w-full pl-8 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Rate */}
          <div>
            <h2 className="text-xl font-semibold text-[#1e293b] mb-4">
              Fee Rate Settings
            </h2>
            <label className="block text-[#475569] mb-2">
              Maximum Acceptable Fee Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.maxFeeRate}
              onChange={(e) =>
                updateSetting("maxFeeRate", Number(e.target.value))
              }
              className="w-full md:w-1/2 px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none"
            />
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-xl font-semibold text-[#1e293b] mb-4">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([type, value]) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleNotification(type)}
                    className="rounded border-[#e2e8f0] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  <span className="ml-3 capitalize text-[#475569]">
                    {type} Notifications
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-[#e2e8f0]">
            <button
              onClick={saveSettings}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-save mr-2"></i>
              )}
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
