'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, 
  List, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  UserCheck, 
  X,
  FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import { Employee } from '../../utils/mockData';

interface EmployeesViewProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onViewProfile?: (id: string) => void;
}

export default function EmployeesView({ employees, onAddEmployee, setView, onViewProfile }: EmployeesViewProps & { setView?: any }) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>('grid');
  
  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Hook Form for Employee Creation
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Employee, 'avatarUrl' | 'documents'>>();

  const onSubmitForm = (data: any) => {
    const newEmp: Employee = {
      ...data,
      id: `EMP-0${employees.length + 1}`,
      avatarUrl: data.name.split(' ').map((n: string) => n.charAt(0)).join(''),
      documents: [
        { name: 'Offer_Letter.pdf', date: new Date().toISOString().split('T')[0], size: '1.2 MB' }
      ]
    };
    onAddEmployee(newEmp);
    setIsModalOpen(false);
    reset();
    alert(`Success: Employee ${newEmp.name} created!`);
  };

  // Filtered employees list
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans">Employee Directory</h2>
          <p className="text-sm text-slate-500">Add, manage, and audit organizational profiles</p>
        </div>
        <button
          id="btn-add-employee"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-bold text-white shadow-lg shadow-blue-500/20 transition-transform active:scale-95 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Employee
        </button>
      </div>

      {/* Directory Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Briefcase className="h-4.5 w-4.5 text-slate-400" />
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
          <UserCheck className="h-4.5 w-4.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Layout Mode Toggles */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`rounded-lg p-1.5 transition-colors ${layoutMode === 'grid' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setLayoutMode('table')}
            className={`rounded-lg p-1.5 transition-colors ${layoutMode === 'table' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Employees Directory List */}
      {layoutMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} onClick={() => onViewProfile && onViewProfile(emp.id)} className="cursor-pointer group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
              {/* Badge Status */}
              <span className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                emp.status === 'On Leave' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {emp.status}
              </span>

              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-xl font-bold text-white shadow-md">
                  {emp.avatarUrl}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{emp.name}</h4>
                  <p className="text-xs text-slate-500">{emp.designation}</p>
                </div>
              </div>

              {/* Specs */}
              <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-4 dark:border-slate-800/80 text-sm">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                  <Phone className="h-4 w-4" />
                  <span>{emp.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span>{emp.branch}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                  <Briefcase className="h-4 w-4" />
                  <span>{emp.department} • <span className="font-semibold">{emp.role}</span></span>
                </div>
              </div>

              {/* Subdued Footer info */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100/50 pt-3 dark:border-slate-800/30">
                <span>Joined: {emp.joinDate}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">₹{emp.salary.toLocaleString()}/mo</span>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="col-span-3 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 font-medium">
              No employees match search requirements.
            </div>
          )}
        </div>
      ) : (
        /* Table Layout Mode */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="table-container overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department & Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} onClick={() => onViewProfile && onViewProfile(emp.id)} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{emp.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{emp.name}</div>
                      <div className="text-xs text-slate-400">{emp.designation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{emp.department}</div>
                      <div className="text-xs text-slate-400 font-semibold">{emp.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">{emp.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{emp.phone}</div>
                    </td>
                    <td className="px-6 py-4">{emp.branch}</td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-350">₹{emp.salary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                        emp.status === 'On Leave' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Drawer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 overflow-y-auto animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Add New Employee Profile</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(onSubmitForm)} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  {...register('name', { required: 'Full name is required' })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  placeholder="Amit Patel"
                />
                {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  {...register('email', { required: 'Email address is required' })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  placeholder="amit@company.com"
                />
                {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Phone Number</label>
                <input 
                  type="text" 
                  {...register('phone', { required: 'Phone number is required' })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  placeholder="+91 99000 88000"
                />
                {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone.message}</span>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Department</label>
                <select 
                  {...register('department')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Role Classification</label>
                <select 
                  {...register('role')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="Employee">Employee</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="HR Manager">HR Manager</option>
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Designation</label>
                <input 
                  type="text" 
                  {...register('designation', { required: 'Designation is required' })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  placeholder="Software Engineer II"
                />
                {errors.designation && <span className="text-xs text-red-500 mt-1">{errors.designation.message}</span>}
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Monthly Salary (INR)</label>
                <input 
                  type="number" 
                  {...register('salary', { required: 'Salary value is required' })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  placeholder="85000"
                />
                {errors.salary && <span className="text-xs text-red-500 mt-1">{errors.salary.message}</span>}
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Work Branch</label>
                <input 
                  type="text" 
                  {...register('branch')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  defaultValue="Bangalore HQ"
                />
              </div>

              {/* Manager */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Reporting Manager</label>
                <input 
                  type="text" 
                  {...register('managerName')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  defaultValue="Amit Sharma"
                />
              </div>

              {/* Bank Account */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Bank Details</label>
                <input 
                  type="text" 
                  {...register('bankAccount')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  placeholder="SBI - •••• 4091"
                />
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Joining Date</label>
                <input 
                  type="date" 
                  {...register('joinDate')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Employment Status</label>
                <select 
                  {...register('status')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/15 hover:bg-blue-700"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
