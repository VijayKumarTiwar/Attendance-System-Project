import { Platform } from 'react-native';

// Use localhost for web, 10.0.2.2 for Android emulator, or local IP for physical device
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://127.0.0.1:8000/api';

export const api = {
  // Auth
  login: async (employee_code: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_code, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  // Attendance
  getProfile: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/employees/me/?employee_code=${employee_code}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  getTodayLog: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/attendance/today/?employee_code=${employee_code}`);
    if (!res.ok) throw new Error('Failed to fetch today log');
    return res.json();
  },

  getHistory: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/attendance/history/?employee_code=${employee_code}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  getHrReports: async (employee_code: string) => {
    // Currently relying on employee_code for auth, or assuming global fetch for demo
    const res = await fetch(`${BASE_URL}/hr_report/h_r_reports/`);
    if (!res.ok) throw new Error('Failed to fetch HR reports');
    const data = await res.json();
    return data;
  },

  getSalarySlips: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/payroll/salary_slips/`);
    if (!res.ok) throw new Error('Failed to fetch salary slips');
    const data = await res.json();
    return data;
  },

  getAbsenceBalances: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/leave/absence_balances/`);
    if (!res.ok) throw new Error('Failed to fetch absence balances');
    return res.json();
  },

  getLeaveRequests: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/leave/leave_requests/`);
    if (!res.ok) throw new Error('Failed to fetch leave requests');
    return res.json();
  },

  getHelpdeskTickets: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/helpdesk/tickets/`);
    if (!res.ok) throw new Error('Failed to fetch helpdesk tickets');
    return res.json();
  },

  submitLeaveRequest: async (employee_code: string, payload: any) => {
    const res = await fetch(`${BASE_URL}/leave/leave_requests/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee: 1, ...payload }), // Mock employee ID for now
    });
    if (!res.ok) throw new Error('Failed to submit leave request');
    return res.json();
  },

  submitHelpdeskTicket: async (employee_code: string, payload: any) => {
    const res = await fetch(`${BASE_URL}/helpdesk/tickets/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee: 1, ...payload }),
    });
    if (!res.ok) throw new Error('Failed to submit ticket');
    return res.json();
  },

  getMyShift: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/shifts/my-shift/?employee_code=${employee_code}`);
    if (!res.ok) throw new Error('Failed to fetch shift');
    return res.json();
  },

  getShiftList: async () => {
    const res = await fetch(`${BASE_URL}/shifts/list/`);
    if (!res.ok) throw new Error('Failed to fetch shifts');
    return res.json();
  },

  getCompensation: async (employee_code: string) => {
    const res = await fetch(`${BASE_URL}/payroll/compensation_details/`);
    if (!res.ok) throw new Error('Failed to fetch compensation');
    return res.json();
  },

  punchIn: async (employee_code: string, latitude: number, longitude: number, photoUri?: string) => {
    const formData = new FormData();
    formData.append('employee_code', employee_code);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    if (photoUri) {
      const filename = photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      
      // Handle React Native FormData image format
      formData.append('face_image', {
        uri: Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri,
        name: filename,
        type,
      } as any);
    }

    const res = await fetch(`${BASE_URL}/attendance/punch-in/`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Punch in failed');
    }
    return res.json();
  },

  punchOut: async (employee_code: string, latitude: number, longitude: number, photoUri?: string) => {
    const formData = new FormData();
    formData.append('employee_code', employee_code);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    if (photoUri) {
      const filename = photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      
      formData.append('face_image', {
        uri: Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri,
        name: filename,
        type,
      } as any);
    }

    const res = await fetch(`${BASE_URL}/attendance/punch-out/`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Punch out failed');
    }
    return res.json();
  },
};
