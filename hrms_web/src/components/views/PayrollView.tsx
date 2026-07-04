'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DollarSign, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  FileText, 
  Download, 
  ExternalLink, ArrowLeft, RefreshCw } from 'lucide-react';
import { PayrollEntry } from '../../utils/mockData';

// Dynamically import ApexCharts to avoid SSR build errors
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PayrollViewProps {
  payrollList: PayrollEntry[];
}

export default function PayrollView({ payrollList, setView }: PayrollViewProps & { setView?: any }) {
  const [selectedEntryId, setSelectedEntryId] = useState(payrollList[0]?.id || '');
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeEntry = payrollList.find(p => p.id === selectedEntryId) || payrollList[0];

  const handleDownload = (entry: PayrollEntry) => {
    alert(`Mock Payslip Downloaded: Payslip_${entry.employeeName.replace(' ', '_')}_May_2026.pdf`);
  };

  // 1. Calculations for Active Payslip
  const grossSalary = activeEntry.basicSalary + activeEntry.allowances;
  const totalDeductions = activeEntry.deductions + activeEntry.tax;
  const takeHomePercent = Math.round((activeEntry.netSalary / grossSalary) * 100);

  // 2. ApexCharts for Salary Breakdown (Donut)
  const salaryBreakdownOptions = {
    chart: { id: 'salary-donut', animations: { enabled: false } },
    colors: ['#2563EB', '#06B6D4', '#EF4444', '#F59E0B'],
    labels: ['Basic Salary', 'Allowances', 'Taxes', 'Deductions'],
    legend: { position: 'bottom' as const, labels: { colors: '#64748b' } },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Gross Pay',
              color: '#64748b',
              formatter: () => `₹${grossSalary.toLocaleString()}`
            }
          }
        }
      }
    }
  };

  const salaryBreakdownSeries = [
    activeEntry.basicSalary,
    activeEntry.allowances,
    activeEntry.tax,
    activeEntry.deductions
  ];

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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Payroll Portal</h2>
            <p className="text-sm text-slate-500 font-medium">Verify employee wages, download tax slips, and audit gross payments</p>
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

      {/* KPI Salary summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">Total May Payout</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20"><DollarSign className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold">₹{payrollList.reduce((acc, curr) => acc + curr.netSalary, 0).toLocaleString()}</p>
          <span className="mt-1 block text-xs text-emerald-600">Disbursed via bank transfer</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">Average Net Pay</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/20"><TrendingUp className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold">₹{Math.round(payrollList.reduce((acc, curr) => acc + curr.netSalary, 0) / payrollList.length).toLocaleString()}</p>
          <span className="mt-1 block text-xs text-slate-500">Per employee average</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">Average Tax Rate</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20"><Percent className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold">10.2%</p>
          <span className="mt-1 block text-xs text-slate-500">Deducted at source (TDS)</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">Compliance Audits</span>
            <span className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/20"><ShieldCheck className="h-5 w-5" /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold">Passed</p>
          <span className="mt-1 block text-xs text-emerald-600">Form 16/EPFO compliant</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Payslips history selection */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Payslip Records</h3>
          <p className="text-sm text-slate-500 mb-4">May 2026 payout details</p>

          <div className="space-y-3">
            {payrollList.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntryId(entry.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  entry.id === selectedEntryId
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                    : 'border-slate-100 hover:bg-slate-50 dark:border-slate-800/80'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-850 dark:text-slate-200">{entry.employeeName}</p>
                  <p className="text-xs text-slate-500">{entry.month} • {entry.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">₹{entry.netSalary.toLocaleString()}</p>
                  <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-4xs font-bold text-emerald-700 dark:bg-emerald-950/20">PAID</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Payslip detail viewer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 lg:col-span-2">
          {activeEntry ? (
            <div className="space-y-6">
              {/* Payslip Header */}
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-150">Payslip for {activeEntry.employeeName}</h3>
                  <p className="text-xs text-slate-500 mt-1">Month: {activeEntry.month} • Reference: {activeEntry.id}</p>
                </div>
                <button
                  onClick={() => handleDownload(activeEntry)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/10 transition-transform active:scale-95 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Download Payslip PDF
                </button>
              </div>

              {/* Salary Breakdown Donut + Financial Details */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Donut Chart */}
                <div className="flex items-center justify-center p-4 border border-slate-100 rounded-2xl dark:border-slate-800 bg-slate-50/20">
                  {isMounted && (
                    <Chart options={salaryBreakdownOptions} series={salaryBreakdownSeries} type="donut" width={300} />
                  )}
                </div>

                {/* Payroll Math Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Salary Structure Breakdown</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-650 dark:text-slate-400">Basic Wage Salary</span>
                      <span className="font-semibold">₹{activeEntry.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-650 dark:text-slate-400">Allowances (HRA, Special, Travel)</span>
                      <span className="font-semibold">₹{activeEntry.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800 text-emerald-600">
                      <span className="font-semibold">Gross Pay (A)</span>
                      <span className="font-bold">₹{grossSalary.toLocaleString()}</span>
                    </div>

                    <div className="pt-2" />

                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800 text-red-500">
                      <span>Taxes & TDS (B)</span>
                      <span className="font-semibold">-₹{activeEntry.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800 text-red-500">
                      <span>Statutory Deductions (PF, ESI)</span>
                      <span className="font-semibold">-₹{activeEntry.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800 text-red-650">
                      <span className="font-semibold">Total Deductions (C = B + D)</span>
                      <span className="font-bold">-₹{totalDeductions.toLocaleString()}</span>
                    </div>

                    <div className="pt-3" />

                    <div className="flex justify-between items-center rounded-xl bg-blue-50/50 p-4 border border-blue-100/30 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200">
                      <div>
                        <span className="block text-xs uppercase font-bold opacity-80">Net Take Home Pay</span>
                        <span className="text-2xs opacity-75">({takeHomePercent}% of Gross Pay)</span>
                      </div>
                      <span className="text-xl font-extrabold">₹{activeEntry.netSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-slate-400 py-8">Select a payslip record to inspect financials.</p>
          )}
        </div>
      </div>
    </div>
  );
}
