'use client';

import React, { useState } from 'react';
import { Search, GitBranch, LayoutGrid, Users, Building, ShieldCheck, Mail, Phone, MapPin, ArrowLeft, RefreshCw } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  code: string;
  dept: string;
  color: string;
  email: string;
  phone: string;
  subordinates?: Member[];
}

export default function OrgChartView({ setView }: any) {
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>({
    name: 'Vijay Kumar Tiwari',
    role: 'Chief Executive Officer',
    code: 'EMP-001',
    dept: 'Management',
    color: 'bg-emerald-600',
    email: 'vijay.tiwari@rsgl.rajasthan.gov.in',
    phone: '+91 94140 12345',
  });

  // Hierarchy Data
  const ceo: Member = {
    name: 'Vijay Kumar Tiwari',
    role: 'Chief Executive Officer',
    code: 'EMP-001',
    dept: 'Management',
    color: 'bg-emerald-600',
    email: 'vijay.tiwari@rsgl.rajasthan.gov.in',
    phone: '+91 94140 12345',
    subordinates: [
      {
        name: 'Amit Sharma',
        role: 'VP of Human Resources',
        code: 'EMP-002',
        dept: 'Human Resources',
        color: 'bg-purple-650',
        email: 'amit.sharma@rsgl.in',
        phone: '+91 98765 00001',
        subordinates: [
          {
            name: 'Priya Patel',
            role: 'Senior Frontend Engineer',
            code: 'EMP-004',
            dept: 'Engineering',
            color: 'bg-blue-600',
            email: 'priya.patel@rsgl.in',
            phone: '+91 98765 00003',
          },
          {
            name: 'Siddharth Sen',
            role: 'Software Engineer',
            code: 'EMP-005',
            dept: 'Engineering',
            color: 'bg-blue-600',
            email: 'siddharth.sen@rsgl.in',
            phone: '+91 98765 00004',
          }
        ]
      },
      {
        name: 'Rahul Kumar',
        role: 'Operations Lead Manager',
        code: 'EMP-003',
        dept: 'Operations',
        color: 'bg-orange-500',
        email: 'rahul.kumar@rsgl.in',
        phone: '+91 98765 00002',
        subordinates: [
          {
            name: 'Anjali Desai',
            role: 'Senior Account Executive',
            code: 'EMP-006',
            dept: 'Sales',
            color: 'bg-green-600',
            email: 'anjali.desai@rsgl.in',
            phone: '+91 98765 00005',
          },
          {
            name: 'Vikram Singh',
            role: 'Financial Analyst',
            code: 'EMP-007',
            dept: 'Finance',
            color: 'bg-amber-500',
            email: 'vikram.singh@rsgl.in',
            phone: '+91 98765 00006',
          }
        ]
      }
    ]
  };

  // Flatten helper for search/list mode
  const flattenMembers = (node: Member): Member[] => {
    let result = [node];
    if (node.subordinates) {
      node.subordinates.forEach(child => {
        result = [...result, ...flattenMembers(child)];
      });
    }
    return result;
  };

  const allMembers = flattenMembers(ceo);

  const filteredMembers = allMembers.filter(m => {
    const matchesDept = selectedDept === 'All' || m.dept === selectedDept;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Organization Structure</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Visualize reporting lines, departments and command structures</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggles */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('tree')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'tree' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1a3b38] dark:text-white' : 'text-slate-550 dark:text-slate-400'
              }`}
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span>Tree View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1a3b38] dark:text-white' : 'text-slate-550 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid List</span>
            </button>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold shadow-sm outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Management">Management</option>
            <option value="Human Resources">HR & Training</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Main layout: 2 cols (Tree/List + Details Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm overflow-x-auto min-h-[450px] flex flex-col justify-start">
          {viewMode === 'tree' ? (
            <div className="flex flex-col items-center gap-8 w-full min-w-[500px] pt-4">
              {/* Level 1: CEO */}
              <div
                onClick={() => setSelectedMember(ceo)}
                className={`cursor-pointer p-4 rounded-2xl border text-center shadow-md transition-all ${
                  selectedMember?.name === ceo.name ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-slate-200 dark:border-slate-800'
                } bg-slate-50 dark:bg-slate-800/40 w-52 hover:scale-105`}
              >
                <div className={`h-10 w-10 rounded-full mx-auto flex items-center justify-center font-bold text-white text-xs ${ceo.color}`}>
                  VK
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mt-2 text-sm">{ceo.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{ceo.role}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {ceo.dept}
                </span>
              </div>

              {/* Connecting line */}
              <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700" />

              {/* Level 2: VP HR & COO */}
              <div className="flex justify-around w-full gap-8 relative">
                {/* Horizontal connection bar */}
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-350 dark:bg-slate-700" />

                {ceo.subordinates?.map((sub, sIdx) => (
                  <div key={sIdx} className="flex flex-col items-center gap-6">
                    {/* Vertical line up */}
                    <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700" />
                    
                    <div
                      onClick={() => setSelectedMember(sub)}
                      className={`cursor-pointer p-4 rounded-2xl border text-center shadow-md transition-all ${
                        selectedMember?.name === sub.name ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-slate-200 dark:border-slate-800'
                      } bg-slate-50 dark:bg-slate-800/40 w-48 hover:scale-105`}
                    >
                      <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center font-bold text-white text-xs ${sub.color}`}>
                        {sub.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h4 className="font-bold text-slate-855 dark:text-white mt-2 text-xs">{sub.name}</h4>
                      <p className="text-[9px] text-slate-400 font-semibold tracking-wider">{sub.role}</p>
                      <span className="inline-block mt-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/20">
                        {sub.dept}
                      </span>
                    </div>

                    {/* Connecting line down */}
                    {sub.subordinates && <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700" />}

                    {/* Level 3: Staff */}
                    {sub.subordinates && (
                      <div className="flex gap-4">
                        {sub.subordinates.map((staff, stIdx) => (
                          <div
                            key={stIdx}
                            onClick={() => setSelectedMember(staff)}
                            className={`cursor-pointer p-3 rounded-xl border text-center shadow-sm transition-all ${
                              selectedMember?.name === staff.name ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-slate-100 dark:border-slate-800/60'
                            } bg-white dark:bg-slate-900 w-36 hover:scale-105`}
                          >
                            <div className={`h-6 w-6 rounded-full mx-auto flex items-center justify-center font-bold text-white text-[10px] ${staff.color}`}>
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h5 className="font-bold text-slate-800 dark:text-white mt-1 text-[11px] truncate">{staff.name}</h5>
                            <p className="text-[8px] text-slate-400 truncate">{staff.role}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="space-y-4 w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reporting line by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none shadow-sm focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredMembers.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedMember(m)}
                    className={`p-3 border rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all ${
                      selectedMember?.name === m.name ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/5' : 'border-slate-100 dark:border-slate-850'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-white text-[11px] ${m.color}`}>
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{m.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate mt-0.5">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Details Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-6">
          {selectedMember ? (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
                <div className={`h-16 w-16 rounded-full mx-auto flex items-center justify-center font-bold text-white text-xl shadow-md ${selectedMember.color}`}>
                  {selectedMember.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mt-3 text-base">{selectedMember.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{selectedMember.role}</p>
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 rounded-full px-2.5 py-0.5 mt-3 text-[10px] font-bold">
                  <ShieldCheck className="h-3 w-3" />
                  Active Employee
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Contact & Org Info</h4>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Building className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">Department</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedMember.dept}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">Employee Code</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedMember.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">Email ID</p>
                      <a href={`mailto:${selectedMember.email}`} className="font-semibold text-emerald-600 dark:text-emerald-450 hover:underline">{selectedMember.email}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">Mobile Phone</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedMember.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 dark:text-slate-600">
              <Users className="h-10 w-10 mx-auto opacity-30 mb-2" />
              <p className="text-xs font-semibold">Select an employee node to view detailed reporting information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
