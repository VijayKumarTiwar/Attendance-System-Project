'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Building2, Search, Bell, Sun, Moon, ChevronDown, Menu, X,
  LayoutDashboard, CalendarCheck, Users, CalendarDays, CalendarClock,
  Banknote, FileBarChart, Settings, User, LogOut, ChevronRight,
  BookOpen, MapPin, CreditCard, Briefcase, FileText, GitBranch,
  HeartHandshake, Wallet, Calendar, Phone, Shield, Star, Inbox,
  ClipboardList, UserCheck, Clock, BarChart3
} from 'lucide-react';

import { 
  initialEmployees, initialAttendanceLogs, initialLeaveRequests,
  initialShifts, initialPayroll, initialNotifications, initialActivityFeed,
  initialHolidays, initialPolicies, initialDepartments, initialDesignations,
  initialLeavePolicies, initialLeaveBalances,
  Employee, AttendanceLog, LeaveRequest, ShiftSchedule, PayrollEntry,
  NotificationItem, ActivityFeed
} from '../utils/mockData';

import DashboardView from '../components/views/DashboardView';
import AttendanceView from '../components/views/AttendanceView';
import EmployeesView from '../components/views/EmployeesView';
import LeavesView from '../components/views/LeavesView';
import ShiftsView from '../components/views/ShiftsView';
import PayrollView from '../components/views/PayrollView';
import ReportsView from '../components/views/ReportsView';
import ProfileView from '../components/views/ProfileView';
import SettingsView from '../components/views/SettingsView';
import HolidayListView from '../components/views/HolidayListView';
import PolicyHandbookView from '../components/views/PolicyHandbookView';
import PersonalInfoView from '../components/views/PersonalInfoView';
import ContactInfoView from '../components/views/ContactInfoView';
import BankDetailsView from '../components/views/BankDetailsView';
import DocumentRecordsView from '../components/views/DocumentRecordsView';
import OrgChartView from '../components/views/OrgChartView';
import CompensationView from '../components/views/CompensationView';
import TeamCalendarView from '../components/views/TeamCalendarView';
import EmployeeDirectoryView from '../components/views/EmployeeDirectoryView';
import DepartmentDesignationView from '../components/views/DepartmentDesignationView';
import LeavePoliciesView from '../components/views/LeavePoliciesView';
import EmployeeProfileView from '../components/views/EmployeeProfileView';
import AnalyticsView from '../components/views/AnalyticsView';
import LoginView from '../components/views/LoginView';

// ─── Sidebar structure ─────────────────────────────────────────────────────
interface NavItem { name: string; icon: any; id: string; }
interface NavSection { section: string; items: NavItem[]; }

const navSections: NavSection[] = [
  {
    section: '',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    ],
  },
  {
    section: 'Employee Self Service',
    items: [
      { name: 'Attendance', icon: CalendarCheck, id: 'attendance' },
      { name: 'Leave Management', icon: CalendarDays, id: 'leaves' },
      { name: 'My Payroll', icon: Banknote, id: 'payroll' },
      { name: 'View My Shifts', icon: CalendarClock, id: 'shifts' },
      { name: 'Personal Information', icon: User, id: 'personalInfo' },
      { name: 'Contact Information', icon: Phone, id: 'contactInfo' },
      { name: 'Document Records', icon: FileText, id: 'documents' },
      { name: 'Bank Details', icon: CreditCard, id: 'bankDetails' },
      { name: 'My Compensation', icon: Wallet, id: 'compensation' },
      { name: 'Organization Chart', icon: GitBranch, id: 'orgChart' },
      { name: 'Holiday List', icon: Calendar, id: 'holidays' },
      { name: 'Policy Handbook', icon: BookOpen, id: 'policies' },
    ],
  },
  {
    section: 'Manager',
    items: [
      { name: 'Team Calendar', icon: CalendarCheck, id: 'teamCalendar' },
      { name: 'Leave Approval', icon: UserCheck, id: 'leaves' },
      { name: 'Employee Directory', icon: Users, id: 'directory' },
      { name: 'Shift Assignment', icon: Clock, id: 'shifts' },
    ],
  },
  {
    section: 'HR Admin',
    items: [
      { name: 'Employee Management', icon: Users, id: 'employees' },
      { name: 'Departments & Designations', icon: Building2, id: 'departments' },
      { name: 'Payroll Processing', icon: Banknote, id: 'payroll' },
      { name: 'Leave Policies', icon: ClipboardList, id: 'leavePolicies' },
      { name: 'Analytics', icon: BarChart3, id: 'analytics' },
      { name: 'Reports & Analytics', icon: FileBarChart, id: 'reports' },
    ],
  },
  {
    section: 'System',
    items: [
      { name: 'Settings', icon: Settings, id: 'settings' },
      { name: 'My Profile', icon: User, id: 'profile' },
    ],
  },
];

// Flatten for mobile
const allNavItems = navSections.flatMap(s => s.items);

