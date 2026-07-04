'use client';

import React from 'react';
import { Settings, 
  Map, 
  Database, 
  Lock, 
  Eye, 
  RefreshCw, ArrowLeft } from 'lucide-react';

interface SettingsViewProps {
  onResetAllData: () => void;
}

export default function SettingsView({ onResetAllData, setView }: SettingsViewProps & { setView?: any }) {
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Success: Local simulator configurations saved!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {setView && (
            <button
              onClick={() => setView('dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans">System Settings</h2>
            <p className="text-sm text-slate-500 font-medium">Control geofencing parameters, customize layout options, and purge cache</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Refresh Data"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Form Settings */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" /> General Simulator Options
          </h3>

          <form onSubmit={handleSaveSettings} className="mt-6 space-y-4 text-sm">
            {/* Mock Company */}
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400">Mock Corporate Company</label>
              <select className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                <option value="RSGL">Rajasthan State Gas Limited (HQ Jaipur)</option>
                <option value="RSGL">Rajasthan State Gas Limited (HQ Kota)</option>
              </select>
            </div>

            {/* Geofencing Range Override */}
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400">Geofence Allowance Radius (HQ)</label>
              <select className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                <option value="150">150 Meters (Standard)</option>
                <option value="500">500 M (Flexible)</option>
                <option value="0">Disabled (Universal check-in allowed)</option>
              </select>
            </div>

            {/* Simulated GPS coordinates defaults */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400">Simulated HQ Latitude</label>
                <input 
                  type="text" 
                  defaultValue="12.9716" 
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400">Simulated HQ Longitude</label>
                <input 
                  type="text" 
                  defaultValue="77.5946" 
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <button
              type="submit"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-transform active:scale-95"
            >
              Save System Defaults
            </button>
          </form>
        </div>

        {/* Right Column: Database purging options */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 space-y-6">
          {/* Card: Roster guidelines */}
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
              <Database className="h-4.5 w-4.5 text-blue-500" /> Database Administration
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-5">
              Reset employee records, logs state, applied leaves, shift maps, and payroll transactions back to initial installation states.
            </p>
            <button
              onClick={onResetAllData}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-red-650 px-4 py-2.5 font-bold text-white shadow-md hover:bg-red-700 transition-transform active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Reset All Roster Logs
            </button>
          </div>

          {/* Card: Security info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-blue-500" /> System Security
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-5">
              This terminal is running in Mock HRMS Developer simulation. Session data is persisted inside browser local state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
