'use client';

import React from 'react';
import { User, 
  Briefcase, 
  CreditCard, 
  ShieldAlert, 
  FileText, 
  Download, 
  Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import { Employee } from '../../utils/mockData';

interface ProfileViewProps {
  employees: Employee[];
}

export default function ProfileView({ employees, setView }: ProfileViewProps & { setView?: any }) {
  // Use CEO/Admin or first record (AS - Vijay Kumar Tiwari) as default profile details
  const profile = employees[0] || {
    id: 'EMP-001',
    name: 'Vijay Kumar Tiwari',
    email: 'vijayrsgl@gmail.com',
    phone: '+91 98765 43210',
    role: 'HR Manager',
    department: 'Human Resources',
    designation: 'VP of Human Resources',
    status: 'Active',
    avatarUrl: 'AS',
    joinDate: '2026-01-27',
    branch: 'Kota Rajasthan HQ',
    salary: 18000,
    bankAccount: 'HDFC Bank - •••• 9823',
    managerName: 'Vijay Kumar Tiwari (CEO)',
    documents: [
      { name: 'Offer_Letter.pdf', date: '2026-01-27', size: '1.2 MB' },
      { name: 'KYC_Verification.pdf', date: '2026-01-27', size: '640 KB' },
    ],
  };

  const handleDownloadDoc = (docName: string) => {
    alert(`Mock file download: ${docName}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile Cover */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 flex flex-col gap-6 md:flex-row md:items-center">
        {/* Avatar badge */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-extrabold text-white shadow-lg shadow-blue-500/10">
          {profile.avatarUrl}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-850 dark:text-slate-100">{profile.name}</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/20">{profile.status}</span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">{profile.designation} • {profile.department}</p>
          <p className="text-xs text-slate-400 mt-0.5">Employee ID: <span className="font-semibold">{profile.id}</span> • Branch: {profile.branch}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Col: Account & Financial details */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Personal Specifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/80 pb-3">
              <User className="h-4.5 w-4.5 text-blue-500" /> Account Specifications
            </h3>
            
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-400">Email Address</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">{profile.email}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400">Contact Number</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">{profile.phone}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400">Joined Company On</span>
                <span className="font-medium text-slate-850 dark:text-slate-250 mt-1 block">{profile.joinDate}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400">Direct Supervisor</span>
                <span className="font-medium text-slate-850 dark:text-slate-250 mt-1 block">{profile.managerName}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/80 pb-3">
              <CreditCard className="h-4.5 w-4.5 text-blue-500" /> Banking & Payroll Details
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-400">Salary Scale Grade</span>
                <span className="font-medium text-slate-850 dark:text-slate-200 mt-1 block">₹{profile.salary.toLocaleString()}/month</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400">Disbursal Account</span>
                <span className="font-medium text-slate-850 dark:text-slate-200 mt-1 block">{profile.bankAccount}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Emergency contact info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
              <ShieldAlert className="h-4.5 w-4.5 text-blue-500" /> Emergency Contact
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-400">Primary Contact Person</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200 mt-1 block">Sunita Sharma</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400">Relationship & Phone</span>
                <span className="font-medium text-slate-850 dark:text-slate-200 mt-1 block">Spouse • +91 99000 77000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Uploaded documents and files */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-blue-500" /> Uploaded Docs
            </h3>
            <button 
              onClick={() => alert('Mocking: File upload dialog opened.')}
              className="rounded-lg p-1 hover:bg-slate-50 text-blue-600 dark:hover:bg-slate-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {profile.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
                  <span className="text-3xs text-slate-400 mt-0.5 block">{doc.date} • {doc.size}</span>
                </div>
                <button
                  onClick={() => handleDownloadDoc(doc.name)}
                  className="rounded-lg bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
