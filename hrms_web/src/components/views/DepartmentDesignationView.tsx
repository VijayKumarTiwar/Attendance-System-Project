'use client';

import React, { useState } from 'react';
import { Building2, Plus, Users, Shield, Briefcase, Award, Trash2, Edit3, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { initialDepartments, initialDesignations, Department, Designation } from '../../utils/mockData';

export default function DepartmentDesignationView({ setView }: any) {
  const [activeTab, setActiveTab] = useState<'depts' | 'designations'>('depts');
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [designations, setDesignations] = useState<Designation[]>(initialDesignations);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddDesigModal, setShowAddDesigModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editDeptName, setEditDeptName] = useState('');
  const [editDeptCode, setEditDeptCode] = useState('');
  const [editDeptHod, setEditDeptHod] = useState('');
  const [editDeptCostCenter, setEditDeptCostCenter] = useState('');

  // Form States - Dept
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptHod, setNewDeptHod] = useState('');
  const [newDeptCostCenter, setNewDeptCostCenter] = useState('');

  // Form States - Desig
  const [newDesigTitle, setNewDesigTitle] = useState('');
  const [newDesigGrade, setNewDesigGrade] = useState('Grade-5');
  const [newDesigDept, setNewDesigDept] = useState('Engineering');
  const [newDesigMin, setNewDesigMin] = useState(40000);
  const [newDesigMax, setNewDesigMax] = useState(100000);

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;

    const newDept: Department = {
      id: `D-0${departments.length + 1}`,
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      hod: newDeptHod || 'TBD',
      employeeCount: 0,
      costCenter: newDeptCostCenter || 'CC-000',
      color: 'bg-indigo-500',
    };

    setDepartments(prev => [...prev, newDept]);
    setShowAddDeptModal(false);
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptHod('');
    setNewDeptCostCenter('');
  };

  const openEditDept = (dept: Department) => {
    setEditingDept(dept);
    setEditDeptName(dept.name);
    setEditDeptCode(dept.code);
    setEditDeptHod(dept.hod);
    setEditDeptCostCenter(dept.costCenter);
  };

  const handleEditDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !editDeptName) return;
    setDepartments(prev => prev.map(d => d.id === editingDept.id ? {
      ...d,
      name: editDeptName,
      code: editDeptCode,
      hod: editDeptHod,
      costCenter: editDeptCostCenter,
    } : d));
    setEditingDept(null);
  };

  const handleDeleteDept = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleAddDesig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesigTitle) return;

    const newDesig: Designation = {
      id: `DES-0${designations.length + 1}`,
      title: newDesigTitle,
      grade: newDesigGrade,
      department: newDesigDept,
      minSalary: Number(newDesigMin),
      maxSalary: Number(newDesigMax),
      employeeCount: 0,
    };

    setDesignations(prev => [...prev, newDesig]);
    setShowAddDesigModal(false);
    setNewDesigTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Organization Structures</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure corporate hierarchies, official designations, and department cost centers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('depts')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'depts'
              ? 'bg-[#1a3b38] text-white dark:bg-emerald-500 dark:text-white'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Departments</span>
        </button>
        <button
          onClick={() => setActiveTab('designations')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'designations'
              ? 'bg-[#1a3b38] text-white dark:bg-emerald-500 dark:text-white'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Designations</span>
        </button>
        <button
          onClick={() => {
            if (activeTab === 'depts') setShowAddDeptModal(true);
            else setShowAddDesigModal(true);
          }}
          className="ml-auto flex items-center gap-1.5 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{activeTab === 'depts' ? 'Add Department' : 'Add Designation'}</span>
        </button>
      </div>
      {/* Tab Panels */}
      {activeTab === 'depts' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`h-9 w-9 rounded-2xl ${dept.color || 'bg-indigo-500'} text-white flex items-center justify-center`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-450 px-2 py-0.5 rounded font-bold uppercase">{dept.code}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mt-4 text-sm">{dept.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Head of Dept: {dept.hod}</span>
                </p>
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800/60 pt-4 flex justify-between items-center text-xs font-bold">
                <div className="text-slate-400 font-semibold">
                  Cost Center: <strong className="text-slate-700 dark:text-slate-200 font-mono">{dept.costCenter}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 border border-emerald-100 rounded text-[10px]">
                    {dept.employeeCount} Staff
                  </span>
                  <button 
                    onClick={() => openEditDept(dept)}
                    className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-[#1a3b38] transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Designations Table */
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Designation Title</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Grade Level</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Default Department</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider text-right">Min Salary</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider text-right">Max Salary</th>
                  <th className="px-4 py-3 text-slate-400 font-bold uppercase tracking-wider text-center">Active Staff</th>
                  <th className="px-4 py-3 text-slate-450 font-bold uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                {designations.map((desig) => (
                  <tr key={desig.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-4 py-3.5">{desig.title}</td>
                    <td className="px-4 py-3.5 font-normal font-mono">{desig.grade}</td>
                    <td className="px-4 py-3.5 font-normal">{desig.department}</td>
                    <td className="px-4 py-3.5 text-right font-normal">₹{desig.minSalary.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-normal">₹{desig.maxSalary.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold text-[9px] border border-emerald-100">
                        {desig.employeeCount} active
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 rounded transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowAddDeptModal(false)} className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Add Department</h3>
            <form onSubmit={handleAddDept} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. Corporate Communications"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Dept Code</label>
                  <input
                    type="text"
                    required
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                    placeholder="e.g. CORP-01"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Cost Center</label>
                  <input
                    type="text"
                    value={newDeptCostCenter}
                    onChange={(e) => setNewDeptCostCenter(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                    placeholder="CC-009"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Head of Dept (HOD)</label>
                <input
                  type="text"
                  value={newDeptHod}
                  onChange={(e) => setNewDeptHod(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  placeholder="Name of manager"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="rounded-xl border border-slate-250 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a3b38] dark:bg-emerald-600 hover:bg-[#122e2b] text-white rounded-xl px-5 py-2 text-xs font-semibold transition-all shadow-md"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Designation Modal */}
      {showAddDesigModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowAddDesigModal(false)} className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Add Designation</h3>
            <form onSubmit={handleAddDesig} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Designation Title</label>
                <input
                  type="text"
                  required
                  value={newDesigTitle}
                  onChange={(e) => setNewDesigTitle(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. Lead Devops Architect"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Grade Level</label>
                  <select
                    value={newDesigGrade}
                    onChange={(e) => setNewDesigGrade(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  >
                    <option value="Grade-1">Grade-1 (Executive)</option>
                    <option value="Grade-2">Grade-2 (Director)</option>
                    <option value="Grade-3">Grade-3 (Manager)</option>
                    <option value="Grade-4">Grade-4 (Senior Staff)</option>
                    <option value="Grade-5">Grade-5 (Associate)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Department</label>
                  <input
                    type="text"
                    value={newDesigDept}
                    onChange={(e) => setNewDesigDept(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    placeholder="Engineering"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Min Annual Salary</label>
                  <input
                    type="number"
                    value={newDesigMin}
                    onChange={(e) => setNewDesigMin(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Max Annual Salary</label>
                  <input
                    type="number"
                    value={newDesigMax}
                    onChange={(e) => setNewDesigMax(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDesigModal(false)}
                  className="rounded-xl border border-slate-250 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a3b38] dark:bg-emerald-600 hover:bg-[#122e2b] text-white rounded-xl px-5 py-2 text-xs font-semibold transition-all shadow-md"
                >
                  Create Designation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
