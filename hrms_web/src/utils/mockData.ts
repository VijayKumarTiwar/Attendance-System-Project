export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'HR Manager' | 'Employee' | 'Developer' | 'Manager';
  department: 'Human Resources' | 'Engineering' | 'Operations' | 'Sales' | 'Finance';
  designation: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  avatarUrl: string;
  joinDate: string;
  branch: string;
  salary: number;
  bankAccount: string;
  managerName: string;
  documents: { name: string; date: string; size: string }[];
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null;
  checkOut: string | null;
  breakDuration: number; // in minutes
  status: 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Incomplete';
  workHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: 'Casual Leave' | 'Sick Leave' | 'Privilege Leave' | 'Maternity Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ShiftSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  crossesMidnight: boolean;
  color: string;
  assignedEmployees: number;
}

export interface PayrollEntry {
  id: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netSalary: number;
  status: 'Paid' | 'Processing';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

export interface ActivityFeed {
  id: string;
  employeeName: string;
  action: string;
  time: string;
  category: 'attendance' | 'leave' | 'payroll' | 'employee';
}

// Initial Employees
export const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Amit Sharma',
    email: 'amit.sharma@company.com',
    phone: '+91 98765 43210',
    role: 'HR Manager',
    department: 'Human Resources',
    designation: 'VP of Human Resources',
    status: 'Active',
    avatarUrl: 'AS',
    joinDate: '2022-04-12',
    branch: 'Bangalore HQ',
    salary: 145000,
    bankAccount: 'HDFC Bank - •••• 9823',
    managerName: 'Vijay Kumar (CEO)',
    documents: [
      { name: 'Offer_Letter.pdf', date: '2022-04-10', size: '1.2 MB' },
      { name: 'KYC_Verification.pdf', date: '2022-04-12', size: '640 KB' },
    ],
  },
  {
    id: 'EMP-002',
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    phone: '+91 87654 32109',
    role: 'Developer',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    status: 'Active',
    avatarUrl: 'PP',
    joinDate: '2023-01-15',
    branch: 'Bangalore HQ',
    salary: 110000,
    bankAccount: 'ICICI Bank - •••• 4152',
    managerName: 'Amit Sharma',
    documents: [
      { name: 'Offer_Letter.pdf', date: '2023-01-10', size: '1.1 MB' },
      { name: 'Degree_Certificate.pdf', date: '2023-01-15', size: '2.4 MB' },
    ],
  },
  {
    id: 'EMP-003',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@company.com',
    phone: '+91 76543 21098',
    role: 'Manager',
    department: 'Operations',
    designation: 'Operations Lead Manager',
    status: 'Active',
    avatarUrl: 'RK',
    joinDate: '2021-08-01',
    branch: 'Indiranagar Branch',
    salary: 95000,
    bankAccount: 'SBI - •••• 5612',
    managerName: 'Amit Sharma',
    documents: [
      { name: 'Offer_Letter.pdf', date: '2021-07-28', size: '980 KB' },
    ],
  },
  {
    id: 'EMP-004',
    name: 'Siddharth Sen',
    email: 'sid.sen@company.com',
    phone: '+91 99887 76655',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Software Engineer',
    status: 'Active',
    avatarUrl: 'SS',
    joinDate: '2024-03-01',
    branch: 'Bangalore HQ',
    salary: 75000,
    bankAccount: 'Axis Bank - •••• 1092',
    managerName: 'Priya Patel',
    documents: [
      { name: 'Offer_Letter.pdf', date: '2024-02-20', size: '1.2 MB' },
    ],
  },
  {
    id: 'EMP-005',
    name: 'Anjali Desai',
    email: 'anjali.desai@company.com',
    phone: '+91 99112 23344',
    role: 'Employee',
    department: 'Sales',
    designation: 'Senior Account Executive',
    status: 'On Leave',
    avatarUrl: 'AD',
    joinDate: '2023-05-10',
    branch: 'Indiranagar Branch',
    salary: 68000,
    bankAccount: 'HDFC Bank - •••• 7741',
    managerName: 'Rahul Kumar',
    documents: [
      { name: 'Offer_Letter.pdf', date: '2023-05-05', size: '1.1 MB' },
    ],
  },
  {
    id: 'EMP-006',
    name: 'Vikram Singh',
    email: 'vikram.singh@company.com',
    phone: '+91 88776 65544',
    role: 'Employee',
    department: 'Finance',
    designation: 'Financial Analyst',
    status: 'Active',
    avatarUrl: 'VS',
    joinDate: '2022-11-01',
    branch: 'Bangalore HQ',
    salary: 85000,
    bankAccount: 'ICICI Bank - •••• 3049',
    managerName: 'Amit Sharma',
    documents: [
      { name: 'Offer_Letter.pdf', date: '2022-10-25', size: '1.2 MB' },
    ],
  },
];

