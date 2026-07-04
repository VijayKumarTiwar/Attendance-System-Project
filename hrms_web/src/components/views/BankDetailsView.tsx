'use client';

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, HelpCircle, Download, ChevronDown, ChevronUp, Plus, Check, ArrowLeft, RefreshCw } from 'lucide-react';

export default function BankDetailsView({ setView }: any) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form States
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountType, setAccountType] = useState('Savings');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branch, setBranch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || accountNumber !== confirmAccount) {
      alert('Account numbers do not match or are invalid.');
      return;
    }
    alert('Bank account details submitted for verification. Change requires HR Admin approval.');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bank & Payment Details</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure your direct deposit bank accounts and view payslip credits</p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-md transition-colors w-fit">
          <Download className="h-4 w-4" />
          <span>Salary Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Account Card (Green style) */}
        <div className="bg-gradient-to-br from-[#1a3b38] to-[#122e2b] dark:from-[#0d2422] dark:to-[#081a18] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden lg:col-span-2">
          {/* Subtle logo background grid */}
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <CreditCard className="h-64 w-64" />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-450">Primary Direct Deposit</p>
              <h2 className="text-lg font-bold mt-1">State Bank of India</h2>
              <p className="text-xs text-white/70">Secretariat Branch, Jaipur</p>
            </div>
            <span className="flex items-center gap-1 bg-white/10 border border-white/20 text-emerald-400 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Account Number</p>
              <p className="text-xl font-mono tracking-widest mt-1">•••• •••• •••• 4821</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">IFSC Code</p>
                <p className="text-sm font-semibold tracking-wider font-mono">SBIN0031031</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Account Type</p>
                <p className="text-sm font-semibold">Savings Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Account Toggler */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-white">Change Bank Details</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Direct deposit updates require verification by the finance team. Processing may take up to 2-3 business days.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 mt-4 transition-colors"
          >
            <span>Change Bank Request</span>
            {showAddForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Form collapse details */}
        {showAddForm && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm lg:col-span-3">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Request Bank Revision</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Bank Name</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Account Number</label>
                <input
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Confirm Account Number</label>
                <input
                  type="text"
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  placeholder="Confirm Account Number"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  placeholder="SBIN0001234"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Account Type</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="Savings">Savings Account</option>
                  <option value="Current">Current Account</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Branch Location</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  placeholder="Secretariat, Jaipur"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-slate-250 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a3b38] dark:bg-emerald-600 hover:bg-[#122e2b] text-white rounded-xl px-5 py-2 text-xs font-semibold transition-all shadow-md"
                >
                  Submit Revision
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment History Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm lg:col-span-3">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Direct Deposit Net Pay Credits</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Month</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Net Salary</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Value Date</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Mode</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                {[
                  { month: 'May 2026', pay: '₹1,25,000', date: '31 May 2026', mode: 'SBI Auto Transfer', status: 'Paid' },
                  { month: 'April 2026', pay: '₹1,25,000', date: '30 Apr 2026', mode: 'SBI Auto Transfer', status: 'Paid' },
                  { month: 'March 2026', pay: '₹1,25,000', date: '31 Mar 2026', mode: 'SBI Auto Transfer', status: 'Paid' },
                  { month: 'February 2026', pay: '₹1,25,000', date: '28 Feb 2026', mode: 'SBI Auto Transfer', status: 'Paid' },
                  { month: 'January 2026', pay: '₹1,25,000', date: '31 Jan 2026', mode: 'SBI Auto Transfer', status: 'Paid' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-4 py-3.5">{row.month}</td>
                    <td className="px-4 py-3.5 text-[#1a3b38] dark:text-emerald-400 font-bold">{row.pay}</td>
                    <td className="px-4 py-3.5 font-normal text-xs text-slate-500 dark:text-slate-400">{row.date}</td>
                    <td className="px-4 py-3.5 font-normal text-xs">{row.mode}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 border border-emerald-100 dark:border-emerald-900/30 rounded-full uppercase">
                        <Check className="h-3 w-3" />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