export default function Home() {
  // Global Shared States
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(initialAttendanceLogs);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [shifts, setShifts] = useState<ShiftSchedule[]>(initialShifts);
  const [payrollList, setPayrollList] = useState<PayrollEntry[]>(initialPayroll);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>(initialActivityFeed);

  // Layout States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setView] = useState<string>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('RSGL');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Employee Self Service': true, 'Manager': false, 'HR Admin': false, 'System': false,
  });

  useEffect(() => {
    const root = window.document.documentElement;
    isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [isDarkMode]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ── Global Actions ────────────────────────────────────────────────────────
  const handleAddPunch = (punch: Omit<AttendanceLog, 'id'>) => {
    const newLog: AttendanceLog = { ...punch, id: `L-0${attendanceLogs.length + 1}` };
    const existingIdx = attendanceLogs.findIndex(l => l.employeeId === punch.employeeId && l.date === punch.date);
    if (existingIdx >= 0) { const u = [...attendanceLogs]; u[existingIdx] = newLog; setAttendanceLogs(u); }
    else setAttendanceLogs(prev => [newLog, ...prev]);
    setActivityFeed(prev => [{ id: `AF-0${activityFeed.length + 1}`, employeeName: punch.employeeName, action: punch.checkOut ? `checked out (${punch.checkOut})` : `checked in (${punch.checkIn})`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), category: 'attendance' }, ...prev]);
  };

  const handleApplyLeave = (request: LeaveRequest) => {
    setLeaveRequests(prev => [request, ...prev]);
    setActivityFeed(prev => [{ id: `AF-0${prev.length + 1}`, employeeName: request.employeeName, action: `applied for ${request.type}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), category: 'leave' }, ...prev]);
    setNotifications(prev => [{ id: `N-0${prev.length + 1}`, title: 'New Leave Request', message: `${request.employeeName} applied for ${request.days} days.`, type: 'warning', time: 'Just now', read: false }, ...prev]);
  };

  const handleApproveReject = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    const req = leaveRequests.find(r => r.id === id);
    if (req) {
      setActivityFeed(prev => [{ id: `AF-0${prev.length + 1}`, employeeName: 'HR Manager', action: `${status} leave for ${req.employeeName}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), category: 'leave' }, ...prev]);
      setNotifications(prev => [{ id: `N-0${prev.length + 1}`, title: `Leave ${status}`, message: `${req.employeeName}'s leave has been ${status.toLowerCase()}.`, type: status === 'Approved' ? 'success' : 'error', time: 'Just now', read: false }, ...prev]);
    }
  };

  const handleAddEmployee = (emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
    setActivityFeed(prev => [{ id: `AF-0${prev.length + 1}`, employeeName: emp.name, action: `joined as ${emp.designation}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), category: 'employee' }, ...prev]);
  };

  const handleAssignShift = (empId: string, shiftId: string) => {
    setShifts(prev => prev.map(s => s.id === shiftId ? { ...s, assignedEmployees: s.assignedEmployees + 1 } : s));
  };

  const handleViewProfile = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setView('employeeProfile');
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleResetAllData = () => {
    setEmployees(initialEmployees); setAttendanceLogs(initialAttendanceLogs);
    setLeaveRequests(initialLeaveRequests); setShifts(initialShifts);
    setPayrollList(initialPayroll); setNotifications(initialNotifications);
    setActivityFeed(initialActivityFeed); setView('dashboard');
  };

  const navigate = (id: string) => {
    setView(id);
    setIsMobileSidebarOpen(false);
  };

  // ── Sidebar Component ────────────────────────────────────────────────────
  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center py-4 px-4 border-b border-slate-100 dark:border-slate-800/60 shrink-0 bg-white">
        <img 
          src="/rsgl_logo.png" 
          alt="Rajasthan State Gas Limited" 
          className="w-full max-w-[200px] h-auto object-contain"
        />
        {mobile && (
          <button onClick={() => setIsMobileSidebarOpen(false)} className="ml-auto p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.section ? (
              <button
                onClick={() => toggleSection(section.section)}
                className="section-label w-full flex items-center justify-between hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {section.section}
                <ChevronRight className={`h-3 w-3 transition-transform ${expandedSections[section.section] ? 'rotate-90' : ''}`} />
              </button>
            ) : null}

            <AnimatePresence initial={false}>
              {(!section.section || expandedSections[section.section]) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {section.items.map((link) => {
                    const Icon = link.icon;
                    const isActive = currentView === link.id;
                    return (
                      <button
                        key={`${section.section}-${link.id}-${link.name}`}
                        onClick={() => navigate(link.id)}
                        className={`flex w-full items-center gap-3.5 py-3 pr-3 pl-4 text-sm font-medium transition-all relative group ${
                          isActive
                            ? 'text-[#122b29] bg-[#f1f5f9] dark:text-emerald-400 dark:bg-slate-800/60 font-semibold rounded-r-2xl rounded-l-none'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200 rounded-xl mx-2 w-[calc(100%-16px)] px-3'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute left-0 top-1.5 bottom-1.5 w-[5px] rounded-r-md bg-[#122b29] dark:bg-emerald-500"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <Icon strokeWidth={1.75} className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#122b29] dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="truncate tracking-wide">{link.name}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-100 dark:border-slate-800/60 p-3 shrink-0">
        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f1f5f3] text-slate-800 dark:bg-[#0a1f1e] dark:text-slate-100 font-sans">

      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden w-60 bg-white dark:bg-[#0d2422] border-r border-slate-200 dark:border-slate-800/60 lg:flex flex-col shrink-0 shadow-sm z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="relative w-64 bg-white dark:bg-[#0d2422] flex flex-col shadow-xl z-10"
            >
              <SidebarContent mobile />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex h-14 items-center justify-between bg-[#1a3b38] dark:bg-[#0d2422] px-4 shadow-md z-20 shrink-0 border-b border-[#122e2b]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 border border-white/10">
              <Building2 className="h-3.5 w-3.5 text-white/60" />
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white outline-none"
              >
                <option value="RSGL" className="bg-[#1a3b38] text-white">RSGL — Jaipur HQ</option>
                <option value="RSGL-K" className="bg-[#1a3b38] text-white">RSGL — Kota Branch</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button className="rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors">
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Theme toggle */}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors">
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileDropdownOpen(false); }}
                className="relative rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-400 ring-2 ring-[#1a3b38]" />
                )}
              </button>
              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Notifications</h4>
                        {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                      </div>
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {notifications.map(item => (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationRead(item.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-colors text-xs ${item.read ? 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20' : 'border-blue-100 dark:border-blue-900/20 bg-blue-50/40 dark:bg-blue-950/20'}`}
                          >
                            <div className="flex justify-between items-start gap-1 mb-0.5">
                              <span className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</span>
                              <span className="text-slate-400 whitespace-nowrap">{item.time}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">{item.message}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsNotificationOpen(false); }}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/10 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold text-white shadow">VK</div>
                <span className="hidden md:block text-xs font-semibold text-white">Vijay K. Tiwari</span>
                <ChevronDown className="h-3.5 w-3.5 text-white/60" />
              </button>
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-3"
                    >
                      <div className="p-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Vijay Kumar Tiwari</p>
                        <p className="text-xs text-slate-400">Chief Executive Officer</p>
                      </div>
                      {[{ label: 'My Profile', id: 'profile', icon: User }, { label: 'Settings', id: 'settings', icon: Settings }].map(item => (
                        <button key={item.id} onClick={() => { navigate(item.id); setIsProfileDropdownOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40 transition-colors">
                          <item.icon className="h-4 w-4" />{item.label}
                        </button>
                      ))}
                      <button onClick={() => setIsLoggedIn(false)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors mt-1">
                        <LogOut className="h-4 w-4" />Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full w-full"
            >
              {currentView === 'dashboard' && <DashboardView employees={employees} attendanceLogs={attendanceLogs} activityFeed={activityFeed} setView={setView} onQuickPunch={() => setView('attendance')} />}
              {currentView === 'attendance' && <AttendanceView logs={attendanceLogs} employees={employees} onAddPunch={handleAddPunch} setView={setView} />}
              {currentView === 'employees' && <EmployeesView employees={employees} onAddEmployee={handleAddEmployee} setView={setView} onViewProfile={handleViewProfile} />}
              {currentView === 'leaves' && <LeavesView leaveRequests={leaveRequests} onApproveReject={handleApproveReject} onApplyLeave={handleApplyLeave} setView={setView} />}
              {currentView === 'shifts' && <ShiftsView shifts={shifts} employees={employees} onAssignShift={handleAssignShift} setView={setView} />}
              {currentView === 'payroll' && <PayrollView payrollList={payrollList} setView={setView} />}
              {currentView === 'reports' && <ReportsView setView={setView} />}
              {currentView === 'profile' && <ProfileView employees={employees} setView={setView} />}
              {currentView === 'settings' && <SettingsView onResetAllData={handleResetAllData} setView={setView} />}
              {currentView === 'holidays' && <HolidayListView setView={setView} />}
              {currentView === 'policies' && <PolicyHandbookView setView={setView} />}
              {currentView === 'personalInfo' && <PersonalInfoView setView={setView} />}
              {currentView === 'contactInfo' && <ContactInfoView setView={setView} />}
              {currentView === 'bankDetails' && <BankDetailsView setView={setView} />}
              {currentView === 'documents' && <DocumentRecordsView setView={setView} />}
              {currentView === 'orgChart' && <OrgChartView setView={setView} />}
              {currentView === 'compensation' && <CompensationView setView={setView} />}
              {currentView === 'teamCalendar' && <TeamCalendarView setView={setView} />}
              {currentView === 'directory' && <EmployeeDirectoryView employees={employees} setView={setView} onViewProfile={handleViewProfile} />}
              {currentView === 'departments' && <DepartmentDesignationView setView={setView} />}
              {currentView === 'leavePolicies' && <LeavePoliciesView setView={setView} />}
              {currentView === 'employeeProfile' && <EmployeeProfileView employee={employees.find(e => e.id === selectedEmployeeId) || null} onBack={() => setView('directory')} />}
              {currentView === 'analytics' && <AnalyticsView employees={employees} attendanceLogs={attendanceLogs} leaveRequests={leaveRequests} setView={setView} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