// Initial Attendance Logs - Generated for full year 2026
const generateFullYearLogs = (): AttendanceLog[] => {
  const logs: AttendanceLog[] = [];
  const year = 2026;
  let logIdCounter = 1;

  initialEmployees.forEach(emp => {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay();
        
        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Randomize status slightly based on date and emp id
        const hash = (emp.id.charCodeAt(emp.id.length - 1) + day * 7 + month * 31) % 100;
        
        let status: 'Present' | 'Late' | 'On Leave' = 'Present';
        let checkIn: string | null = '09:00 AM';
        let checkOut: string | null = '06:00 PM';
        let breakDuration = 45;
        let workHours = 8.25;

        if (hash < 5) {
          status = 'On Leave';
          checkIn = null;
          checkOut = null;
          breakDuration = 0;
          workHours = 0;
        } else if (hash < 15) {
          status = 'Late';
          checkIn = '09:45 AM';
          checkOut = '06:15 PM';
          workHours = 7.75;
        } else if (hash < 25) {
          // slight variation for check-in
          checkIn = '08:50 AM';
          checkOut = '05:55 PM';
          workHours = 8.3;
        }

        logs.push({
          id: `L-${String(logIdCounter++).padStart(5, '0')}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeRole: emp.role,
          department: emp.department,
          date: dateStr,
          checkIn,
          checkOut,
          breakDuration,
          status,
          workHours,
        });
      }
    }
  });
  return logs;
};

export const initialAttendanceLogs: AttendanceLog[] = generateFullYearLogs();

// Leave Requests
export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR-001',
    employeeName: 'Anjali Desai',
    department: 'Sales',
    type: 'Casual Leave',
    startDate: '2026-06-17',
    endDate: '2026-06-19',
    days: 3,
    reason: 'Family event in hometown',
    status: 'Approved',
  },
  {
    id: 'LR-002',
    employeeName: 'Vikram Singh',
    department: 'Finance',
    type: 'Sick Leave',
    startDate: '2026-06-20',
    endDate: '2026-06-22',
    days: 2,
    reason: 'Medical checkup and recovery',
    status: 'Pending',
  },
  {
    id: 'LR-003',
    employeeName: 'Siddharth Sen',
    department: 'Engineering',
    type: 'Privilege Leave',
    startDate: '2026-07-05',
    endDate: '2026-07-12',
    days: 7,
    reason: 'Annual family vacation',
    status: 'Pending',
  },
  {
    id: 'LR-004',
    employeeName: 'Priya Patel',
    department: 'Engineering',
    type: 'Casual Leave',
    startDate: '2026-06-08',
    endDate: '2026-06-08',
    days: 1,
    reason: 'Personal business at bank',
    status: 'Approved',
  },
];

// Shift Schedules
export const initialShifts: ShiftSchedule[] = [
  {
    id: 'S-01',
    name: 'General Day Shift',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    graceMinutes: 15,
    crossesMidnight: false,
    color: 'bg-blue-500',
    assignedEmployees: 4,
  },
  {
    id: 'S-02',
    name: 'Retail Morning Shift',
    startTime: '10:00 AM',
    endTime: '07:00 PM',
    graceMinutes: 10,
    crossesMidnight: false,
    color: 'bg-emerald-500',
    assignedEmployees: 2,
  },
  {
    id: 'S-03',
    name: 'Night Support Shift',
    startTime: '10:00 PM',
    endTime: '06:00 AM',
    graceMinutes: 15,
    crossesMidnight: true,
    color: 'bg-purple-500',
    assignedEmployees: 0,
  },
];

// Payroll list
export const initialPayroll: PayrollEntry[] = [
  {
    id: 'P-001',
    employeeName: 'Amit Sharma',
    month: 'May 2026',
    basicSalary: 100000,
    allowances: 45000,
    deductions: 8000,
    tax: 12000,
    netSalary: 125000,
    status: 'Paid',
  },
  {
    id: 'P-002',
    employeeName: 'Priya Patel',
    month: 'May 2026',
    basicSalary: 80000,
    allowances: 30000,
    deductions: 5000,
    tax: 9000,
    netSalary: 96000,
    status: 'Paid',
  },
  {
    id: 'P-003',
    employeeName: 'Rahul Kumar',
    month: 'May 2026',
    basicSalary: 70000,
    allowances: 25000,
    deductions: 4000,
    tax: 7500,
    netSalary: 83500,
    status: 'Paid',
  },
  {
    id: 'P-004',
    employeeName: 'Siddharth Sen',
    month: 'May 2026',
    basicSalary: 55000,
    allowances: 20000,
    deductions: 3000,
    tax: 5500,
    netSalary: 66500,
    status: 'Paid',
  },
  {
    id: 'P-005',
    employeeName: 'Anjali Desai',
    month: 'May 2026',
    basicSalary: 50000,
    allowances: 18000,
    deductions: 2500,
    tax: 4800,
    netSalary: 60700,
    status: 'Paid',
  },
];

// Notifications
export const initialNotifications: NotificationItem[] = [
  {
    id: 'N-01',
    title: 'New Leave Request',
    message: 'Vikram Singh applied for 2 days of Sick Leave.',
    type: 'warning',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: 'N-02',
    title: 'Payroll Finalized',
    message: 'May 2026 payslips have been generated and sent to employees.',
    type: 'success',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'N-03',
    title: 'Attendance Alert',
    message: 'Priya Patel punched in late today (09:22 AM).',
    type: 'info',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 'N-04',
    title: 'Geofence Violation Alert',
    message: 'Simulated punch attempt rejected for EMP-005 (Outside allowed geofence).',
    type: 'error',
    time: '1 day ago',
    read: true,
  },
];

// Activity Feed logs
export const initialActivityFeed: ActivityFeed[] = [
  {
    id: 'AF-01',
    employeeName: 'Amit Sharma',
    action: 'checked in successfully at Bangalore HQ',
    time: '08:52 AM',
    category: 'attendance',
  },
  {
    id: 'AF-02',
    employeeName: 'Priya Patel',
    action: 'checked in late at Bangalore HQ (+22 mins)',
    time: '09:22 AM',
    category: 'attendance',
  },
  {
    id: 'AF-03',
    employeeName: 'Vikram Singh',
    action: 'submitted a Sick Leave request for June 20-22',
    time: '10:15 AM',
    category: 'leave',
  },
  {
    id: 'AF-04',
    employeeName: 'Anjali Desai',
    action: 'marked as Present (On Leave status today)',
    time: '08:00 AM',
    category: 'leave',
  },
  {
    id: 'AF-05',
    employeeName: 'System Core',
    action: 'processed automated payroll for 6 staff records',
    time: '04:00 AM',
    category: 'payroll',
  },
];

// Upcoming Holidays
export const upcomingHolidays = [
  { name: 'Independence Day', date: 'Aug 15, 2026', day: 'Saturday', type: 'National' },
  { name: 'Ganesh Chaturthi', date: 'Sep 15, 2026', day: 'Monday', type: 'Restricted' },
  { name: 'Gandhi Jayanti', date: 'Oct 02, 2026', day: 'Friday', type: 'National' },
  { name: 'Diwali Festival', date: 'Nov 05, 2026', day: 'Wednesday', type: 'National' },
];

// ─── NEW TYPES ─────────────────────────────────────────────────────────────

export interface Holiday {
  id: string;
  name: string;
  date: string;          // YYYY-MM-DD
  day: string;
  type: 'National' | 'Gazetted' | 'Restricted' | 'Company';
  description?: string;
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: 'HR' | 'IT' | 'Finance' | 'Conduct' | 'Benefits';
  description: string;
  lastUpdated: string;
  docCount: number;
  pinned?: boolean;
  documents: { name: string; size: string }[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  employeeCount: number;
  costCenter: string;
  color: string;
}

export interface Designation {
  id: string;
  title: string;
  grade: string;
  department: string;
  minSalary: number;
  maxSalary: number;
  employeeCount: number;
}

export interface LeavePolicy {
  id: string;
  name: string;
  code: string;
  annualDays: number;
  maxConsecutive: number;
  carryForward: boolean;
  maxCarryForward: number;
  encashable: boolean;
  applicableGender: 'All' | 'Female';
  color: string;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  cl: { allocated: number; used: number };
  el: { allocated: number; used: number };
  sl: { allocated: number; used: number };
}

// ─── NEW DATA ──────────────────────────────────────────────────────────────

export const initialHolidays: Holiday[] = [
  { id: 'H-01', name: 'Republic Day', date: '2026-01-26', day: 'Sunday', type: 'National', description: 'Celebration of the Constitution of India coming into effect' },
  { id: 'H-02', name: 'Chhatrapati Shivaji Jayanti', date: '2026-02-19', day: 'Thursday', type: 'Restricted', description: 'Birth anniversary of Chhatrapati Shivaji Maharaj' },
  { id: 'H-03', name: 'Holi', date: '2026-03-14', day: 'Saturday', type: 'Gazetted', description: 'Festival of colours' },
  { id: 'H-04', name: 'Dr. Ambedkar Jayanti', date: '2026-04-14', day: 'Tuesday', type: 'National', description: 'Birth anniversary of Dr. B.R. Ambedkar' },
  { id: 'H-05', name: 'Good Friday', date: '2026-04-03', day: 'Friday', type: 'Restricted', description: 'Christian religious holiday' },
  { id: 'H-06', name: 'Labour Day', date: '2026-05-01', day: 'Friday', type: 'Company', description: 'International Workers Day' },
  { id: 'H-07', name: 'Independence Day', date: '2026-08-15', day: 'Saturday', type: 'National', description: 'India\'s Independence from British rule in 1947' },
  { id: 'H-08', name: 'Janmashtami', date: '2026-08-16', day: 'Sunday', type: 'Gazetted', description: 'Birth anniversary of Lord Krishna' },
  { id: 'H-09', name: 'Ganesh Chaturthi', date: '2026-09-15', day: 'Tuesday', type: 'Restricted', description: 'Festival celebrating Lord Ganesha' },
  { id: 'H-10', name: 'Gandhi Jayanti', date: '2026-10-02', day: 'Friday', type: 'National', description: 'Birth anniversary of Mahatma Gandhi' },
  { id: 'H-11', name: 'Dussehra', date: '2026-10-20', day: 'Tuesday', type: 'Gazetted', description: 'Victory of Lord Rama over Ravana' },
  { id: 'H-12', name: 'Diwali', date: '2026-11-05', day: 'Thursday', type: 'National', description: 'Festival of Lights' },
  { id: 'H-13', name: 'Diwali Holiday', date: '2026-11-06', day: 'Friday', type: 'National', description: 'Extended Diwali holiday' },
  { id: 'H-14', name: 'Guru Nanak Jayanti', date: '2026-11-15', day: 'Sunday', type: 'Gazetted', description: 'Birth anniversary of Guru Nanak Dev Ji' },
  { id: 'H-15', name: 'Christmas Day', date: '2026-12-25', day: 'Friday', type: 'National', description: 'Christian holiday celebrating birth of Jesus Christ' },
];

export const initialPolicies: PolicyDocument[] = [
  { id: 'P-01', title: 'Leave & Attendance Policy', category: 'HR', description: 'Comprehensive policy covering CL, EL, SL, Maternity, Paternity leave rules, attendance tracking, and regularization procedures.', lastUpdated: '2026-01-15', docCount: 5, pinned: true, documents: [{ name: 'Leave_Policy_2026.pdf', size: '2.4 MB' }, { name: 'Attendance_Guidelines.pdf', size: '1.1 MB' }, { name: 'Leave_Application_Form.docx', size: '340 KB' }] },
  { id: 'P-02', title: 'Code of Conduct', category: 'Conduct', description: 'Defines professional behavior, ethical standards, anti-harassment policies, and disciplinary procedures for all employees.', lastUpdated: '2025-11-20', docCount: 3, pinned: true, documents: [{ name: 'Code_of_Conduct.pdf', size: '3.1 MB' }, { name: 'Anti_Harassment_Policy.pdf', size: '1.8 MB' }] },
  { id: 'P-03', title: 'IT & Cybersecurity Policy', category: 'IT', description: 'Covers device usage, password management, data protection, acceptable use of company IT resources and internet usage.', lastUpdated: '2025-09-01', docCount: 4, documents: [{ name: 'IT_Policy_2025.pdf', size: '2.8 MB' }, { name: 'Password_Guidelines.pdf', size: '560 KB' }] },
  { id: 'P-04', title: 'Expense Reimbursement Policy', category: 'Finance', description: 'Travel, food, accommodation reimbursement limits and procedures including TA/DA rates and approval workflows.', lastUpdated: '2026-02-01', docCount: 2, documents: [{ name: 'Expense_Policy.pdf', size: '1.9 MB' }, { name: 'Reimbursement_Form.xlsx', size: '180 KB' }] },
  { id: 'P-05', title: 'Work From Home Policy', category: 'HR', description: 'Eligibility criteria, approval process, productivity tracking, and equipment policy for remote work arrangements.', lastUpdated: '2025-07-12', docCount: 2, documents: [{ name: 'WFH_Policy.pdf', size: '1.4 MB' }] },
  { id: 'P-06', title: 'Health & Safety Policy', category: 'HR', description: 'Workplace safety standards, emergency procedures, first aid protocols, and incident reporting guidelines.', lastUpdated: '2025-06-05', docCount: 3, documents: [{ name: 'Health_Safety_Policy.pdf', size: '2.2 MB' }] },
  { id: 'P-07', title: 'Equal Opportunity Policy', category: 'Conduct', description: 'Non-discrimination, inclusivity, diversity and equal opportunity in hiring and promotions.', lastUpdated: '2025-10-15', docCount: 2, documents: [{ name: 'Equal_Opportunity.pdf', size: '1.6 MB' }] },
  { id: 'P-08', title: 'Social Media Policy', category: 'IT', description: 'Guidelines for personal and professional use of social media, brand representation, and confidentiality requirements.', lastUpdated: '2025-08-20', docCount: 1, documents: [{ name: 'Social_Media_Guidelines.pdf', size: '980 KB' }] },
  { id: 'P-09', title: 'Performance Management Policy', category: 'HR', description: 'Annual and mid-year review cycles, KPI setting, performance ratings, PIP process and appraisal timelines.', lastUpdated: '2026-03-01', docCount: 3, documents: [{ name: 'PMS_Policy_2026.pdf', size: '2.7 MB' }] },
  { id: 'P-10', title: 'Benefits & Perquisites', category: 'Benefits', description: 'Health insurance coverage, PF contributions, gratuity, group term life insurance, and other employee benefits.', lastUpdated: '2026-01-01', docCount: 4, pinned: true, documents: [{ name: 'Benefits_Guide_2026.pdf', size: '3.4 MB' }, { name: 'Health_Insurance_TPA.pdf', size: '1.2 MB' }] },
];

export const initialDepartments: Department[] = [
  { id: 'D-01', name: 'Human Resources', code: 'HR001', hod: 'Amit Sharma', employeeCount: 3, costCenter: 'CC-001', color: 'bg-purple-500' },
  { id: 'D-02', name: 'Engineering', code: 'ENG001', hod: 'Priya Patel', employeeCount: 2, costCenter: 'CC-002', color: 'bg-blue-500' },
  { id: 'D-03', name: 'Operations', code: 'OPS001', hod: 'Rahul Kumar', employeeCount: 1, costCenter: 'CC-003', color: 'bg-orange-500' },
  { id: 'D-04', name: 'Sales', code: 'SAL001', hod: 'Anjali Desai', employeeCount: 1, costCenter: 'CC-004', color: 'bg-green-500' },
  { id: 'D-05', name: 'Finance', code: 'FIN001', hod: 'Vikram Singh', employeeCount: 1, costCenter: 'CC-005', color: 'bg-yellow-500' },
];

export const initialDesignations: Designation[] = [
  { id: 'DES-01', title: 'Chief Executive Officer', grade: 'Grade-1', department: 'Management', minSalary: 300000, maxSalary: 1000000, employeeCount: 1 },
  { id: 'DES-02', title: 'VP of Human Resources', grade: 'Grade-2', department: 'Human Resources', minSalary: 120000, maxSalary: 200000, employeeCount: 1 },
  { id: 'DES-03', title: 'Operations Lead Manager', grade: 'Grade-3', department: 'Operations', minSalary: 80000, maxSalary: 150000, employeeCount: 1 },
  { id: 'DES-04', title: 'Senior Frontend Engineer', grade: 'Grade-4', department: 'Engineering', minSalary: 90000, maxSalary: 160000, employeeCount: 1 },
  { id: 'DES-05', title: 'Software Engineer', grade: 'Grade-5', department: 'Engineering', minSalary: 50000, maxSalary: 100000, employeeCount: 1 },
  { id: 'DES-06', title: 'Senior Account Executive', grade: 'Grade-5', department: 'Sales', minSalary: 45000, maxSalary: 90000, employeeCount: 1 },
  { id: 'DES-07', title: 'Financial Analyst', grade: 'Grade-5', department: 'Finance', minSalary: 60000, maxSalary: 110000, employeeCount: 1 },
];

export const initialLeavePolicies: LeavePolicy[] = [
  { id: 'LP-01', name: 'Casual Leave', code: 'CL', annualDays: 12, maxConsecutive: 3, carryForward: false, maxCarryForward: 0, encashable: false, applicableGender: 'All', color: 'blue' },
  { id: 'LP-02', name: 'Earned / Privilege Leave', code: 'EL', annualDays: 15, maxConsecutive: 15, carryForward: true, maxCarryForward: 45, encashable: true, applicableGender: 'All', color: 'green' },
  { id: 'LP-03', name: 'Sick Leave', code: 'SL', annualDays: 7, maxConsecutive: 7, carryForward: false, maxCarryForward: 0, encashable: false, applicableGender: 'All', color: 'red' },
  { id: 'LP-04', name: 'Leave Without Pay', code: 'LWP', annualDays: 999, maxConsecutive: 30, carryForward: false, maxCarryForward: 0, encashable: false, applicableGender: 'All', color: 'gray' },
  { id: 'LP-05', name: 'Maternity Leave', code: 'ML', annualDays: 180, maxConsecutive: 180, carryForward: false, maxCarryForward: 0, encashable: false, applicableGender: 'Female', color: 'pink' },
  { id: 'LP-06', name: 'Compensatory Leave', code: 'COMP', annualDays: 0, maxConsecutive: 3, carryForward: false, maxCarryForward: 0, encashable: false, applicableGender: 'All', color: 'amber' },
];

export const initialLeaveBalances: LeaveBalance[] = [
  { employeeId: 'EMP-001', employeeName: 'Amit Sharma',    cl: { allocated: 12, used: 3 }, el: { allocated: 15, used: 5 }, sl: { allocated: 7, used: 0 } },
  { employeeId: 'EMP-002', employeeName: 'Priya Patel',    cl: { allocated: 12, used: 1 }, el: { allocated: 15, used: 0 }, sl: { allocated: 7, used: 2 } },
  { employeeId: 'EMP-003', employeeName: 'Rahul Kumar',    cl: { allocated: 12, used: 4 }, el: { allocated: 15, used: 7 }, sl: { allocated: 7, used: 1 } },
  { employeeId: 'EMP-004', employeeName: 'Siddharth Sen',  cl: { allocated: 12, used: 0 }, el: { allocated: 15, used: 2 }, sl: { allocated: 7, used: 0 } },
  { employeeId: 'EMP-005', employeeName: 'Anjali Desai',   cl: { allocated: 12, used: 5 }, el: { allocated: 15, used: 3 }, sl: { allocated: 7, used: 2 } },
  { employeeId: 'EMP-006', employeeName: 'Vikram Singh',   cl: { allocated: 12, used: 2 }, el: { allocated: 15, used: 0 }, sl: { allocated: 7, used: 1 } },
];

