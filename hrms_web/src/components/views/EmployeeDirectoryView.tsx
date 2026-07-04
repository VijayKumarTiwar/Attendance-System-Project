'use client';

import React, { useState } from 'react';
import { Search, Grid, List, Mail, Phone, ExternalLink, MessageSquare, UserPlus, Filter, ArrowLeft, RefreshCw } from 'lucide-react';
import { initialEmployees, Employee } from '../../utils/mockData';

export default function EmployeeDirectoryView({ employees, setView, onViewProfile }: any) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLetter, setSelectedLetter] = useState('All');

  // Filtering
  const filtered = (employees || []).filter((emp: Employee) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    const matchesLetter = selectedLetter === 'All' || emp.name.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesDept && matchesStatus && matchesLetter;
  });

  const getDeptColor = (dept: string) => {
    switch (dept) {
      case 'Human Resources': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800';
      case 'Engineering': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800';
      case 'Operations': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-850';
      case 'Sales': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800';
      case 'Finance': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getInitialsBg = (dept: string) => {
    switch (dept) {
      case 'Human Resources': return 'bg-purple-550';
      case 'Engineering': return 'bg-blue-600';
      case 'Operations': return 'bg-orange-500';
      case 'Sales': return 'bg-emerald-600';
      case 'Finance': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Employee Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Search and contact employees, search reports, and departmental heads</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit self-end">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1a3b38] dark:text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1a3b38] dark:text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Directory List</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', count: 6, border: 'border-l-slate-450' },
          { label: 'Active Roster', count: 5, border: 'border-l-emerald-500' },
          { label: 'On Leave Status', count: 1, border: 'border-l-amber-500' },
          { label: 'Synced Departments', count: 5, border: 'border-l-blue-500' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm border-l-4 ${stat.border}`}>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none shadow-sm focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold outline-none shadow-sm"
            >
              <option value="All">All Departments</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold outline-none shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Alphabet Jump Bar */}
        <div className="flex flex-wrap gap-1 border-t border-slate-50 dark:border-slate-800/60 pt-3 text-[10px] font-bold">
          <button
            onClick={() => setSelectedLetter('All')}
            className={`px-2 py-1 rounded-lg ${
              selectedLetter === 'All' ? 'bg-[#1a3b38] text-white dark:bg-emerald-500' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            ALL
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-2 py-1 rounded-lg ${
                selectedLetter === letter ? 'bg-[#1a3b38] text-white dark:bg-emerald-500' : 'text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or List Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onViewProfile && onViewProfile(emp.id)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-3xl shadow-sm hover:border-emerald-500/25 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="text-center">
                <div className={`h-14 w-14 rounded-full mx-auto flex items-center justify-center font-bold text-white text-base shadow-sm ${getInitialsBg(emp.department)}`}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-white mt-3 text-sm">{emp.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{emp.designation}</p>

                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getDeptColor(emp.department)}`}>
                    {emp.department}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                    emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-800' : 'bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-800'
                  }`}>
                    {emp.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800/60 mt-4 pt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-normal">Email:</span>
                  <a href={`mailto:${emp.email}`} className="font-semibold text-emerald-600 dark:text-emerald-450 hover:underline">{emp.email}</a>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-normal">Mobile:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{emp.phone}</span>
                </div>

                <div className="flex justify-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                  <button className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 rounded-xl transition-all" title="Send Instant Message">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 rounded-xl transition-all" title="Email Profile">
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Employee Name</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Designation</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Email ID</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Mobile Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                {filtered.map((emp) => (
                  <tr key={emp.id} onClick={() => onViewProfile && onViewProfile(emp.id)} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center font-bold text-white text-[9px] ${getInitialsBg(emp.department)}`}>
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-normal">{emp.designation}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getDeptColor(emp.department)}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-700 border-amber-150'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-normal text-emerald-600 dark:text-emerald-450 hover:underline">{emp.email}</td>
                    <td className="px-4 py-3.5 font-normal">{emp.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
