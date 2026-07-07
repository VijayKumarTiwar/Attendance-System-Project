'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, 
  MapPin, 
  Filter, 
  FileDown, 
  Calendar, 
  User, 
  Layers, 
  Search, 
  Check, 
  Play, 
  Pause, 
  Square,
  ScanFace, ArrowLeft, RefreshCw } from 'lucide-react';
import { AttendanceLog, Employee } from '../../utils/mockData';

interface AttendanceViewProps {
  logs: AttendanceLog[];
  employees: Employee[];
  onAddPunch: (punch: Omit<AttendanceLog, 'id'>) => void;
}

export default function AttendanceView({ logs, employees, onAddPunch, setView }: AttendanceViewProps & { setView?: any }) {
  // Simulator State
  const [punchState, setPunchState] = useState<'checked_out' | 'checked_in' | 'on_break'>('checked_out');
  const [punchTimes, setPunchTimes] = useState<{
    in: string | null;
    out: string | null;
    breakStart: string | null;
    breakEnd: string | null;
  }>({
    in: null,
    out: null,
    breakStart: null,
    breakEnd: null,
  });

  const [activeEmployeeId, setActiveEmployeeId] = useState('EMP-001');
  const today = new Date();
  const currentMonthName = today.toLocaleString('en-US', { month: 'long' });
  const currentYear = today.getFullYear();
  const todayDateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const [selectedMonth, setSelectedMonth] = useState(`${currentMonthName} ${currentYear}`);
  
  // Table Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Face Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('Verifying Identity...');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isScanning) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
            }
          })
          .catch(err => console.error("Camera access denied", err));
      } else {
        console.warn("Camera API not available. This usually requires an HTTPS connection or localhost.");
        setScanMessage("Camera unavailable (Needs HTTPS)");
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning]);

  const activeEmployee = employees.find(e => e.id === activeEmployeeId) || employees[0];

  // Load today's punch state for the active employee if any
  useEffect(() => {
    const todayLog = logs.find(l => l.employeeId === activeEmployeeId && l.date === todayDateStr);
    if (todayLog) {
      if (todayLog.checkOut) {
        setPunchState('checked_out');
        setPunchTimes({ in: todayLog.checkIn, out: todayLog.checkOut, breakStart: null, breakEnd: null });
      } else {
        setPunchState('checked_in');
        setPunchTimes({ in: todayLog.checkIn, out: null, breakStart: null, breakEnd: null });
      }
    } else {
      setPunchState('checked_out');
      setPunchTimes({ in: null, out: null, breakStart: null, breakEnd: null });
    }
  }, [activeEmployeeId, logs]);

  // Live Timer for UI
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLiveTime = () => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleCheckIn = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const shiftStartMins = 9 * 60; // 09:00 AM

    if (Math.abs(currentMins - shiftStartMins) > 30) {
      alert('Punch In failed: You can only punch in between 08:30 AM and 09:30 AM (30 minutes before/after your 09:00 AM shift).');
      return;
    }

    const nowStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPunchState('checked_in');
    setPunchTimes(prev => ({ ...prev, in: nowStr, out: null }));
    
    // Add to shared state
    onAddPunch({
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      employeeRole: activeEmployee.role,
      department: activeEmployee.department,
      date: todayDateStr,
      checkIn: nowStr,
      checkOut: null,
      breakDuration: 0,
      status: 'Present',
      workHours: 8,
    });
  };

  const handleBreakIn = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPunchState('on_break');
    setPunchTimes(prev => ({ ...prev, breakStart: nowStr }));
  };

  const handleBreakOut = () => {
    setPunchState('checked_in');
    setPunchTimes(prev => ({ ...prev, breakEnd: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));
  };

  const handleCheckOut = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const shiftEndMins = 18 * 60; // 06:00 PM

    if (Math.abs(currentMins - shiftEndMins) > 30) {
      alert('Punch Out failed: You can only punch out between 05:30 PM and 06:30 PM (30 minutes before/after your 06:00 PM shift end).');
      return;
    }

    const nowStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPunchState('checked_out');
    setPunchTimes(prev => ({ ...prev, out: nowStr }));

    // Find and update existing today log
    const todayLogIdx = logs.findIndex(l => l.employeeId === activeEmployee.id && l.date === todayDateStr);
    if (todayLogIdx >= 0) {
      const existing = logs[todayLogIdx];
      // calculate simulated work duration
      onAddPunch({
        employeeId: activeEmployee.id,
        employeeName: activeEmployee.name,
        employeeRole: activeEmployee.role,
        department: activeEmployee.department,
        date: todayDateStr,
        checkIn: existing.checkIn,
        checkOut: nowStr,
        breakDuration: 45,
        status: 'Present',
        workHours: 8.5,
      });
    }
  };

  // Filter logs for Table
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    const matchesDept = deptFilter === 'All' || log.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (type: 'pdf' | 'excel') => {
    setIsExporting(type);
    
    setTimeout(() => {
      const fileName = `RSGL_Attendance_Report_${selectedMonth.replace(' ', '_')}.${type === 'excel' ? 'csv' : 'pdf'}`;
      const fileContent = type === 'excel' 
        ? "Employee Name,Department,Status,Check In,Check Out\nMock Data,Mock Dept,Present,09:00,18:00" 
        : "%PDF-1.4\nMock PDF Attendance Document\nConfidential";
        
      const blob = new Blob([fileContent], { 
        type: type === 'excel' ? 'text/csv' : 'application/pdf' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(null);
    }, 1000);
  };

  const handleScanAction = (callback: () => void, message: string) => {
    setScanMessage(message);
    setIsScanning(true);
    // Increased timeout to 5 seconds to give time for camera permission & feed
    setTimeout(() => {
      setIsScanning(false);
      callback();
    }, 5000);
  };

  // Calendar dates dynamic generator for selected month
  const getCalendarDays = () => {
    const days = [];
    const [monthName, yearStr] = selectedMonth.split(' ');
    const year = parseInt(yearStr);
    const monthIdx = new Date(Date.parse(monthName + " 1, " + year)).getMonth();

    const totalDays = new Date(year, monthIdx + 1, 0).getDate();
    const firstDay = new Date(year, monthIdx, 1).getDay(); 
    // getDay() gives 0 for Sunday, 1 for Monday. Our grid starts on Monday.
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < offset; i++) {
      days.push({ dayNum: null, dateStr: '', status: 'empty' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= totalDays; i++) {
      const dayStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const log = logs.find(l => l.employeeId === activeEmployee.id && l.date === dayStr);
      
      let status: 'present' | 'late' | 'absent' | 'leave' | 'weekend' | 'future' | 'empty' = 'future';
      
      const dateObj = new Date(year, monthIdx, i);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

      if (dateObj > today) {
        status = 'future';
      } else if (isWeekend) {
        status = 'weekend';
      } else if (log) {
        if (log.status === 'Present') status = 'present';
        else if (log.status === 'Late') status = 'late';
        else if (log.status === 'On Leave') status = 'leave';
        else status = 'absent';
      } else {
        // Mock absent for past weekdays with no logs
        status = 'absent';
      }

      days.push({ dayNum: i, dateStr: dayStr, status });
    }
    return days;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Employee Selector */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Attendance Center</h2>
          <p className="text-sm text-slate-500">Punch logs, rosters, and compliance filters</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-500">Active Test Profile:</span>
          <select 
            value={activeEmployeeId} 
            onChange={(e) => setActiveEmployeeId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Live Check-In Card & Timeline */}
        <div className="space-y-6 lg:col-span-1">
          {/* Punch Card Simulator — Premium Terminal */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl">
            {/* Decorative glow accent */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Punch Terminal</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${punchState === 'checked_in' ? 'bg-emerald-400 animate-pulse' : punchState === 'on_break' ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {punchState === 'checked_out' ? 'Offline' : 'Live'}
                </span>
              </div>
            </div>

            {isScanning ? (
              <div className="relative my-8 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-emerald-500/30 bg-slate-800 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="h-full w-full object-cover opacity-80"
                    />
                    {!videoRef.current?.srcObject && (
                      <ScanFace className="absolute h-16 w-16 text-emerald-400 opacity-50" />
                    )}
                  </div>
                  {/* CSS-based scan line */}
                  <div 
                    className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#34d399]" 
                    style={{ animation: 'scan 2s ease-in-out infinite alternate' }} 
                  />
                </div>
                <p className="mt-6 text-sm font-bold text-emerald-400 animate-pulse tracking-wider">
                  {scanMessage}
                </p>
                <p className="mt-1 text-xs text-slate-400">Please look directly at the camera</p>
              </div>
            ) : (
              <>
                {/* Clock Display */}
                <div className="relative my-8 text-center">
                  <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-lg">{formatLiveTime()}</span>
                  <span className="mt-2 block text-sm font-medium text-slate-400">
                    {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1 backdrop-blur-sm">
                    <MapPin className="h-3 w-3 text-blue-400" />
                    <span className="text-[11px] font-semibold text-slate-300">Kota, Rajasthan</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mb-6 rounded-xl border border-slate-700/40 bg-slate-800/50 p-4 text-center backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Device Status</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                      punchState === 'checked_out' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/40' :
                      punchState === 'checked_in' ? 'bg-blue-400 shadow-lg shadow-blue-400/40 animate-pulse' :
                      'bg-amber-400 shadow-lg shadow-amber-400/40 animate-pulse'
                    }`} />
                    <p className="text-sm font-bold text-white">
                      {punchState === 'checked_out' && 'Ready to Punch-In'}
                      {punchState === 'checked_in' && 'Working (Checked-In)'}
                      {punchState === 'on_break' && 'On Break'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {punchState === 'checked_out' ? (
                    <button
                      onClick={() => handleScanAction(handleCheckIn, 'Authenticating Face for Punch In...')}
                      className="col-span-2 group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-[0.97] hover:shadow-xl hover:shadow-blue-500/40 hover:brightness-110"
                    >
                      <ScanFace className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span className="text-sm tracking-wide">PUNCH IN (FACE)</span>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </button>
                  ) : (
                    <>
                      {punchState === 'checked_in' ? (
                        <button
                          onClick={() => handleScanAction(handleBreakIn, 'Verifying Face for Break...')}
                          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 font-bold text-white shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-[0.97] hover:shadow-xl hover:shadow-amber-500/40 hover:brightness-110"
                        >
                          <ScanFace className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                          <span className="text-xs tracking-wide">START BREAK</span>
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleScanAction(handleBreakOut, 'Verifying Face to Resume...')}
                          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.97] hover:shadow-xl hover:shadow-emerald-500/40 hover:brightness-110"
                        >
                          <ScanFace className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                          <span className="text-xs tracking-wide">END BREAK</span>
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </button>
                      )}
                      <button
                        onClick={() => handleScanAction(handleCheckOut, 'Authenticating Face for Punch Out...')}
                        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-rose-500 py-3.5 font-bold text-white shadow-lg shadow-red-500/25 transition-all duration-200 active:scale-[0.97] hover:shadow-xl hover:shadow-red-500/40 hover:brightness-110"
                      >
                        <ScanFace className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                        <span className="text-xs tracking-wide">PUNCH OUT</span>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Today's Timeline widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Today's Timeline</h3>
            
            <div className="mt-6 space-y-6 border-l-2 border-slate-100 dark:border-slate-800 pl-4 ml-2">
              <div className="relative">
                <div className={`absolute -left-[22px] top-1 flex h-3 w-3 rounded-full ${punchTimes.in ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <p className="text-sm font-semibold">Shift Checked-In</p>
                <p className="text-xs text-slate-500 mt-0.5">{punchTimes.in || '--:--'}</p>
              </div>

              <div className="relative">
                <div className={`absolute -left-[22px] top-1 flex h-3 w-3 rounded-full ${punchTimes.breakStart ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <p className="text-sm font-semibold">Lunch/Break In</p>
                <p className="text-xs text-slate-500 mt-0.5">{punchTimes.breakStart || '--:--'}</p>
              </div>

              <div className="relative">
                <div className={`absolute -left-[22px] top-1 flex h-3 w-3 rounded-full ${punchTimes.out ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <p className="text-sm font-semibold">Shift Checked-Out</p>
                <p className="text-xs text-slate-500 mt-0.5">{punchTimes.out || '--:--'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Month Calendar & History Log Table */}
        <div className="space-y-6 lg:col-span-2">
          {/* Monthly Calendar View */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Roster Calendar</h3>
                <p className="text-sm text-slate-500">Monthly schedule overview for {activeEmployee.name}</p>
              </div>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={`${m} 2026`}>{m} 2026</option>
                ))}
              </select>
            </div>

            {/* Color Labels */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-md bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-md bg-amber-500" /> Late Check-in</span>
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-md bg-red-500" /> Absent</span>
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-md bg-purple-500" /> Approved Leave</span>
              <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-md bg-slate-100 border border-slate-200 dark:bg-slate-800" /> Rest Day / Weekend</span>
            </div>

            {/* Grid days */}
            <div className="mt-6 grid grid-cols-7 gap-2 text-center text-sm font-semibold">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                <span key={d} className="text-slate-400 font-bold text-xs uppercase mb-1">{d}</span>
              ))}

              {getCalendarDays().map((day, idx) => (
                <div 
                  key={idx} 
                  className={`flex h-10 items-center justify-center rounded-xl font-bold border transition-colors ${
                    day.status === 'empty' ? 'border-transparent bg-transparent' :
                    day.status === 'weekend' ? 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/50' :
                    day.status === 'present' ? 'bg-emerald-500 text-white border-emerald-500' :
                    day.status === 'late' ? 'bg-amber-500 text-white border-amber-500' :
                    day.status === 'absent' ? 'bg-red-500 text-white border-red-500' :
                    day.status === 'leave' ? 'bg-purple-500 text-white border-purple-500' :
                    'bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                  }`}
                >
                  {day.dayNum}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History Log Table spanning full width */}
        <div className="col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Attendance Log History</h3>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => handleExport('excel')}
                disabled={isExporting !== null}
                className={`flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold transition-colors shadow-sm ${
                  isExporting === 'excel' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {isExporting === 'excel' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} 
                {isExporting === 'excel' ? 'Exporting...' : 'Export CSV'}
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                disabled={isExporting !== null}
                className={`flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold transition-colors shadow-sm ${
                  isExporting === 'pdf' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {isExporting === 'pdf' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} 
                {isExporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID or Employee Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-slate-400" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4.5 w-4.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="On Leave">On Leave</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Employee Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">In Time</th>
                  <th className="px-6 py-4">Out Time</th>
                  <th className="px-6 py-4">Work Hours</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{log.employeeId}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-250">{log.employeeName}</div>
                      <div className="text-xs text-slate-400">{log.employeeRole}</div>
                    </td>
                    <td className="px-6 py-4">{log.department}</td>
                    <td className="px-6 py-4">{log.date}</td>
                    <td className="px-6 py-4">{log.checkIn || '--:--'}</td>
                    <td className="px-6 py-4">{log.checkOut || '--:--'}</td>
                    <td className="px-6 py-4 font-semibold">{log.workHours ? `${log.workHours}h` : '8h'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        log.status === 'Present' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                        log.status === 'Late' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                        log.status === 'On Leave' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                      No attendance logs match selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
