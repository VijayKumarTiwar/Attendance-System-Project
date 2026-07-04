'use client';

import React, { useState } from 'react';
import { ClipboardList, ShieldAlert, Award, Sliders, Edit, Plus, X, Check, ArrowLeft, RefreshCw } from 'lucide-react';
import { initialLeavePolicies, initialLeaveBalances, LeavePolicy, LeaveBalance } from '../../utils/mockData';

export default function LeavePoliciesView({ setView }: any) {
  const [policies, setPolicies] = useState<LeavePolicy[]>(initialLeavePolicies);
  const [balances, setBalances] = useState<LeaveBalance[]>(initialLeaveBalances);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicy | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formAnnualDays, setFormAnnualDays] = useState(12);
  const [formMaxConsecutive, setFormMaxConsecutive] = useState(3);
  const [formCarryForward, setFormCarryForward] = useState(false);
  const [formMaxCF, setFormMaxCF] = useState(0);
  const [formEncashable, setFormEncashable] = useState(false);
  const [formGender, setFormGender] = useState<'All' | 'Female'>('All');

  const handleEditClick = (policy: LeavePolicy) => {
    setSelectedPolicy(policy);
    setFormName(policy.name);
    setFormCode(policy.code);
    setFormAnnualDays(policy.annualDays);
    setFormMaxConsecutive(policy.maxConsecutive);
    setFormCarryForward(policy.carryForward);
    setFormMaxCF(policy.maxCarryForward);
    setFormEncashable(policy.encashable);
    setFormGender(policy.applicableGender);
    setShowEditModal(true);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    setPolicies(prev => prev.map(p => p.id === selectedPolicy.id ? {
      ...p,
      name: formName,
      code: formCode.toUpperCase(),
      annualDays: Number(formAnnualDays),
      maxConsecutive: Number(formMaxConsecutive),
      carryForward: formCarryForward,
      maxCarryForward: Number(formMaxCF),
      encashable: formEncashable,
      applicableGender: formGender,
    } : p));

    setShowEditModal(false);
    alert('Leave policy updated.');
  };

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) return;

    const newPolicy: LeavePolicy = {
      id: `LP-0${policies.length + 1}`,
      name: formName,
      code: formCode.toUpperCase(),
      annualDays: Number(formAnnualDays),
      maxConsecutive: Number(formMaxConsecutive),
      carryForward: formCarryForward,
      maxCarryForward: Number(formMaxCF),
      encashable: formEncashable,
      applicableGender: formGender,
      color: 'indigo',
    };

    setPolicies(prev => [...prev, newPolicy]);
    setShowAddModal(false);
    setFormName('');
    setFormCode('');
    alert('New leave policy type added.');
  };

  const handleAdjustBalance = (empId: string, type: 'cl' | 'el' | 'sl') => {
    const valStr = prompt('Enter new allocated balance count:');
    if (valStr === null) return;
    const val = Number(valStr);
    if (isNaN(val)) return;

    setBalances(prev => prev.map(b => {
      if (b.employeeId === empId) {
        return {
          ...b,
          [type]: { ...b[type], allocated: val }
        };
      }
      return b;
    }));
  };

  const getBorderColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-l-blue-500';
      case 'green': return 'border-l-emerald-500';
      case 'red': return 'border-l-red-500';
      case 'pink': return 'border-l-pink-500';
      case 'amber': return 'border-l-amber-500';
      default: return 'border-l-slate-450';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Policy Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage statutory leave allocations, accrual guidelines, encashment, and balances</p>
        </div>
        <button
          onClick={() => {
            setFormName('');
            setFormCode('');
            setFormAnnualDays(12);
            setFormMaxConsecutive(3);
            setFormCarryForward(false);
            setFormMaxCF(0);
            setFormEncashable(false);
            setFormGender('All');
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-md transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add Leave Type</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leave Types', count: policies.length, border: 'border-l-slate-500' },
          { label: 'Max Annual Leaves', count: 42, border: 'border-l-emerald-500' },
          { label: 'Covered Employees', count: balances.length, border: 'border-l-blue-500' },
          { label: 'Pending Encashment', count: 2, border: 'border-l-amber-500' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm border-l-4 ${stat.border}`}>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Leave Types grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configured Leave Allocations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-3xl shadow-sm border-l-4 ${getBorderColor(policy.color)} flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{policy.name}</h3>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-450 px-2 py-0.5 rounded font-mono font-bold uppercase">{policy.code}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-[11px] font-semibold text-slate-500">
                  <div>
                    <span className="text-slate-400 block font-normal text-[10px]">Annual Allocation</span>
                    <span className="text-slate-700 dark:text-slate-200">{policy.annualDays} Days</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal text-[10px]">Max Consecutive</span>
                    <span className="text-slate-700 dark:text-slate-200">{policy.maxConsecutive} Days</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal text-[10px]">Carry Forward</span>
                    <span className="text-slate-700 dark:text-slate-200">{policy.carryForward ? `Yes (Max ${policy.maxCarryForward})` : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal text-[10px]">Applicable Gender</span>
                    <span className="text-slate-700 dark:text-slate-200">{policy.applicableGender}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800/60 mt-4 pt-3 flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Encashable: {policy.encashable ? 'Yes' : 'No'}</span>
                <button
                  onClick={() => handleEditClick(policy)}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450 hover:underline"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit Policy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Rules block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="h-4.5 w-4.5 text-emerald-500" />
          HR Statutory Attendance Compliance Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-normal">
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Minimum Notice Period:</strong> Earned/Privilege leave requires at least 3 days advance notice. Casual leave requires 1 day.</li>
            <li><strong>Weekend Counting:</strong> Public holidays and weekly off days occurring within a continuous leave period do not count towards leave duration.</li>
          </ul>
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Sandwich Leave Rule:</strong> If an employee applies for leave on Friday and Monday, the intermediate weekend days are counted as leaves.</li>
            <li><strong>Half-Day Leaves:</strong> Allowed for Casual Leave (CL) and Sick Leave (SL) only. Not allowed for Privilege/Earned leaves.</li>
          </ul>
        </div>
      </div>

      {/* Leave balance allocations table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="h-4.5 w-4.5 text-emerald-500" />
          Direct Employee Balance Allocation Controls
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Employee Name</th>
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider text-center">Casual Leave (CL)</th>
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider text-center">Earned / Privilege (EL)</th>
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider text-center">Sick Leave (SL)</th>
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider text-center">Manual Adjustments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
              {balances.map((row) => (
                <tr key={row.employeeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                  <td className="px-4 py-3.5">{row.employeeName}</td>
                  <td className="px-4 py-3.5 text-center font-normal">
                    <strong className="text-slate-800 dark:text-white">{row.cl.allocated - row.cl.used}</strong> / {row.cl.allocated} days
                  </td>
                  <td className="px-4 py-3.5 text-center font-normal">
                    <strong className="text-slate-800 dark:text-white">{row.el.allocated - row.el.used}</strong> / {row.el.allocated} days
                  </td>
                  <td className="px-4 py-3.5 text-center font-normal">
                    <strong className="text-slate-800 dark:text-white">{row.sl.allocated - row.sl.used}</strong> / {row.sl.allocated} days
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleAdjustBalance(row.employeeId, 'cl')}
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] transition-all mr-1.5"
                    >
                      Adj CL
                    </button>
                    <button
                      onClick={() => handleAdjustBalance(row.employeeId, 'el')}
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] transition-all"
                    >
                      Adj EL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Policy Modal */}
      {showEditModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Edit Policy: {selectedPolicy.name}</h3>
            <form onSubmit={handleSavePolicy} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Policy Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Annual Days</label>
                  <input
                    type="number"
                    required
                    value={formAnnualDays}
                    onChange={(e) => setFormAnnualDays(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Max Consecutive</label>
                  <input
                    type="number"
                    required
                    value={formMaxConsecutive}
                    onChange={(e) => setFormMaxConsecutive(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Applicable Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="All">All</option>
                    <option value="Female">Female Only</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 items-center py-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formCarryForward}
                    onChange={(e) => setFormCarryForward(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600 rounded"
                  />
                  <span>Carry Forward Allowed</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formEncashable}
                    onChange={(e) => setFormEncashable(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600 rounded"
                  />
                  <span>Encashable</span>
                </label>
              </div>

              {formCarryForward && (
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Max Carry Forward Days</label>
                  <input
                    type="number"
                    value={formMaxCF}
                    onChange={(e) => setFormMaxCF(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-slate-250 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-855"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a3b38] dark:bg-emerald-600 hover:bg-[#122e2b] text-white rounded-xl px-5 py-2 text-xs font-semibold transition-all shadow-md"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Add Leave Type Policy</h3>
            <form onSubmit={handleAddPolicy} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Policy Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. Paternity Leave"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                    placeholder="e.g. PL"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Annual Days</label>
                  <input
                    type="number"
                    required
                    value={formAnnualDays}
                    onChange={(e) => setFormAnnualDays(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Max Consecutive</label>
                  <input
                    type="number"
                    required
                    value={formMaxConsecutive}
                    onChange={(e) => setFormMaxConsecutive(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Applicable Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="All">All</option>
                    <option value="Female">Female Only</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 items-center py-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formCarryForward}
                    onChange={(e) => setFormCarryForward(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600 rounded"
                  />
                  <span>Carry Forward Allowed</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formEncashable}
                    onChange={(e) => setFormEncashable(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600 rounded"
                  />
                  <span>Encashable</span>
                </label>
              </div>

              {formCarryForward && (
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Max Carry Forward Days</label>
                  <input
                    type="number"
                    value={formMaxCF}
                    onChange={(e) => setFormMaxCF(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-250 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-855"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a3b38] dark:bg-emerald-600 hover:bg-[#122e2b] text-white rounded-xl px-5 py-2 text-xs font-semibold transition-all shadow-md"
                >
                  Create Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
