'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  TrendingUp, TrendingDown, Users, Clock, CalendarDays,
  BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight,
  Filter, Download, ChevronDown
} from 'lucide-react';
import { Employee, AttendanceLog, LeaveRequest } from '../../utils/mockData';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnalyticsViewProps {
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  leaveRequests: LeaveRequest[];
  setView?: any;
}

export default function AnalyticsView({ employees, attendanceLogs, leaveRequests, setView }: AnalyticsViewProps) {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // ── Summary Stats ──
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'On Leave').length;
  const presentToday = attendanceLogs.filter(l => l.status === 'Present' || l.status === 'Late').length;
  const absentToday = attendanceLogs.filter(l => l.status === 'Absent').length;
  const avgWorkHours = attendanceLogs.length > 0 
    ? (attendanceLogs.reduce((sum, l) => sum + l.workHours, 0) / attendanceLogs.filter(l => l.workHours > 0).length).toFixed(1) 
    : '0';
  const lateArrivals = attendanceLogs.filter(l => l.status === 'Late').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;

  const summaryCards = [
    { title: 'Total Employees', value: totalEmployees, change: '+2 this month', trend: 'up', icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Present Today', value: presentToday, change: `${absentToday} absent`, trend: 'up', icon: Activity, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Avg. Work Hours', value: avgWorkHours, change: 'hrs/day', trend: 'up', icon: Clock, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { title: 'Late Arrivals', value: lateArrivals, change: 'this week', trend: 'down', icon: TrendingDown, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  // ── Chart Configs ──

  // 1. Weekly Attendance Trend (Area Chart)
  const attendanceTrendOptions: any = {
    chart: { animations: { enabled: false },
      type: 'area', 
      toolbar: { show: false }, 
      fontFamily: 'inherit',
      sparkline: { enabled: false }
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 95, 100] },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#94a3b8', fontWeight: 600 } },
    },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4, xaxis: { lines: { show: false } } },
    legend: { position: 'top', horizontalAlign: 'right', fontWeight: 700, fontSize: '13px', labels: { colors: '#64748b' } },
    tooltip: { theme: 'dark' },
  };
  const attendanceTrendSeries = [
    { name: 'Present', data: [42, 45, 40, 44, 43, 10, 5] },
    { name: 'Late', data: [3, 2, 5, 1, 4, 0, 0] },
    { name: 'Absent', data: [1, 0, 2, 1, 0, 36, 41] },
  ];

  // 2. Department-wise Headcount (Donut Chart)
  const deptCounts: Record<string, number> = {};
  employees.forEach(e => { deptCounts[e.department] = (deptCounts[e.department] || 0) + 1; });
  const deptLabels = Object.keys(deptCounts);
  const deptValues = Object.values(deptCounts);

  const deptDonutOptions: any = {
    chart: { type: 'donut', fontFamily: 'inherit', animations: { enabled: false } },
    colors: ['#6366f1', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'],
    labels: deptLabels,
    legend: { position: 'bottom', fontWeight: 700, fontSize: '12px', labels: { colors: '#64748b' } },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { fontSize: '14px', fontWeight: 700, color: '#64748b' },
            value: { fontSize: '28px', fontWeight: 800, color: '#1e293b' },
            total: { show: true, label: 'Total', fontSize: '13px', fontWeight: 600, color: '#94a3b8' },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 3, colors: ['#fff'] },
    tooltip: { theme: 'dark' },
  };

  // 3. Leave Type Distribution (Bar Chart)
  const leaveTypeCounts: Record<string, number> = {};
  leaveRequests.forEach(l => { leaveTypeCounts[l.type] = (leaveTypeCounts[l.type] || 0) + 1; });

  const leaveBarOptions: any = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', animations: { enabled: false } },
    colors: ['#6366f1'],
    plotOptions: {
      bar: { borderRadius: 8, columnWidth: '50%', distributed: true },
    },
    xaxis: {
      categories: Object.keys(leaveTypeCounts).map(k => k.replace(' Leave', '')),
      labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontWeight: 600 } } },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4, xaxis: { lines: { show: false } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: 'dark' },
    colors: ['#3b82f6', '#10b981', '#a855f7', '#f43f5e'],
  };
  const leaveBarSeries = [{ name: 'Requests', data: Object.values(leaveTypeCounts) }];

  // 4. Monthly Attendance Rate (Radial Bar)
  const attendanceRate = attendanceLogs.length > 0 
    ? Math.round(((presentToday + lateArrivals) / attendanceLogs.length) * 100) 
    : 0;

  const radialOptions: any = {
    chart: { type: 'radialBar', fontFamily: 'inherit', animations: { enabled: false } },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '65%' },
        track: { background: '#e2e8f0', strokeWidth: '100%' },
        dataLabels: {
          name: { fontSize: '14px', color: '#94a3b8', offsetY: 80, fontWeight: 600 },
          value: { fontSize: '36px', fontWeight: 800, color: '#1e293b', offsetY: -10 },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: { shade: 'dark', shadeIntensity: 0.3, gradientToColors: ['#10b981'], stops: [0, 100] },
    },
    stroke: { lineCap: 'round' },
    colors: ['#1a3b38'],
    labels: ['Attendance Rate'],
  };

  // 5. Payroll Cost by Department (Horizontal Bar)
  const deptSalary: Record<string, number> = {};
  employees.forEach(e => { deptSalary[e.department] = (deptSalary[e.department] || 0) + e.salary; });

  const payrollBarOptions: any = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', animations: { enabled: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '55%' } },
    colors: ['#1a3b38'],
    xaxis: {
      labels: { 
        style: { colors: '#94a3b8', fontWeight: 600 },
        formatter: (val: string) => '₹' + (Number(val) / 1000).toFixed(0) + 'K',
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#64748b', fontWeight: 700, fontSize: '12px' } } },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4, yaxis: { lines: { show: false } } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark', y: { formatter: (val: number) => '₹' + val.toLocaleString('en-IN') } },
  };
  const payrollBarSeries = [{ name: 'Total Salary', data: Object.values(deptSalary) }];
  const payrollBarCategories = Object.keys(deptSalary);
  (payrollBarOptions.xaxis as any).categories = payrollBarCategories; // set dynamically
  // Actually, for horizontal bar, categories go on yaxis
  if (payrollBarOptions.yaxis && !Array.isArray(payrollBarOptions.yaxis)) {
    (payrollBarOptions as any).xaxis.categories = undefined;
    (payrollBarOptions as any).yaxis = { ...payrollBarOptions.yaxis, categories: payrollBarCategories };
  }

  // 6. Attendance Heatmap (Mock Data)
  const heatmapOptions: any = {
    chart: { type: 'heatmap', toolbar: { show: false }, fontFamily: 'inherit', animations: { enabled: false } },
    plotOptions: {
      heatmap: { radius: 4, colorScale: {
        ranges: [
          { from: 0, to: 20, color: '#fee2e2', name: 'Low' },
          { from: 21, to: 35, color: '#fef3c7', name: 'Medium' },
          { from: 36, to: 50, color: '#d1fae5', name: 'High' },
        ],
      }},
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      labels: { style: { colors: '#94a3b8', fontWeight: 600 } },
    },
    tooltip: { theme: 'dark' },
    colors: ['#10b981'],
  };
  const heatmapSeries = [
    { name: 'HR', data: [{ x: 'Mon', y: 42 }, { x: 'Tue', y: 45 }, { x: 'Wed', y: 40 }, { x: 'Thu', y: 44 }, { x: 'Fri', y: 38 }] },
    { name: 'Engineering', data: [{ x: 'Mon', y: 38 }, { x: 'Tue', y: 40 }, { x: 'Wed', y: 35 }, { x: 'Thu', y: 42 }, { x: 'Fri', y: 30 }] },
    { name: 'Operations', data: [{ x: 'Mon', y: 30 }, { x: 'Tue', y: 32 }, { x: 'Wed', y: 28 }, { x: 'Thu', y: 35 }, { x: 'Fri', y: 25 }] },
    { name: 'Sales', data: [{ x: 'Mon', y: 20 }, { x: 'Tue', y: 22 }, { x: 'Wed', y: 18 }, { x: 'Thu', y: 25 }, { x: 'Fri', y: 15 }] },
    { name: 'Finance', data: [{ x: 'Mon', y: 15 }, { x: 'Tue', y: 18 }, { x: 'Wed', y: 12 }, { x: 'Thu', y: 20 }, { x: 'Fri', y: 10 }] },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Analytics Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Comprehensive workforce insights and attendance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['week', 'month', 'quarter'] as const).map(p => (
              <button 
                key={p} 
                onClick={() => setTimePeriod(p)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${timePeriod === p ? 'bg-white dark:bg-slate-700 text-[#1a3b38] dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${card.bg}`}>
                    <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold ${card.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {card.trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {card.change}
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{card.value}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 1: Attendance Trend + Attendance Rate ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Attendance Trend</h3>
              <p className="text-xs text-slate-500 font-medium">Weekly present vs late vs absent breakdown</p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">This Week</span>
          </div>
          <Chart options={attendanceTrendOptions} series={attendanceTrendSeries} type="area" height={300} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Attendance Rate</h3>
          <p className="text-xs text-slate-500 font-medium mb-4">Overall punctuality score</p>
          <Chart options={radialOptions} series={[attendanceRate]} type="radialBar" height={280} />
        </div>
      </div>

      {/* ── Row 2: Department Donut + Leave Distribution ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Department Distribution</h3>
              <p className="text-xs text-slate-500 font-medium">Headcount by department</p>
            </div>
            <PieChart className="h-5 w-5 text-slate-400" />
          </div>
          <Chart options={deptDonutOptions} series={deptValues} type="donut" height={320} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Leave Requests by Type</h3>
              <p className="text-xs text-slate-500 font-medium">Distribution of leave applications</p>
            </div>
            <span className="text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full">{pendingLeaves} Pending</span>
          </div>
          <Chart options={leaveBarOptions} series={leaveBarSeries} type="bar" height={320} />
        </div>
      </div>

      {/* ── Row 3: Payroll Cost + Attendance Heatmap ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Payroll Cost by Department</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly salary expenditure</p>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>
          <Chart options={payrollBarOptions} series={payrollBarSeries} type="bar" height={300} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Attendance Heatmap</h3>
              <p className="text-xs text-slate-500 font-medium">Department-wise daily attendance intensity</p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <Chart options={heatmapOptions} series={heatmapSeries} type="heatmap" height={300} />
        </div>
      </div>

      {/* ── Row 4: Quick Stats Bottom Bar ── */}
      <div className="bg-gradient-to-r from-[#1a3b38] to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-6">Quick Workforce Snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">New Hires (Month)</p>
              <p className="text-3xl font-extrabold">2</p>
            </div>
            <div>
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">Resignations</p>
              <p className="text-3xl font-extrabold">0</p>
            </div>
            <div>
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">Avg. Tenure</p>
              <p className="text-3xl font-extrabold">1.8 <span className="text-lg">yrs</span></p>
            </div>
            <div>
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">Total Payroll</p>
              <p className="text-3xl font-extrabold">₹{(employees.reduce((s, e) => s + e.salary, 0) / 100000).toFixed(1)} <span className="text-lg">L</span></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
