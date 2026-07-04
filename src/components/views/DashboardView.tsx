'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  Users, 
  UserCheck, 
  UserX, 
  CalendarRange, 
  Clock, 
  TrendingUp, 
  Briefcase, 
  Plus, 
  FileSpreadsheet, 
  CalendarDays, 
  ArrowRight,
  Smartphone,
  Timer,
  Wallet,
  BookOpen,
  List,
  Compass,
  Banknote,
  User,
  Gift,
  Store,
  BadgeCheck,
  HelpCircle,
  LayoutDashboard,
  FileText,
  Landmark,
  CalendarCheck,
  BarChart2,
  Award,
  ClipboardList,
  ChevronDown
} from 'lucide-react';
import { 
  Employee, 
  AttendanceLog, 
  ActivityFeed, 
  upcomingHolidays 
} from '../../utils/mockData';

// Dynamically import ApexCharts to disable Server Side Rendering (SSR)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DashboardViewProps {
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  activityFeed: ActivityFeed[];
  setView: (view: string) => void;
  onQuickPunch: () => void;
}

export default function DashboardView({ 
  employees, 
  attendanceLogs, 
  activityFeed, 
  setView,
  onQuickPunch 
}: DashboardViewProps) {

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Calculate KPI Metrics
  const totalEmployees = employees.length;
  const presentToday = attendanceLogs.filter(l => l.status === 'Present' || l.status === 'Late').length;
  const lateToday = attendanceLogs.filter(l => l.status === 'Late').length;
  const onLeaveToday = employees.filter(e => e.status === 'On Leave').length;
  const absentToday = totalEmployees - presentToday - onLeaveToday;
  const attendanceRate = Math.round((presentToday / (totalEmployees - onLeaveToday)) * 100) || 0;

  // 2. ApexCharts Configurations
  const weeklyChartOptions = {
    chart: {
      id: 'weekly-attendance-chart',
      toolbar: { show: false },
      background: 'transparent',
      animations: { enabled: false }
    },
    colors: ['#2563EB', '#06B6D4'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      labels: {
        style: { colors: '#64748b' }
      }
    },
    yaxis: {
      title: { text: 'Employees Count', style: { color: '#64748b', fontWeight: 600 } },
      labels: {
        style: { colors: '#64748b' }
      }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val: number) => `${val} Employees` }
    },
    grid: { borderColor: '#f1f5f9' },
    theme: { mode: 'light' as const }
  };

  const weeklyChartSeries = [
    { name: 'Present', data: [5, 6, 6, presentToday, 0] },
    { name: 'Late', data: [1, 0, 2, lateToday, 0] },
  ];

  const trendChartOptions = {
    chart: {
      id: 'monthly-trend-chart',
      toolbar: { show: false },
      background: 'transparent',
      sparkline: { enabled: false },
      animations: { enabled: false }
    },
    stroke: { curve: 'smooth' as const, width: 3 },
    colors: ['#3b82f6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      max: 100,
      labels: { formatter: (val: number) => `${val}%`, style: { colors: '#64748b' } }
    },
    grid: { borderColor: '#f1f5f9' },
  };

  const trendChartSeries = [
    { name: 'Attendance Rate', data: [94, 96, 91, attendanceRate] }
  ];

  const deptChartOptions = {
    chart: { id: 'dept-donut', animations: { enabled: false } },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
    labels: ['Engineering', 'HR', 'Operations', 'Sales', 'Finance'],
    legend: { position: 'bottom' as const, labels: { colors: '#64748b' } },
    dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Active Staff',
              color: '#64748b',
              formatter: () => String(totalEmployees)
            }
          }
        }
      }
    }
  };

  const deptChartSeries = [2, 1, 1, 1, 1]; // mapped to initial departments

  // Quick Apps mapped from Oracle Fusion Mobile "Me" Page
  const quickApps = [
    { name: 'Mobile Attendance', icon: Smartphone, view: 'attendance' },
    { name: 'My Attendance Report', icon: Timer, view: 'reports' },
    { name: 'View My Shifts', icon: List, view: 'shifts' },
    { name: 'Plan My Shifts', icon: CalendarRange, view: 'shifts' },
    { name: 'My Payroll', icon: Wallet, view: 'payroll' },
    { name: 'Directory', icon: Users, view: 'directory' },
    { name: 'Journeys', icon: Compass, view: 'orgChart' },
    { name: 'Time and Absences', icon: Clock, view: 'leaves' },
    { name: 'My Compensation', icon: Banknote, view: 'compensation' },
    { name: 'Personal Information', icon: User, view: 'personalInfo' },
    { name: 'Benefits', icon: Gift, view: 'compensation' },
    { name: 'IJP and Referrals', icon: Store, view: 'directory' },
    { name: 'Roles and Delegations', icon: BadgeCheck, view: 'settings' },
    { name: 'Roles and Delegations', icon: BadgeCheck, view: 'settings' },
    { name: 'AskHR', icon: HelpCircle, view: 'settings' },
    { name: 'Policy Handbook', icon: BookOpen, view: 'policies' },
    { name: 'Holiday List', icon: CalendarDays, view: 'holidays' },

    { name: 'Bank Details', icon: Landmark, view: 'bankDetails' },
    { name: 'Full Timers Monthly Attendance', icon: CalendarCheck, view: 'attendance' },
    { name: 'PMS Survey', icon: BarChart2, view: 'reports' },
    { name: 'Reward & Recognition', icon: Award, view: 'employees' },
    { name: 'Pending Checklist Tasks', icon: ClipboardList, view: 'documents' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Quick Action Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a3b38] to-[#122e2b] dark:from-[#0d2422] dark:to-[#081a18] p-8 text-white shadow-xl border border-[#122e2b] dark:border-slate-800">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold md:text-3xl">Welcome back, Vijay Kumar Tiwari</h2>
            <p className="mt-2 text-slate-300">
              Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. All corporate systems are running normally.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              id="action-punch-in"
              onClick={onQuickPunch}
              className="flex items-center gap-2 rounded-xl bg-white text-[#1a3b38] hover:bg-slate-100 px-5 py-3 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Clock className="h-5 w-5" />
              Punch In
            </button>
            <button 
              id="action-punch-out"
              onClick={onQuickPunch}
              className="flex items-center gap-2 rounded-xl bg-red-500 text-white hover:bg-red-600 px-5 py-3 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Clock className="h-5 w-5" />
              Punch Out
            </button>
            <button 
              id="action-apply-leave"
              onClick={() => setView('leaves')}
              className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              <CalendarRange className="h-5 w-5" />
              Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* Apps Grid Section (Oracle Fusion Dashboard style) */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full border border-slate-100 dark:border-slate-800">
        {/* Me Section Header */}
        <div className="flex items-center justify-between pb-8">
          <h3 className="text-[17px] font-semibold text-[#52606d] dark:text-slate-300 tracking-wide">Me</h3>
          <ChevronDown className="h-5 w-5 text-[#52606d] dark:text-slate-400 rotate-180" />
        </div>

        {/* 8 Column Grid matching image */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-10 pb-12">
          {quickApps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <button
                key={idx}
                onClick={() => setView(app.view as any)}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="mb-3 flex items-center justify-center h-10 w-10">
                  <Icon className="h-8 w-8 text-[#52606d] dark:text-slate-400 stroke-[1.2] group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[12.5px] font-medium text-[#52606d] dark:text-slate-400 leading-[1.3] px-1 max-w-[90px]">
                  {app.name}
                </span>
              </button>
            )
          })}
        </div>


      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* KPI 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Staff</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20"><Users className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-3xl font-bold">{totalEmployees}</p>
          <span className="mt-2 block text-xs text-emerald-600">Active Records</span>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Present</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/20"><UserCheck className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-3xl font-bold">{presentToday}</p>
          <span className="mt-2 block text-xs text-slate-500">On Duty Today</span>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Absent</span>
            <span className="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-900/20"><UserX className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-3xl font-bold">{absentToday}</p>
          <span className="mt-2 block text-xs text-red-500">No punch log</span>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">On Leave</span>
            <span className="rounded-lg bg-yellow-50 p-2 text-yellow-600 dark:bg-yellow-900/20"><CalendarDays className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-3xl font-bold">{onLeaveToday}</p>
          <span className="mt-2 block text-xs text-amber-500">Approved Leaves</span>
        </div>

        {/* KPI 5 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Late Punches</span>
            <span className="rounded-lg bg-orange-50 p-2 text-orange-600 dark:bg-orange-900/20"><Clock className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-3xl font-bold">{lateToday}</p>
          <span className="mt-2 block text-xs text-amber-600">Past grace period</span>
        </div>

        {/* KPI 6 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Attendance</span>
            <span className="rounded-lg bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-900/20"><TrendingUp className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-3xl font-bold">{attendanceRate}%</p>
          <span className="mt-2 block text-xs text-emerald-600">Target: 95%</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart 1: Weekly Attendance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">Weekly Attendance Breakdown</h3>
          <p className="text-sm text-slate-500">Daily presence and late arrivals</p>
          <div className="mt-4 min-h-[300px]">
            {isMounted && (
              <Chart options={weeklyChartOptions} series={weeklyChartSeries} type="bar" height={320} />
            )}
          </div>
        </div>

        {/* Chart 2: Department Share */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">Department Distribution</h3>
          <p className="text-sm text-slate-500">Workforce split across business areas</p>
          <div className="mt-6 flex justify-center min-h-[300px]">
            {isMounted && (
              <Chart options={deptChartOptions} series={deptChartSeries} type="donut" width={320} />
            )}
          </div>
        </div>

        {/* Chart 3: Monthly Rate Trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">Attendance Rate Trend</h3>
          <p className="text-sm text-slate-500">Weekly performance changes this month</p>
          <div className="mt-4 min-h-[300px]">
            {isMounted && (
              <Chart options={trendChartOptions} series={trendChartSeries} type="area" height={300} />
            )}
          </div>
        </div>

        {/* Upcoming Holidays Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">Upcoming Holidays</h3>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/20">2026 Roster</span>
          </div>
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {upcomingHolidays.map((holiday, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold">{holiday.name}</p>
                  <p className="text-xs text-slate-500">{holiday.day} • {holiday.type}</p>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{holiday.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Navigation Links */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Activity Feed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">Recent System Logs</h3>
          <p className="text-sm text-slate-500 font-medium">Real-time action logs from HR module</p>
          
          <div className="mt-6 space-y-4">
            {activityFeed.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  activity.category === 'attendance' ? 'bg-blue-500' :
                  activity.category === 'leave' ? 'bg-yellow-500' :
                  activity.category === 'payroll' ? 'bg-green-500' : 'bg-slate-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{activity.employeeName}</span> {activity.action}
                  </p>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">Internal Modules</h3>
          <p className="text-sm text-slate-500">Quickly toggle settings or view schedules</p>
          
          <div className="mt-4 space-y-2">
            {[
              { name: 'Shift Assignments', view: 'shifts', desc: 'Rosters & schedules' },
              { name: 'Employee Directory', view: 'employees', desc: 'Manage organization directory' },
              { name: 'Payroll & Salary Slips', view: 'payroll', desc: 'Earnings & payslip prints' },
              { name: 'Analytics Reports', view: 'reports', desc: 'Export PDF & Excel summary sheet' },
            ].map((link, idx) => (
              <button
                key={idx}
                onClick={() => setView(link.view)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-100 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{link.name}</p>
                  <p className="text-xs text-slate-500">{link.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
