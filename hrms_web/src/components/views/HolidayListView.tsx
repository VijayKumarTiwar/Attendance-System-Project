'use client';

import React, { useState } from 'react';
import { Calendar, Filter, Download, FileSpreadsheet, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { initialHolidays, Holiday } from '../../utils/mockData';

export default function HolidayListView({ setView }: any) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [activeFilter, setActiveFilter] = useState<'All' | 'National' | 'Gazetted' | 'Restricted' | 'Company'>('All');

  // Filter holidays
  const filteredHolidays = initialHolidays.filter(holiday => {
    if (activeFilter === 'All') return true;
    return holiday.type === activeFilter;
  });

  // Calculate counts
  const totalHolidays = initialHolidays.length;
  const nationalCount = initialHolidays.filter(h => h.type === 'National').length;
  const gazettedCount = initialHolidays.filter(h => h.type === 'Gazetted').length;
  const restrictedCount = initialHolidays.filter(h => h.type === 'Restricted').length;
  const companyCount = initialHolidays.filter(h => h.type === 'Company').length;

  // Check if a holiday has passed (we assume current date is June 26, 2026)
  const isPassed = (dateStr: string) => {
    return new Date(dateStr) < new Date('2026-06-26');
  };

  const getBadgeColor = (type: Holiday['type']) => {
    switch (type) {
      case 'National':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800';
      case 'Gazetted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'Restricted':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800';
      case 'Company':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Holiday List {selectedYear}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Official company holiday calendar and compliance schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold shadow-sm outline-none"
          >
            <option value="2026">Year 2026</option>
            <option value="2027">Year 2027</option>
          </select>
          <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold shadow-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Holidays', count: totalHolidays, border: 'border-l-slate-500' },
          { label: 'National', count: nationalCount, border: 'border-l-blue-500' },
          { label: 'Gazetted', count: gazettedCount, border: 'border-l-emerald-500' },
          { label: 'Restricted', count: restrictedCount, border: 'border-l-amber-500' },
          { label: 'Company', count: companyCount, border: 'border-l-purple-500' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 ${stat.border}`}>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'National', 'Gazetted', 'Restricted', 'Company'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#1a3b38] text-white dark:bg-emerald-500 dark:text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Showing {filteredHolidays.length} of {totalHolidays} holidays
        </p>
      </div>

      {/* Holiday Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-800/10">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Day</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Holiday Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredHolidays.map((holiday) => {
                const passed = isPassed(holiday.date);
                const holidayDate = new Date(holiday.date);
                const formattedDate = holidayDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <tr
                    key={holiday.id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors ${
                      passed ? 'text-slate-400 dark:text-slate-500 opacity-60' : 'text-slate-700 dark:text-slate-200 font-semibold'
                    }`}
                  >
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex flex-col items-center justify-center font-bold text-[10px] uppercase leading-none shadow-sm ${
                          passed ? 'bg-slate-100 dark:bg-slate-800' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          <span className="text-[8px] opacity-75">{holidayDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-sm mt-0.5">{holidayDate.toLocaleDateString('en-US', { day: 'numeric' })}</span>
                        </div>
                        <span>{formattedDate}, {selectedYear}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-normal">{holiday.day}</td>
                    <td className="px-6 py-4.5 text-sm">{holiday.name}</td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeColor(holiday.type)}`}>
                        {holiday.type}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate font-normal">
                      {holiday.description || 'No description available'}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      {passed ? (
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">Passed</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Upcoming
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
