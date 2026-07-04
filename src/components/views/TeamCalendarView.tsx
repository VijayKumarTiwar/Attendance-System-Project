'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Circle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';

interface EventItem {
  day: number;
  name: string;
  type: 'leave' | 'holiday' | 'shift';
  detail: string;
  status?: string;
}

export default function TeamCalendarView({ setView }: any) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterDept, setFilterDept] = useState('All');
  const _now = new Date();
  const _currentMonthYear = _now.toLocaleString('en-US', { month: 'long' }) + ' ' + _now.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(_currentMonthYear);

  // Static Calendar Events for June 2026
  // June 2026 starts on a Monday
  const events: EventItem[] = [
    { day: 6, name: 'Labour Day Holiday (Passed)', type: 'holiday', detail: 'National Holiday' },
    { day: 17, name: 'Manoj Yadav', type: 'shift', detail: 'On-time (08:52 AM)' },
    { day: 17, name: 'Manoj Nagar', type: 'shift', detail: 'Late Entry (09:22 AM)' },
    { day: 17, name: 'Vijay Kumar Tiwari', type: 'shift', detail: 'Casual Leave (Approved)', status: 'Approved' },
    { day: 18, name: 'Anjali Desai', type: 'leave', detail: 'Casual Leave (Approved)', status: 'Approved' },
    { day: 19, name: 'Anjali Desai', type: 'leave', detail: 'Casual Leave (Approved)', status: 'Approved' },
    { day: 20, name: 'Vikram Singh', type: 'leave', detail: 'Sick Leave (Pending)', status: 'Pending' },
    { day: 21, name: 'Vikram Singh', type: 'leave', detail: 'Sick Leave (Pending)', status: 'Pending' },
    { day: 22, name: 'Vikram Singh', type: 'leave', detail: 'Sick Leave (Pending)', status: 'Pending' },
  ];

  // Helper for Grid Cells based on selectedMonth
  const getGridCells = () => {
    const gridCells = [];
    const [monthName, yearStr] = selectedMonth.split(' ');
    const year = parseInt(yearStr);
    const monthIdx = new Date(Date.parse(monthName + " 1, " + year)).getMonth();

    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const firstDay = new Date(year, monthIdx, 1).getDay(); // 0 is Sun
    const prevMonthDays = new Date(year, monthIdx, 0).getDate();

    // Pre-padding (Sunday start)
    for (let i = 0; i < firstDay; i++) {
      gridCells.push({ dayNumber: prevMonthDays - firstDay + i + 1, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      gridCells.push({ dayNumber: i, isCurrentMonth: true });
    }

    // Post padding to make multiple of 7
    const remaining = 7 - (gridCells.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        gridCells.push({ dayNumber: i, isCurrentMonth: false });
      }
    }
    return gridCells;
  };

  const gridCells = getGridCells();

  const getEventsForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    return events.filter(e => e.day === day);
  };

  const getEventStyle = (type: EventItem['type']) => {
    switch (type) {
      case 'leave': return 'bg-amber-500 text-white';
      case 'holiday': return 'bg-red-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-[#1a3b38] dark:text-emerald-450" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Team Calendar</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track department availability, shift assignments, and statutory holidays</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'week' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={() => alert('Exporting team calendar events.')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 px-3 py-2 text-xs font-bold text-slate-650 dark:text-slate-400 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Calendar</span>
          </button>
        </div>
      </div>

      {/* Filter Legend bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        {/* Legends */}
        <div className="flex gap-4 text-xs font-semibold text-slate-550 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Shift Rota</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Approved Leaves</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Gazetted Holidays</span>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold outline-none shadow-sm"
          >
            <option value="All">All Operations</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between mb-6">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="font-extrabold text-base text-slate-800 dark:text-white bg-transparent outline-none cursor-pointer"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={`${m} 2026`}>{m} 2026</option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500"><ChevronLeft className="h-4 w-4" /></button>
              <button className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400">Today</button>
              <button className="p-1 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] uppercase text-slate-400 tracking-wider mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {gridCells.map((cell, idx) => {
              const dayEvents = getEventsForDay(cell.dayNumber, cell.isCurrentMonth);
              const isToday = cell.dayNumber === 26 && cell.isCurrentMonth; // Assume June 26

              return (
                <div
                  key={idx}
                  className={`min-h-[75px] border border-slate-50 dark:border-slate-800/60 p-2 rounded-xl flex flex-col justify-between transition-all select-none ${
                    cell.isCurrentMonth ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200' : 'bg-slate-50/50 dark:bg-slate-800/10 text-slate-350 dark:text-slate-600'
                  } ${isToday ? 'ring-2 ring-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-350' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold ${isToday ? 'text-emerald-600 dark:text-emerald-450 h-5 w-5 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center rounded-full shadow-sm' : ''}`}>
                      {cell.dayNumber}
                    </span>
                  </div>

                  {/* Cell Events */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((evt, eIdx) => (
                      <div
                        key={eIdx}
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold truncate leading-normal ${getEventStyle(evt.type)}`}
                        title={`${evt.name} - ${evt.detail}`}
                      >
                        {evt.name.split(' ')[0]}: {evt.type === 'shift' ? 'Shift' : evt.type === 'holiday' ? 'Holiday' : 'Leave'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar - Today's events & upcoming */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-500 animate-pulse" />
              Availability Today (June 26)
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">Vijay Kumar Tiwari</p>
                  <p className="text-[10px] text-slate-400">Management</p>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 border border-emerald-100 rounded-full uppercase">Present</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">Anjali Desai</p>
                  <p className="text-[10px] text-slate-400">Sales Office</p>
                </div>
                <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 border border-amber-100 rounded-full uppercase">On Leave</span>
              </div>
            </div>
          </div>

          {/* Upcoming highlights */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs text-slate-450 uppercase tracking-wider">Upcoming Calendar Events</h3>
            <div className="space-y-4">
              {[
                { date: 'July 5-12', label: 'Siddharth Sen (Leave)', desc: 'Privilege Leave applied', type: 'leave' },
                { date: 'Aug 15', label: 'Independence Day', desc: 'National Statutory Holiday', type: 'holiday' },
              ].map((row, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${
                    row.type === 'leave' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{row.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{row.desc} • {row.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
