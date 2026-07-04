'use client';

import React from 'react';
import { Download, Wallet, CreditCard, Shield, TrendingUp, Calendar, ArrowLeft, RefreshCw } from 'lucide-react';

export default function CompensationView({ setView }: any) {
  const breakdown = [
    { component: 'Basic Salary', amount: '₹72,000', pct: '48%', annual: '₹8,64,000' },
    { component: 'House Rent Allowance (HRA)', amount: '₹28,800', pct: '19.2%', annual: '₹3,45,600' },
    { component: 'Dearness Allowance (DA)', amount: '₹14,400', pct: '9.6%', annual: '₹1,72,800' },
    { component: 'Travel Allowance', amount: '₹6,000', pct: '4.0%', annual: '₹72,000' },
    { component: 'Medical Allowance', amount: '₹1,250', pct: '0.8%', annual: '₹15,000' },
    { component: 'Special Allowance', amount: '₹20,550', pct: '13.7%', annual: '₹2,46,600' },
    { component: 'Provident Fund (Employer Cont.)', amount: '₹8,640', pct: '5.8%', annual: '₹1,03,680' },
    { component: 'Gratuity Provision', amount: '₹3,360', pct: '2.2%', annual: '₹40,320' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Compensation</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detailed overview of your CTC breakdown, deductions, and benefits package</p>
        </div>
        <button
          onClick={() => alert('Downloading official CTC revision letter.')}
          className="flex items-center gap-1.5 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-md transition-colors w-fit"
        >
          <Download className="h-4 w-4" />
          <span>CTC Breakdown Letter</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prominent Dark Green Card */}
        <div className="bg-gradient-to-br from-[#1a3b38] to-[#122e2b] dark:from-[#0d2422] dark:to-[#081a18] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden md:col-span-2 flex flex-col justify-between">
          <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12">
            <Wallet className="h-48 w-48" />
          </div>
          <div>
            <span className="bg-white/10 text-emerald-400 border border-white/15 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Current Financial Plan (FY 2026-27)
            </span>
            <p className="text-xs text-white/60 mt-4 uppercase font-bold tracking-wider">Total Annualized CTC</p>
            <p className="text-3xl font-extrabold mt-1">₹18,00,000 <span className="text-sm font-normal text-white/65">/ year</span></p>
          </div>
          <div className="mt-8 border-t border-white/10 pt-4 flex justify-between items-center text-xs">
            <div>
              <p className="text-white/50 text-[10px] uppercase font-bold">Estimated Net Monthly In-hand</p>
              <p className="text-base font-bold text-emerald-450 mt-0.5">₹1,25,000 <span className="text-xs font-normal text-white/70">/ month</span></p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[10px] uppercase font-bold">Revision Cycle</p>
              <p className="font-semibold text-white/90 mt-0.5">Annual (Eff. Apr 1)</p>
            </div>
          </div>
        </div>

        {/* Deductions card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              Monthly Deductions
            </h3>
            <div className="space-y-3 mt-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">PF (Employee Cont.)</span>
                <span className="text-slate-700 dark:text-slate-200">₹8,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Professional Tax</span>
                <span className="text-slate-700 dark:text-slate-200">₹200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Income Tax (TDS)</span>
                <span className="text-slate-700 dark:text-slate-200">₹12,000</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-50 dark:border-slate-800/60 pt-3 mt-4 flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500">Total Deductions</span>
            <span className="text-red-500">₹20,200</span>
          </div>
        </div>
      </div>

      {/* Salary Breakdown & Donut representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-855 dark:text-white">Annual CTC Components</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                  <th className="px-3 py-2.5 text-slate-400 font-bold uppercase tracking-wider">Salary Component</th>
                  <th className="px-3 py-2.5 text-slate-400 font-bold uppercase tracking-wider text-right">Percentage Split</th>
                  <th className="px-3 py-2.5 text-slate-400 font-bold uppercase tracking-wider text-right">Monthly Component</th>
                  <th className="px-3 py-2.5 text-slate-400 font-bold uppercase tracking-wider text-right">Annual Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                {breakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-3 py-3 font-normal">{row.component}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400">{row.pct}</td>
                    <td className="px-3 py-3 text-right">{row.amount}</td>
                    <td className="px-3 py-3 text-right text-slate-800 dark:text-white font-bold">{row.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual percentage and benefits */}
        <div className="space-y-6">
          {/* Inline SVG Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm flex flex-col items-center">
            <h3 className="font-bold text-slate-800 dark:text-white self-start mb-4">CTC Component Split</h3>
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                <circle className="text-slate-100 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
                {/* Basic: 48% */}
                <circle className="text-emerald-500" strokeDasharray="48 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
                {/* HRA: 19% (dashoffset = 48) */}
                <circle className="text-blue-500 animate-fade-in" strokeDasharray="19 100" strokeDashoffset="-48" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
                {/* Allowances & others: 33% */}
                <circle className="text-amber-500" strokeDasharray="33 100" strokeDashoffset="-67" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
              </svg>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800 dark:text-white">100%</p>
                <p className="text-[9px] text-slate-400">Detailed Split</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Basic (48%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> HRA (19.2%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Others (32.8%)</span>
            </div>
          </div>

          {/* Perks card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Included Benefits & Perks
            </h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200">Group Health Insurance</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Family Floater Cover up to ₹5,00,000 / year</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200">Group Term Life Insurance</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Comprehensive cover up to ₹25,00,000 / year</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200">Gratuity Provision</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Accrued annually as per central gratuity act</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year over Year increments */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-855 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
          CTC Progression Timeline
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Revision Year</th>
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Annualized CTC</th>
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Increment Percentage</th>
                <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Designation / Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
              <tr>
                <td className="px-4 py-3.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-450" /> 2026 - Present</td>
                <td className="px-4 py-3.5">₹18,00,000</td>
                <td className="px-4 py-3.5"><span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono">+2.8%</span></td>
                <td className="px-4 py-3.5">Chief Executive Officer</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-450" /> 2025 - 2026</td>
                <td className="px-4 py-3.5">₹17,50,000</td>
                <td className="px-4 py-3.5"><span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono">+9.3%</span></td>
                <td className="px-4 py-3.5">Chief Executive Officer</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-450" /> 2024 - 2025</td>
                <td className="px-4 py-3.5">₹16,00,000</td>
                <td className="px-4 py-3.5"><span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono">+14.2%</span></td>
                <td className="px-4 py-3.5">Chief Executive Officer</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-450" /> 2023 - 2024</td>
                <td className="px-4 py-3.5">₹14,00,000</td>
                <td className="px-4 py-3.5"><span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono">Base</span></td>
                <td className="px-4 py-3.5">Chief Executive Officer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
