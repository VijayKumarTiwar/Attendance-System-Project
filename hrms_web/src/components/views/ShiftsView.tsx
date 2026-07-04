'use client';

import React, { useState } from 'react';
import { Clock, 
  Users, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Employee, ShiftSchedule } from '../../utils/mockData';

interface ShiftsViewProps {
  shifts: ShiftSchedule[];
  employees: Employee[];
  onAssignShift: (empId: string, shiftId: string) => void;
}

export default function ShiftsView({ shifts, employees, onAssignShift, setView }: ShiftsViewProps & { setView?: any }) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedShift) {
      alert('Error: Please select both an employee and a shift.');
      return;
    }
    onAssignShift(selectedEmployee, selectedShift);
    alert('Shift assigned successfully! Roster updated.');
  };

  const today = new Date();
  const getDay = (offset: number) => {
    const d = new Date(today);
    const dayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - dayOfWeek + offset);
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'long' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: d
    };
  };

  const weekdays = [
    getDay(0),
    getDay(1),
    getDay(2),
    getDay(3),
    getDay(4),
  ];
  
  const weekRangeStr = `${weekdays[0].date} - ${weekdays[4].date}, ${weekdays[0].fullDate.getFullYear()}`;

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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Shift Management</h2>
            <p className="text-sm text-slate-500 font-medium">Configure rotating schedules, define grace periods, and audit roster assignments</p>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Shift Cards & Assignment Form */}
        <div className="space-y-6 lg:col-span-1">
          {/* Active Shift Templates */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Active Shift Templates</h3>
            <div className="mt-4 space-y-4">
              {shifts.map((shift) => (
                <div key={shift.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{shift.name}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${shift.color}`} />
                  </div>
                  
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-550 dark:text-slate-400">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{shift.startTime} - {shift.endTime}</span>
                    {shift.crossesMidnight && (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-3xs font-semibold dark:bg-slate-800">Next Day</span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Grace: {shift.graceMinutes} mins</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {shift.assignedEmployees} assigned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Assignment Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Assign Shift</h3>
            
            <form onSubmit={handleAssignSubmit} className="mt-4 space-y-4">
              {/* Select Employee */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="">Choose employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              {/* Select Shift */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Shift Template</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="">Choose shift...</option>
                  {shifts.map(shift => (
                    <option key={shift.id} value={shift.id}>{shift.name} ({shift.startTime})</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-bold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-transform active:scale-95"
              >
                <Sparkles className="h-4.5 w-4.5" />
                Assign & Publish Roster
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Weekly Schedule board */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Roster Coverage</h3>
              <p className="text-sm text-slate-500">Weekly roster visualization ({weekRangeStr})</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/20">
              <Calendar className="h-4 w-4" /> Weekly Grid
            </span>
          </div>

          {/* Roster visualizer */}
          <div className="table-container mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                <tr>
                  <th className="px-5 py-4">Employee</th>
                  {weekdays.map(day => (
                    <th key={day.label} className="px-5 py-4 text-center">
                      <div>{day.label}</div>
                      <div className="text-3xs text-slate-400 mt-0.5">{day.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.map(emp => {
                  // Determine shift display info
                  const isStoreEmp = emp.department === 'Operations' || emp.department === 'Sales';
                  const shiftName = isStoreEmp ? 'Retail Shift' : 'General Day';
                  const shiftTime = isStoreEmp ? '10AM - 7PM' : '9AM - 6PM';
                  const pillColor = isStoreEmp ? 'bg-emerald-500' : 'bg-blue-500';

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{emp.name}</div>
                        <div className="text-xs text-slate-450">{emp.department} • {emp.id}</div>
                      </td>
                      {weekdays.map(day => (
                        <td key={day.label} className="px-5 py-4 text-center">
                          <div className={`mx-auto rounded-lg text-3xs font-extrabold text-white px-2 py-1.5 max-w-[100px] shadow-sm ${pillColor}`}>
                            <div>{shiftName}</div>
                            <div className="text-4xs font-medium opacity-90 mt-0.5">{shiftTime}</div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Compliance Check Alert */}
          <div className="mt-6 rounded-xl bg-blue-550/5 border border-blue-200/50 p-4 dark:border-blue-900/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Roster Guidelines compliant</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All scheduled shifts comply with the 11-hour rest period regulation and do not conflict with approved leaves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
