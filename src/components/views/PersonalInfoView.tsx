'use client';

import React, { useState } from 'react';
import { User, MapPin, Phone, GraduationCap, Lock, Save, X, Edit3, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PersonalInfoView({ setView }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'address' | 'emergency' | 'qualifications'>('details');

  // Form states
  const [maritalStatus, setMaritalStatus] = useState('Married');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [currentAddress, setCurrentAddress] = useState('Flat 402, Royal Residency, Indiranagar, Bangalore, KA - 560038');
  const [permanentAddress, setPermanentAddress] = useState('HN-124, Shanti Nagar, Sector-4, Jaipur, RJ - 302015');
  const [emergencyName, setEmergencyName] = useState('Kavita Tiwari');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210');

  const handleSave = () => {
    setIsEditing(false);
    alert('Changes saved successfully (Simulation).');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to defaults
    setMaritalStatus('Married');
    setBloodGroup('B+');
    setCurrentAddress('Flat 402, Royal Residency, Indiranagar, Bangalore, KA - 560038');
    setPermanentAddress('HN-124, Shanti Nagar, Sector-4, Jaipur, RJ - 302015');
    setEmergencyName('Kavita Tiwari');
    setEmergencyRelation('Spouse');
    setEmergencyPhone('+91 98765 43210');
  };

  return (
    <div className="space-y-6">
      {/* Header card with Profile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-[#1a3b38] dark:bg-emerald-900/20 text-white dark:text-emerald-450 flex items-center justify-center text-2xl font-bold shadow-md">
              VK
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Vijay Kumar Tiwari</h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Chief Executive Officer</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-medium">
                <span>Employee Code: <strong className="text-slate-600 dark:text-slate-300">EMP-001</strong></span>
                <span>•</span>
                <span>Type: <strong className="text-slate-600 dark:text-slate-300">Permanent (Full Time)</strong></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Details</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'details', label: 'Personal Details', icon: User },
          { id: 'address', label: 'Addresses', icon: MapPin },
          { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
          { id: 'qualifications', label: 'Qualifications', icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1a3b38] text-white dark:bg-emerald-500 dark:text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Identity & Demographic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Date of Birth</label>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">15 March 1985 (41 Years)</p>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Gender</label>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Male</p>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nationality</label>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Indian</p>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Marital Status</label>
                {isEditing ? (
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{maritalStatus}</p>
                )}
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Blood Group</label>
                {isEditing ? (
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{bloodGroup}</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-slate-400" />
                Govt Regd IDs & Compliance (Locked)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">PAN Card Number</label>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <span>•••••4981C</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Masked</span>
                  </p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Aadhaar Card Number</label>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <span>•••• •••• 9821</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Masked</span>
                  </p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">UAN / PF Account Number</label>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">100239485764</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 italic font-normal">
                Note: Regulated fields and Government IDs are restricted for compliance. Contact the HR Administrator to raise a revision request.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current Address */}
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Current Correspondence Address</label>
                {isEditing ? (
                  <textarea
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    rows={3}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none resize-none"
                  />
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">{currentAddress}</p>
                )}
              </div>

              {/* Permanent Address */}
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Permanent Address (As in UIDAI)</label>
                {isEditing ? (
                  <textarea
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    rows={3}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none resize-none"
                  />
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">{permanentAddress}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Primary Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Contact Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{emergencyName}</p>
                )}
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Relationship</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{emergencyRelation}</p>
                )}
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Mobile Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{emergencyPhone}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qualifications' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Educational Qualifications</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/10">
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Degree / Qualification</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Institution / University</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Passing Year</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Grade / Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                  <tr>
                    <td className="px-4 py-3.5">MBA in General Management</td>
                    <td className="px-4 py-3.5 font-normal">Indian Institute of Management (IIM) Ahmedabad</td>
                    <td className="px-4 py-3.5 font-normal">2009</td>
                    <td className="px-4 py-3.5">8.4 CGPA</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5">B.Tech in Computer Science</td>
                    <td className="px-4 py-3.5 font-normal">Malaviya National Institute of Technology (MNIT) Jaipur</td>
                    <td className="px-4 py-3.5 font-normal">2007</td>
                    <td className="px-4 py-3.5">82.5%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5">Higher Secondary Education</td>
                    <td className="px-4 py-3.5 font-normal">Rajasthan State Board School</td>
                    <td className="px-4 py-3.5 font-normal">2003</td>
                    <td className="px-4 py-3.5">91.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
