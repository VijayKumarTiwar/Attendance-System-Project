'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  FileDown, 
  Calendar, 
  Settings, 
  BarChart4, 
  PieChart, 
  LineChart,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Dynamically import ApexCharts to avoid SSR build errors
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ReportsViewProps {
  setView?: (view: string) => void;
}

export default function ReportsView({ setView }: ReportsViewProps) {
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('July 2026');
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Chart 1: Average Monthly Work Hours (Line/Area)
  const hoursChartOptions = {
    chart: { id: 'hours-trend', toolbar: { show: false }, animations: { enabled: false } },
    stroke: { curve: 'smooth' as const, width: 3 },
    colors: ['#2563EB'],
    xaxis: {
      categories: last5Days,
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      title: { text: 'Hours worked', style: { color: '#64748b' } },
      labels: { style: { colors: '#64748b' } }
    },
    grid: { borderColor: '#f1f5f9' },
  };

  const hoursChartSeries = [
    { name: 'Average Daily Hours', data: [7.8, 8.2, 8.1, 8.3, 8.0] }
  ];

  // Chart 2: Overtime distribution by department (Bar)
  const overtimeChartOptions = {
    chart: { id: 'overtime-dept', toolbar: { show: false }, animations: { enabled: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    colors: ['#06B6D4'],
    xaxis: {
      categories: ['Engineering', 'HR', 'Operations', 'Sales', 'Finance'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      labels: { style: { colors: '#64748b' } }
    },
    grid: { borderColor: '#f1f5f9' },
  };

  const overtimeChartSeries = [
    { name: 'Overtime Hours (Weekly)', data: [24, 2, 12, 18, 1] }
  ];

  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsExporting(format);
    
    setTimeout(() => {
      const fileName = `RSGL_${reportType}_${dateRange.replace(' ', '_')}`;
      
      // Sample mock data for the export
      const data = [
        { Name: 'Vijay Kumar Tiwari', Department: 'Administration', Status: 'Present', CheckIn: '09:00 AM', CheckOut: '06:00 PM' },
        { Name: 'Rajesh Sharma', Department: 'Engineering', Status: 'Present', CheckIn: '09:15 AM', CheckOut: '06:30 PM' },
        { Name: 'Priya Singh', Department: 'HR', Status: 'On Leave', CheckIn: '-', CheckOut: '-' },
        { Name: 'Amit Patel', Department: 'Marketing', Status: 'Late', CheckIn: '10:30 AM', CheckOut: '07:00 PM' },
        { Name: 'Sneha Gupta', Department: 'Finance', Status: 'Present', CheckIn: '08:55 AM', CheckOut: '05:45 PM' },
      ];

      try {
        if (format === 'excel') {
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
          XLSX.writeFile(workbook, `${fileName}.xlsx`);
        } else {
          const doc = new jsPDF();
          doc.setFontSize(18);
          doc.text(`RSGL ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 15);
          doc.setFontSize(11);
          doc.setTextColor(100);
          doc.text(`Period: ${dateRange}`, 14, 23);
          
          const tableColumn = Object.keys(data[0]);
          const tableRows = data.map(obj => Object.values(obj));
          
          autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [26, 59, 56] }
          });
          
          doc.save(`${fileName}.pdf`);
        }
      } catch (err) {
        console.error("Export failed", err);
      }
      
      setIsExporting(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans">Analytics & Reports</h2>
            <p className="text-sm text-slate-500 font-medium">Export raw database dumps, review compliance ratios, and track workforce productivity</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Refresh Data"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Configuration Controls Bar */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:grid-cols-4">
        {/* Report selection */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Report Template</label>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="attendance">Daily Attendance Summary</option>
            <option value="leave">Leave Balance & Accruals</option>
            <option value="payroll">Statutory Payroll Audits</option>
            <option value="productivity">Overtime & Productivity Sheet</option>
          </select>
        </div>

        {/* Date selection */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Date Period</label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="January 2026">January 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="March 2026">March 2026</option>
            <option value="April 2026">April 2026</option>
            <option value="May 2026">May 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="July 2026">July 2026 (Active)</option>
            <option value="August 2026">August 2026</option>
            <option value="September 2026">September 2026</option>
            <option value="October 2026">October 2026</option>
            <option value="November 2026">November 2026</option>
            <option value="December 2026">December 2026</option>
            <option value="Q1 2026">Q1 2026 (Quarterly)</option>
            <option value="Q2 2026">Q2 2026 (Quarterly)</option>
            <option value="Q3 2026">Q3 2026 (Quarterly)</option>
            <option value="Q4 2026">Q4 2026 (Quarterly)</option>
          </select>
        </div>

        {/* Action Button 1 */}
        <div className="flex items-end">
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting !== null}
            className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bold transition-colors shadow-sm ${
              isExporting === 'excel' 
                ? 'bg-slate-700 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 text-slate-100 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
            }`}
          >
            {isExporting === 'excel' ? (
              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <FileDown className="h-4.5 w-4.5 text-blue-400" />
            )}
            {isExporting === 'excel' ? 'Exporting...' : 'Export MS Excel (.xlsx)'}
          </button>
        </div>

        {/* Action Button 2 */}
        <div className="flex items-end">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting !== null}
            className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bold text-white transition-transform ${
              isExporting === 'pdf'
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 shadow-lg shadow-blue-500/10 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isExporting === 'pdf' ? (
              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <FileDown className="h-4.5 w-4.5" />
            )}
            {isExporting === 'pdf' ? 'Generating PDF...' : 'Export Document (.pdf)'}
          </button>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Productivity chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Daily Work Hours</h3>
              <p className="text-sm text-slate-500">Average duration trends over the past 5 roster days</p>
            </div>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20"><LineChart className="h-5 w-5" /></span>
          </div>
          <div className="min-h-[250px]">
            {isMounted && (
              <Chart options={hoursChartOptions} series={hoursChartSeries} type="area" height={250} />
            )}
          </div>
        </div>

        {/* Overtime breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Overtime hours by department</h3>
              <p className="text-sm text-slate-500">Total weekly overtime hours mapped across teams</p>
            </div>
            <span className="rounded-lg bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-900/20"><BarChart4 className="h-5 w-5" /></span>
          </div>
          <div className="min-h-[250px]">
            {isMounted && (
              <Chart options={overtimeChartOptions} series={overtimeChartSeries} type="bar" height={250} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
