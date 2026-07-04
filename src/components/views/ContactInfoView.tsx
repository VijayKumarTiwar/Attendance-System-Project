'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Settings, Plus, Star, Link2, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ContactInfoView({ setView }: any) {
  const [isEditing, setIsEditing] = useState(false);

  // Contact States
  const [workEmail, setWorkEmail] = useState('vijay.tiwari@rsgl.rajasthan.gov.in');
  const [workPhone, setWorkPhone] = useState('+91 141 2740265');
  const [extension, setExtension] = useState('201');
  const [workLocation, setWorkLocation] = useState('Jaipur HQ, Rajasthan');
  
  const [personalEmail, setPersonalEmail] = useState('vijay.tiwari.official@gmail.com');
  const [personalMobile, setPersonalMobile] = useState('+91 94140 12345');
  
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefSMS, setPrefSMS] = useState(false);
  const [prefApp, setPrefApp] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
    alert('Contact details updated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Contact Information</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your work and personal touchpoints and preferences</p>
        </div>
        <button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className="bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-md transition-colors w-fit"
        >
          {isEditing ? 'Save Contact Info' : 'Edit Contact Info'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Contacts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-500" />
            Official Directory Touchpoints
          </h2>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Official Government Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                />
              ) : (
                <a href={`mailto:${workEmail}`} className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline">{workEmail}</a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Work Desk Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={workPhone}
                    onChange={(e) => setWorkPhone(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{workPhone}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">EPABX Desk Ext</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{extension}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Official Base Office</label>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{workLocation}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Personal Contacts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-500" />
            Personal Emergency Contact Details
          </h2>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Private Email ID</label>
              {isEditing ? (
                <input
                  type="email"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                />
              ) : (
                <a href={`mailto:${personalEmail}`} className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline">{personalEmail}</a>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Personal Mobile Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={personalMobile}
                  onChange={(e) => setPersonalMobile(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{personalMobile}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Social Directory Sync</label>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Link2 className="h-3.5 w-3.5" />
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">linkedin.com/in/vijay-tiwari-ceo</a>
              </div>
            </div>
          </div>
        </div>

        {/* Communication preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4 md:col-span-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Settings className="h-4 w-4 text-emerald-500" />
            Communication Alert Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Email Notifications</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Approve and payroll updates via official email</p>
              </div>
              <input
                type="checkbox"
                checked={prefEmail}
                onChange={(e) => setPrefEmail(e.target.checked)}
                disabled={!isEditing}
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">SMS / Mobile Alerts</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Critical leave and check-in failures via text</p>
              </div>
              <input
                type="checkbox"
                checked={prefSMS}
                onChange={(e) => setPrefSMS(e.target.checked)}
                disabled={!isEditing}
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">In-App Push Alerts</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Real-time notifications and action feeds</p>
              </div>
              <input
                type="checkbox"
                checked={prefApp}
                onChange={(e) => setPrefApp(e.target.checked)}
                disabled={!isEditing}
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />
              Secondary / Backup Contact Grid
            </h2>
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Contact</span>
            </button>
          </div>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Relationship</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Number</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                <tr>
                  <td className="px-4 py-3.5">Rajesh Kumar Tiwari</td>
                  <td className="px-4 py-3.5 font-normal">Brother</td>
                  <td className="px-4 py-3.5 font-normal">+91 94140 54321</td>
                  <td className="px-4 py-3.5 font-normal">rajesh.tiwari@gmail.com</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5">Shanti Devi Tiwari</td>
                  <td className="px-4 py-3.5 font-normal">Mother</td>
                  <td className="px-4 py-3.5 font-normal">+91 94140 98765</td>
                  <td className="px-4 py-3.5 font-normal">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
