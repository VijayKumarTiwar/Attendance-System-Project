'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  CalendarDays, Plus, Check, X, CalendarRange, Clock, 
  CheckCircle2, XCircle, FileText, UserCheck, Activity,
  ChevronRight, Calendar
} from 'lucide-react';
import { LeaveRequest } from '../../utils/mockData';

interface LeavesViewProps {
  leaveRequests: LeaveRequest[];
  onApproveReject: (id: string, status: 'Approved' | 'Rejected') => void;
  onApplyLeave: (leave: LeaveRequest) => void;
  setView?: any;
}

export default function LeavesView({ leaveRequests, onApproveReject, onApplyLeave, setView }: LeavesViewProps) {
  const [activeTab, setActiveTab] = useState<'my-leaves' | 'team-requests'>('my-leaves');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Hardcoded "Current User" for the "My Leaves" view
  const currentUser = 'Vijay Kumar Tiwari';

  // Leave Balance summary metrics (Mock for Current User)
  const leaveBalances = [
    { type: 'Casual Leave', total: 12, used: 4, color: 'text-blue-500', stroke: 'stroke-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { type: 'Sick Leave', total: 10, used: 2, color: 'text-emerald-500', stroke: 'stroke-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { type: 'Privilege Leave', total: 18, used: 8, color: 'text-purple-500', stroke: 'stroke-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { type: 'Maternity/Paternity', total: 90, used: 0, color: 'text-pink-500', stroke: 'stroke-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  ];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<LeaveRequest, 'id' | 'status' | 'department'>>();

  const onSubmitLeave = (data: any) => {
    const newRequest: LeaveRequest = {
      ...data,
      id: `LR-0${leaveRequests.length + 1}`,
      department: 'Engineering',
      days: Math.max(1, Math.round((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1),
      status: 'Pending',
    };
    onApplyLeave(newRequest);
    setIsApplyModalOpen(false);
    reset();
    alert('Leave request submitted successfully.');
  };

  const myLeaves = leaveRequests.filter(r => r.employeeName === currentUser);
  const pendingTeamRequests = leaveRequests.filter(r => r.status === 'Pending' && r.employeeName !== currentUser);
  const processedTeamRequests = leaveRequests.filter(r => r.status !== 'Pending' && r.employeeName !== currentUser);

  // SVG Circular Progress Helper
  const CircularProgress = ({ total, used, strokeColor }: { total: number, used: number, strokeColor: string }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((used / total) * circumference);
    return (
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle cx="40" cy="40" r={radius} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
          <circle 
            cx="40" cy="40" r={radius} 
            className={`${strokeColor} transition-all duration-1000 ease-out`} 
            strokeWidth="6" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-800 dark:text-white">{total - used}</span>
          <span className="text-[9px] font-semibold text-slate-400 -mt-1 uppercase">Left</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Leave Management</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your time off and approve team requests</p>
          
          <div className="flex items-center gap-2 mt-6 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('my-leaves')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'my-leaves' ? 'bg-white dark:bg-slate-800 text-[#1a3b38] dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <UserCheck className="h-4 w-4" />
              My Leaves
            </button>
            <button 
              onClick={() => setActiveTab('team-requests')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'team-requests' ? 'bg-white dark:bg-slate-800 text-[#1a3b38] dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Activity className="h-4 w-4" />
              Team Requests
              {pendingTeamRequests.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 animate-pulse">
                  {pendingTeamRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#1a3b38] dark:bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-emerald-900/20 dark:shadow-emerald-900/40 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[#122e2b] dark:hover:bg-emerald-500"
        >
          <Plus className="h-5 w-5" />
          Apply For Leave
        </button>
      </div>

      {/* ==================== MY LEAVES TAB ==================== */}
      {activeTab === 'my-leaves' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Balance Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">My Leave Balances</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {leaveBalances.map((leave, idx) => (
                <div key={idx} className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-20 blur-2xl ${leave.bg}`} />
                  <div className="relative z-10">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 block">{leave.type}</span>
                    <div className="mt-4 space-y-1">
                      <p className="text-xs font-semibold text-slate-400">Total: {leave.total} days</p>
                      <p className="text-xs font-semibold text-slate-400">Used: {leave.used} days</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <CircularProgress total={leave.total} used={leave.used} strokeColor={leave.stroke} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Leave History */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Leave History</h3>
            
            {myLeaves.length > 0 ? (
              <div className="space-y-4">
                {myLeaves.map(req => (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        req.type === 'Casual Leave' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        req.type === 'Sick Leave' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        <CalendarRange className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-base">{req.type}</h4>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">{req.startDate} to {req.endDate} ({req.days} days)</p>
                        <p className="text-xs text-slate-400 mt-1.5 italic">"{req.reason}"</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' :
                        req.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                        'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                      }`}>
                        {req.status === 'Approved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {req.status === 'Rejected' && <XCircle className="h-3.5 w-3.5" />}
                        {req.status === 'Pending' && <Clock className="h-3.5 w-3.5" />}
                        {req.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{req.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <CalendarDays className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 font-medium">You haven't applied for any leaves yet.</p>
                <button onClick={() => setIsApplyModalOpen(true)} className="mt-4 text-[#1a3b38] dark:text-emerald-400 font-bold hover:underline">
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TEAM REQUESTS TAB ==================== */}
      {activeTab === 'team-requests' && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Pending Approvals */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Requires Your Approval</h3>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {pendingTeamRequests.length} Pending
              </span>
            </div>
            
            {pendingTeamRequests.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pendingTeamRequests.map(req => (
                  <div key={req.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Pending
                      </span>
                      <span className="text-xs font-bold text-slate-400">{req.id}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">{req.employeeName}</h4>
                    <p className="text-xs font-semibold text-slate-500 mb-4">{req.department}</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{req.type}</span>
                        <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">{req.days} Days</span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 mb-3">{req.startDate} to {req.endDate}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2">"{req.reason}"</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onApproveReject(req.id, 'Rejected')}
                        className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-500 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-400 py-2.5 rounded-xl text-sm font-bold transition-colors"
                      >
                        <X className="h-4 w-4" /> Reject
                      </button>
                      <button
                        onClick={() => onApproveReject(req.id, 'Approved')}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#1a3b38] dark:bg-emerald-600 text-white hover:bg-[#122e2b] dark:hover:bg-emerald-500 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors border-2 border-transparent"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">All caught up!</h4>
                <p className="text-sm text-slate-500">There are no pending leave requests from your team.</p>
              </div>
            )}
          </div>

          {/* Processed History */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Recently Processed</h3>
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Employee</th>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Leave Details</th>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Duration</th>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {processedTeamRequests.slice(0, 5).map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 dark:text-white">{req.employeeName}</p>
                          <p className="text-xs font-semibold text-slate-400">{req.department}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-700 dark:text-slate-200">{req.type}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5" title={req.reason}>"{req.reason}"</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-300">{req.days} Days</p>
                          <p className="text-xs text-slate-400 mt-0.5">{req.startDate} to {req.endDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'
                          }`}>
                            {req.status === 'Approved' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {processedTeamRequests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-medium">No processed requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {processedTeamRequests.length > 5 && (
                <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <button className="text-sm font-bold text-[#1a3b38] dark:text-emerald-400 hover:underline">View All History</button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ==================== APPLY LEAVE MODAL ==================== */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsApplyModalOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl animate-scale-up overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Modal Header Decor */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#1a3b38] to-emerald-700" />
            
            <div className="relative px-8 pt-8 pb-6 flex items-start justify-between">
              <div>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl w-fit mb-4 shadow-inner border border-white/30">
                  <CalendarDays className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Apply for Leave</h3>
                <p className="text-emerald-100 text-sm mt-1">Submit your time off request for approval.</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)} 
                className="rounded-full p-2 bg-black/10 hover:bg-black/20 text-white transition-colors border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmitLeave)} className="px-8 py-6 space-y-5 bg-white dark:bg-slate-900">
              
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employee</label>
                  <select 
                    {...register('employeeName')}
                    className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#1a3b38] focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 transition-all"
                  >
                    <option value="Vijay Kumar Tiwari">Vijay Kumar Tiwari (You)</option>
                    <option value="Amit Sharma">Amit Sharma</option>
                    <option value="Priya Patel">Priya Patel</option>
                    <option value="Vikram Singh">Vikram Singh</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Leave Type</label>
                  <select 
                    {...register('type')}
                    className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#1a3b38] focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 transition-all"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Privilege Leave">Privilege Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                  <input 
                    type="date"
                    {...register('startDate', { required: 'Required' })}
                    className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#1a3b38] focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 transition-all"
                  />
                  {errors.startDate && <span className="text-xs text-red-500 mt-1.5 block font-medium">{errors.startDate.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date</label>
                  <input 
                    type="date"
                    {...register('endDate', { required: 'Required' })}
                    className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#1a3b38] focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 transition-all"
                  />
                  {errors.endDate && <span className="text-xs text-red-500 mt-1.5 block font-medium">{errors.endDate.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason for Leave</label>
                <textarea 
                  {...register('reason', { required: 'Please provide a reason' })}
                  rows={3}
                  className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[#1a3b38] focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 transition-all resize-none"
                  placeholder="E.g., Medical appointment, family event..."
                />
                {errors.reason && <span className="text-xs text-red-500 mt-1.5 block font-medium">{errors.reason.message}</span>}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 py-3.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#1a3b38] dark:bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 hover:shadow-xl hover:bg-[#122e2b] dark:hover:bg-emerald-500 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
