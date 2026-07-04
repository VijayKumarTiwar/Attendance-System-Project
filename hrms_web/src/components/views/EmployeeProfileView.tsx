'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, 
  CreditCard, FileText, Download, Edit3, Shield, Award,
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { Employee } from '../../utils/mockData';

interface EmployeeProfileViewProps {
  employee: Employee | null;
  onBack: () => void;
}

export default function EmployeeProfileView({ employee, onBack }: EmployeeProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'job' | 'salary' | 'documents'>('overview');

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <AlertCircle className="h-12 w-12 mb-4 text-slate-300" />
        <p>Employee not found.</p>
        <button onClick={onBack} className="mt-4 text-[#1a3b38] font-semibold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1a3b38] dark:text-slate-400 dark:hover:text-emerald-400 transition-colors font-semibold bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </button>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 text-slate-600 bg-white dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button className="flex items-center gap-2 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#1a3b38]/10 to-emerald-500/10 dark:from-emerald-900/20 dark:to-teal-900/20" />
        
        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end pt-12">
          <div className="h-28 w-28 rounded-3xl bg-white dark:bg-slate-800 p-1.5 shadow-xl border border-slate-100 dark:border-slate-700 shrink-0">
            {employee.avatarUrl ? (
              <img src={employee.avatarUrl} alt={employee.name} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-[#1a3b38] to-emerald-600 text-white flex items-center justify-center text-3xl font-bold shadow-inner">
                {getInitials(employee.name)}
              </div>
            )}
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                  {employee.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {employee.designation} • {employee.department}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  employee.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    : employee.status === 'On Leave'
                    ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                    : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                }`}>
                  {employee.status}
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
                  {employee.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: CheckCircle },
          { id: 'personal', label: 'Personal Details', icon: Shield },
          { id: 'job', label: 'Job Information', icon: Briefcase },
          { id: 'salary', label: 'Salary & Bank', icon: CreditCard },
          { id: 'documents', label: 'Documents', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-[#1a3b38] dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-800'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-900/50 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 md:p-8 shadow-sm">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-2.5 rounded-xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-0.5">Email Address</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 p-2.5 rounded-xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-0.5">Phone Number</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 p-2.5 rounded-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-0.5">Work Location</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.branch}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Reporting Line</h3>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                    {getInitials(employee.managerName || 'System')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.managerName || 'No Manager Assigned'}</p>
                    <p className="text-xs text-slate-500">Reporting Manager</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Tenure</h3>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 p-2 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Joined: {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</p>
                    <p className="text-xs text-slate-500">Full-time Employee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERSONAL DETAILS TAB */}
        {activeTab === 'personal' && (
          <div className="space-y-8 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Full Name</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.name}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Date of Birth</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">15 Aug 1990 (Mocked)</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Gender</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Not Specified</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Blood Group</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">O+ (Mocked)</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 pt-4">Emergency Contact</h3>
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-start gap-4">
              <Shield className="h-6 w-6 text-red-500 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Ramesh Sharma (Father)</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">+91 98765 43210</p>
                <p className="text-xs text-slate-500 mt-1">123 Safe Street, Bangalore, India</p>
              </div>
            </div>
          </div>
        )}

        {/* JOB INFORMATION TAB */}
        {activeTab === 'job' && (
          <div className="space-y-8 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Employee ID</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-mono">{employee.id}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">System Role</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.role}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Department</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.department}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Designation</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.designation}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Date of Joining</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.joinDate}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Probation Status</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Completed</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 pt-4">Work Schedule</h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <Clock className="h-6 w-6 text-[#1a3b38] dark:text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">General Shift (09:00 AM - 06:00 PM)</p>
                <p className="text-xs text-slate-500">Monday to Friday • 40 hrs/week</p>
              </div>
            </div>
          </div>
        )}

        {/* SALARY TAB */}
        {activeTab === 'salary' && (
          <div className="space-y-8 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Compensation Information</h3>
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <CreditCard className="h-40 w-40 -mt-10 -mr-10" />
              </div>
              <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-widest">Annual CTC</p>
              <h2 className="text-3xl font-bold font-mono tracking-tight">₹ {employee.salary.toLocaleString('en-IN')}</h2>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Basic Pay (Monthly)</p>
                  <p className="font-semibold text-sm">₹ {Math.round(employee.salary * 0.4 / 12).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">HRA (Monthly)</p>
                  <p className="font-semibold text-sm">₹ {Math.round(employee.salary * 0.2 / 12).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 pt-4">Bank Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Bank Name</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">HDFC Bank (Mocked)</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Account Name</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{employee.name}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">Account Number</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-mono tracking-widest">{employee.bankAccount || 'XXXX-XXXX-1234'}</p>
              </div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500 font-semibold mb-1">IFSC Code</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-mono">HDFC0001234</p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Uploaded Documents</h3>
              <button className="text-xs font-bold text-[#1a3b38] dark:text-emerald-400 hover:underline">
                + Upload New
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Offer_Letter_Signed.pdf', date: employee.joinDate, size: '1.2 MB' },
                { name: 'Aadhar_Card.pdf', date: '2024-01-05', size: '2.4 MB' },
                { name: 'PAN_Card.jpg', date: '2024-01-05', size: '850 KB' },
                { name: 'Graduation_Certificate.pdf', date: '2024-01-06', size: '3.1 MB' }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 p-2.5 rounded-xl">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{doc.name}</p>
                      <p className="text-xs text-slate-500">Uploaded {doc.date} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-[#1a3b38] dark:hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
