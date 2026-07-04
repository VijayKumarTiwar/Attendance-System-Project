import { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, 
  Alert, Platform, Modal, Animated, Dimensions, TextInput, KeyboardAvoidingView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { api } from '../services/api';

// Types representing Django models
export interface Branch {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  geofence_radius_meters: number;
}
export interface Employee {
  employee_code: string;
  name: string;
  designation: string;
  department: string;
  branch: Branch;
}
export interface AttendanceLog {
  id: number;
  work_date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  status: string;
  total_hours: number | null;
}

// Distance helper
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

const { width } = Dimensions.get('window');

// Define app types
type ModalType = 'none' | 'punch' | 'history' | 'simulation' | 'mockFeature' | 'hrReport' | 'payroll' | 'absences' | 'askHR' | 'leaveManagement' | 'shifts' | 'notifications';

export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const employeeCode = (params.employee_code as string) || 'EMP001';
  
  // App States
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [todayLog, setTodayLog] = useState<AttendanceLog | null>(null);
  const [history, setHistory] = useState<AttendanceLog[]>([]);
  const [simLocation, setSimLocation] = useState({ latitude: 25.2138, longitude: 75.8648 }); // Kota, Rajasthan
  const [enforceGeofence, setEnforceGeofence] = useState(true);
  const [clockTime, setClockTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

 
// Camera States
const [permission, requestPermission] = useCameraPermissions();
const [showCameraFor, setShowCameraFor] = useState<'in' | 'out' | null>(null);
const cameraRef = useRef<CameraView | null>(null);

  // Oracle UI States
  const [activeTab, setActiveTab] = useState<'Me' | 'My Team' | 'My Client Groups'>('Me');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalType>('none');
  const [mockFeatureTitle, setMockFeatureTitle] = useState('');
  const [drawerMeOpen, setDrawerMeOpen] = useState(true);
  const [activeDrawerItem, setActiveDrawerItem] = useState('leaves');
  const [showAllApps, setShowAllApps] = useState(false);
  const [hrReports, setHrReports] = useState<any[]>([]);
  const [salarySlips, setSalarySlips] = useState<any[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [helpdeskTickets, setHelpdeskTickets] = useState<any[]>([]);

  // Leave Form States
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState('CL');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  // Ticket Form States
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('General');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  // Shift States
  const [myShift, setMyShift] = useState<any>(null);
  const [allShifts, setAllShifts] = useState<any[]>([]);

  // Compensation States
  const [compensation, setCompensation] = useState<any>(null);

  // Notifications (generated from data)
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Drawer Animation
  const [drawerAnim] = useState(new Animated.Value(-width * 0.8));

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialization
  const refreshData = async () => {
    try {
      setLoading(true);
      const profile = await api.getProfile(employeeCode);
      setEmployee(profile);

      const log = await api.getTodayLog(employeeCode);
      // Backend returns { message: '...' } if no log exists, or the actual log object
      if (log && log.id) {
        setTodayLog(log);
      } else {
        setTodayLog(null);
      }

      const hist = await api.getHistory(employeeCode);
      setHistory(hist?.results || hist || []);

      const reports = await api.getHrReports(employeeCode);
      setHrReports(reports?.results || reports || []);

      const slips = await api.getSalarySlips(employeeCode);
      setSalarySlips(slips?.results || slips || []);

      const balances = await api.getAbsenceBalances(employeeCode);
      setLeaveBalances(balances?.results || balances || []);

      const requests = await api.getLeaveRequests(employeeCode);
      setLeaveRequests(requests?.results || requests || []);

      const tickets = await api.getHelpdeskTickets(employeeCode);
      setHelpdeskTickets(tickets?.results || tickets || []);

      // Shifts
      try {
        const shift = await api.getMyShift(employeeCode);
        setMyShift(shift);
      } catch { setMyShift(null); }

      try {
        const shifts = await api.getShiftList();
        setAllShifts(shifts?.results || shifts || []);
      } catch { setAllShifts([]); }

      // Compensation
      try {
        const comp = await api.getCompensation(employeeCode);
        const compArr = comp?.results || comp || [];
        setCompensation(compArr.length > 0 ? compArr[0] : null);
      } catch { setCompensation(null); }

      // Build notifications from data
      const notifs: any[] = [];
      const pendingLeaves = (requests?.results || requests || []).filter((r: any) => r.status === 'Pending');
      pendingLeaves.forEach((l: any) => notifs.push({ id: `leave-${l.id}`, type: 'leave', icon: 'calendar-outline', title: 'Leave Pending', message: `Your ${l.leave_type} leave (${l.start_date} to ${l.end_date}) is pending approval.`, time: 'Recent' }));
      const approvedLeaves = (requests?.results || requests || []).filter((r: any) => r.status === 'Approved');
      approvedLeaves.forEach((l: any) => notifs.push({ id: `leave-a-${l.id}`, type: 'leave', icon: 'checkmark-circle-outline', title: 'Leave Approved', message: `Your ${l.leave_type} leave (${l.start_date} to ${l.end_date}) was approved.`, time: 'Recent' }));
      const openTickets = (tickets?.results || tickets || []).filter((t: any) => t.status === 'open' || t.status === 'in_progress');
      openTickets.forEach((t: any) => notifs.push({ id: `ticket-${t.id}`, type: 'ticket', icon: 'chatbubble-ellipses-outline', title: `Ticket: ${t.subject}`, message: `Status: ${t.status} | Priority: ${t.priority}`, time: 'Active' }));
      if (log && log.id && log.check_in_at) {
        notifs.push({ id: 'attendance-today', type: 'attendance', icon: 'finger-print', title: 'Attendance Recorded', message: `Checked in at ${new Date(log.check_in_at).toLocaleTimeString()}${log.check_out_at ? ', Checked out at ' + new Date(log.check_out_at).toLocaleTimeString() : ''}`, time: 'Today' });
      }
      if (!log || !log.id) {
        notifs.push({ id: 'attendance-reminder', type: 'attendance', icon: 'alert-circle-outline', title: 'Attendance Reminder', message: 'You have not checked in today. Please mark your attendance.', time: 'Now' });
      }
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, []);

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -width * 0.8 : 0;
    Animated.timing(drawerAnim, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (!employee) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </SafeAreaView>
    );
  }

  // Live Geofence Computations
  const branch = employee.branch;
  const currentDistance = haversineDistance(
    simLocation.latitude, simLocation.longitude, branch.latitude, branch.longitude
  );
  const withinGeofence = currentDistance <= branch.geofence_radius_meters;

  const triggerPunchIn = () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    setShowCameraFor('in');
  };

  const triggerPunchOut = () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    setShowCameraFor('out');
  };

  const handleCaptureAndPunch = async () => {
    if (!cameraRef.current) return;
    
    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
      });

      if (showCameraFor === 'in') {
        const res = await api.punchIn(employee.employee_code, simLocation.latitude, simLocation.longitude, photo.uri);
        Alert.alert('Success', res.message, [{ text: 'OK', onPress: refreshData }]);
      } else if (showCameraFor === 'out') {
        const res = await api.punchOut(employee.employee_code, simLocation.latitude, simLocation.longitude, photo.uri);
        Alert.alert('Success', res.message, [{ text: 'OK', onPress: refreshData }]);
      }
    } catch (err: any) {
      Alert.alert('Punch Failed', err.message);
    } finally {
      setShowCameraFor(null);
      setLoading(false);
    }
  };

  const handlePresetLocation = (label: string, lat: number, lon: number) => {
    setSimLocation({ latitude: lat, longitude: lon });
    Alert.alert('GPS Simulated', `Location set to: ${label}`);
  };

  const handleLogout = () => {
    router.replace('/');
  };

  const openMockFeature = (title: string) => {
    setMockFeatureTitle(title);
    setModalView('mockFeature');
  };

  const handleSubmitLeave = async () => {
    if (!leaveStartDate || !leaveEndDate || !leaveReason) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    setLeaveSubmitting(true);
    try {
      await api.submitLeaveRequest(employeeCode, {
        leave_type: leaveType,
        start_date: leaveStartDate,
        end_date: leaveEndDate,
        reason: leaveReason,
        status: 'Pending',
      });
      Alert.alert('Success', 'Leave request submitted successfully!', [{ text: 'OK' }]);
      setShowLeaveForm(false);
      setLeaveType('CL');
      setLeaveStartDate('');
      setLeaveEndDate('');
      setLeaveReason('');
      refreshData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLeaveSubmitting(false);
    }
  };

  const handleSubmitTicket = async () => {
    if (!ticketSubject || !ticketDescription) {
      Alert.alert('Validation Error', 'Please fill in Subject and Description.');
      return;
    }
    setTicketSubmitting(true);
    try {
      await api.submitHelpdeskTicket(employeeCode, {
        subject: ticketSubject,
        category: ticketCategory,
        priority: ticketPriority,
        description: ticketDescription,
        status: 'open',
      });
      Alert.alert('Success', 'Support ticket created successfully!', [{ text: 'OK' }]);
      setShowTicketForm(false);
      setTicketSubject('');
      setTicketCategory('General');
      setTicketPriority('Medium');
      setTicketDescription('');
      refreshData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setTicketSubmitting(false);
    }
  };

  const renderAppTile = (title: string, iconName: any, iconLib: any, type: ModalType, mockTitle: string = '') => (
    <TouchableOpacity 
      style={styles.appTile} 
      onPress={() => {
        if (type === 'mockFeature') openMockFeature(mockTitle || title);
        else setModalView(type);
      }}
    >
      <View style={styles.appTileIconContainer}>
        {iconLib === 'Ionicons' && <Ionicons name={iconName} size={28} color="#ffffff" />}
        {iconLib === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={iconName} size={28} color="#ffffff" />}
        {iconLib === 'FontAwesome5' && <FontAwesome5 name={iconName} size={24} color="#ffffff" />}
      </View>
      <Text style={styles.appTileText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.greenMenuButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Rajasthan State Gas Limited</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setModalView('notifications')}>
            <View>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              {notifications.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{notifications.length}</Text></View>}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['Me', 'My Team', 'My Client Groups'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Me' && (
          <>
            {/* Quick Actions */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>QUICK ACTIONS</Text>
              {[
                { name: 'Calendar', icon: 'calendar-outline' },
                { name: 'Personal Details', icon: 'person-outline' },
                { name: 'Document Records', icon: 'document-outline' },
                { name: 'Contact Info', icon: 'mail-outline' },
                { name: 'My Organization Chart', icon: 'git-network-outline' },
                { name: 'My Public Info', icon: 'id-card-outline' }
              ].map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.quickActionRow} onPress={() => openMockFeature(item.name)}>
                  <Ionicons name={item.icon as any} size={20} color="#ffffff" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.showMoreButton}>
                <Text style={styles.showMoreText}>Show More</Text>
              </TouchableOpacity>
            </View>

            {/* Apps */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>APPS</Text>
              <View style={styles.gridContainer}>
                {renderAppTile('Mobile Attendance', 'cellphone-cog', 'MaterialCommunityIcons', 'punch')}
                {renderAppTile('My Attendance Report', 'timer-outline', 'Ionicons', 'history')}
                {renderAppTile('View My Shifts', 'calendar-outline', 'Ionicons', 'shifts')}
                {renderAppTile('Plan My Shifts', 'calendar-edit', 'MaterialCommunityIcons', 'shifts')}
                {renderAppTile('My Payroll', 'cash-outline', 'Ionicons', 'payroll')}
                {renderAppTile('Directory', 'account-group', 'MaterialCommunityIcons', 'mockFeature', 'Directory')}
                
                {showAllApps && (
                  <>
                    {renderAppTile('Journeys', 'compass-outline', 'Ionicons', 'mockFeature', 'Journeys')}
                    {renderAppTile('Time and Absences', 'time-outline', 'Ionicons', 'mockFeature', 'Time and Absences')}
                    {renderAppTile('My Compensation', 'wallet-outline', 'Ionicons', 'mockFeature', 'My Compensation')}
                    {renderAppTile('Personal Information', 'account-details', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('Benefits', 'medical-bag', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('IJP and Referrals', 'account-arrow-right-outline', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('Roles and Delegations', 'badge-account-horizontal', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('AskHR', 'help-circle-outline', 'MaterialCommunityIcons', 'askHR')}
                    {renderAppTile('Policy Handbook', 'book-outline', 'Ionicons', 'mockFeature')}
                    {renderAppTile('Holiday List', 'calendar-month-outline', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('My Dashboard', 'chart-bar', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('Bank Details', 'bank', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('Full Timers Monthly Attendance', 'calendar-check-outline', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('PMS Survey', 'clipboard-text-outline', 'MaterialCommunityIcons', 'mockFeature')}
                    {renderAppTile('Reward & Recognition', 'star-outline', 'Ionicons', 'mockFeature', 'Reward & Recognition')}
                    {renderAppTile('Pending Checklist Tasks', 'clipboard-check-outline', 'MaterialCommunityIcons', 'mockFeature', 'Pending Checklist Tasks')}
                  </>
                )}
              </View>
              <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAllApps(!showAllApps)}>
                <Text style={styles.showMoreText}>{showAllApps ? 'Show Less' : 'Show More'}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {activeTab === 'My Team' && (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ffffff" />
            <Text style={styles.emptyText}>Team Management Dashboard</Text>
            <Text style={styles.emptySubtext}>Approvals, Team Analytics, and Details will appear here.</Text>
          </View>
        )}
        {activeTab === 'My Client Groups' && (
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color="#ffffff" />
            <Text style={styles.emptyText}>HR Administration</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => setModalView('simulation')}>
              <Text style={styles.actionButtonText}>Open GPS Simulator Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <TouchableOpacity style={styles.drawerOverlay} onPress={toggleDrawer} activeOpacity={1} />
      )}

      {/* Animated Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.drawerHeader}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleDrawer}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.drawerTitle}>Navigation</Text>
          </View>
          <ScrollView>
            <View style={styles.drawerProfile}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{employee.name.charAt(0)}</Text></View>
              <Text style={styles.drawerEmpName}>{employee.name}</Text>
              <Text style={styles.drawerEmpRole}>{employee.designation}</Text>
            </View>
            <View style={{ paddingTop: 10 }}>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'view-dashboard-outline', action: () => { toggleDrawer(); setActiveTab('Me'); } },
                { id: 'attendance', label: 'Attendance', icon: 'calendar-check-outline', action: () => { toggleDrawer(); setModalView('history'); } },
                { id: 'employees', label: 'Employees', icon: 'account-group-outline', action: () => { toggleDrawer(); openMockFeature('Employees'); } },
                { id: 'leaves', label: 'Leave Management', icon: 'calendar-month-outline', action: () => { toggleDrawer(); setModalView('leaveManagement'); } },
                { id: 'shifts', label: 'Shift Management', icon: 'calendar-clock-outline', action: () => { toggleDrawer(); setModalView('shifts'); } },
                { id: 'payroll', label: 'Payroll Portal', icon: 'cash-multiple', action: () => { toggleDrawer(); setModalView('payroll'); } },
                { id: 'reports', label: 'Analytics Reports', icon: 'chart-bar', action: () => { toggleDrawer(); openMockFeature('Analytics Reports'); } },
                { id: 'settings', label: 'Settings', icon: 'cog-outline', action: () => { toggleDrawer(); openMockFeature('Settings'); } },
                { id: 'profile', label: 'My Profile', icon: 'account-outline', action: () => { toggleDrawer(); openMockFeature('My Profile'); } },
              ].map((item, idx) => {
                const isActive = activeDrawerItem === item.id;
                return (
                  <TouchableOpacity 
                    key={idx} 
                    style={[
                      styles.drawerListItem, 
                      isActive && styles.drawerListItemActive
                    ]} 
                    onPress={() => {
                      setActiveDrawerItem(item.id);
                      item.action();
                    }}
                  >
                    {isActive && <View style={styles.activePill} />}
                    <MaterialCommunityIcons 
                      name={item.icon as any} 
                      size={24} 
                      color={isActive ? '#1a73e8' : '#778ca3'} 
                      style={{ marginRight: 16, marginLeft: isActive ? 16 : 20 }}
                    />
                    <Text style={[styles.drawerListText, isActive && styles.drawerListTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#e63946" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* --- MODALS --- */}

      {/* 1. Mock Feature Modal */}
      <Modal visible={modalView === 'mockFeature'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>{mockFeatureTitle}</Text>
            <View style={{width: 28}} />
          </View>
          <View style={styles.modalContentCenter}>
            <Ionicons name="construct-outline" size={64} color="#000" />
            <Text style={styles.modalMockTitle}>{mockFeatureTitle} Module</Text>
            <Text style={styles.modalMockDesc}>This enterprise module is fully functional in the backend but mocked for this demo interface.</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalView('none')}>
              <Text style={styles.modalCloseBtnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 2. Mobile Attendance (Punch) Modal */}
      <Modal visible={modalView === 'punch'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Mobile Attendance</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={styles.punchModalContent}>
             <View style={styles.clockCard}>
               <Text style={styles.clockTimeText}>
                 {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </Text>
               <Text style={styles.clockDateText}>
                 {clockTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
               </Text>
             </View>

             <View style={[styles.geofenceCard, withinGeofence ? styles.geofenceCardSuccess : styles.geofenceCardDanger]}>
               <Text style={[styles.geofenceTitle, { color: withinGeofence ? '#065f46' : '#991b1b' }]}>
                 {withinGeofence ? '✓ Inside Geofence Area' : '⚠ Outside Geofence Area'}
               </Text>
               <Text style={styles.geofenceDetails}>Office: {branch.name}</Text>
               <Text style={styles.geofenceDetails}>Distance: {Math.round(currentDistance)}m (Allowed: {branch.geofence_radius_meters}m)</Text>
             </View>

             <View style={styles.punchActionContainer}>
               {loading ? (
                 <ActivityIndicator size="large" color="#000" />
               ) : (
                 <>
                   {!todayLog?.check_in_at ? (
                     <TouchableOpacity style={[styles.punchCircleBtn, styles.punchInBtn, !withinGeofence && enforceGeofence && styles.disabledBtn]} onPress={triggerPunchIn}>
                       <Ionicons name="finger-print" size={54} color="#fff" />
                       <Text style={styles.punchCircleText}>PUNCH IN</Text>
                     </TouchableOpacity>
                   ) : !todayLog.check_out_at ? (
                     <TouchableOpacity style={[styles.punchCircleBtn, styles.punchOutBtn, !withinGeofence && enforceGeofence && styles.disabledBtn]} onPress={triggerPunchOut}>
                       <Ionicons name="finger-print" size={54} color="#fff" />
                       <Text style={styles.punchCircleText}>PUNCH OUT</Text>
                     </TouchableOpacity>
                   ) : (
                     <View style={[styles.punchCircleBtn, styles.punchDoneBtn]}>
                       <Ionicons name="checkmark-done-circle" size={54} color="#fff" />
                       <Text style={styles.punchCircleText}>COMPLETED</Text>
                     </View>
                   )}
                 </>
               )}
             </View>
             <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalView('none')}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
             </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 3. History Modal */}
      <Modal visible={modalView === 'history'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>My Attendance Report</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={{padding: 16}}>
             {history.length === 0 ? (
               <Text style={styles.emptyText}>No historical records found.</Text>
             ) : (
               history.map((log) => (
                 <View key={log.id} style={styles.historyCard}>
                   <View style={styles.historyCardHeader}>
                     <Text style={styles.historyDate}>{new Date(log.work_date).toLocaleDateString()}</Text>
                     <Text style={{color: log.status === 'LATE' ? '#f59e0b' : log.status === 'PRESENT' ? '#10b981' : '#000', fontWeight: 'bold'}}>{log.status}</Text>
                   </View>
                   <Text style={{color: '#000', marginTop: 8}}>IN: {log.check_in_at ? new Date(log.check_in_at).toLocaleTimeString() : '--:--'}</Text>
                   <Text style={{color: '#000'}}>OUT: {log.check_out_at ? new Date(log.check_out_at).toLocaleTimeString() : '--:--'}</Text>
                 </View>
               ))
             )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 4. GPS Simulator Modal */}
      <Modal visible={modalView === 'simulation'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>GPS Simulator</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={{padding: 16}}>
             <Text style={{color: '#000', fontSize: 16, marginBottom: 20}}>Select a preset location to simulate where your phone is located relative to your office.</Text>
             
             <TouchableOpacity style={styles.actionButton} onPress={() => handlePresetLocation('At Office (HQ Center)', 12.9716, 77.5946)}>
               <Text style={styles.actionButtonText}>Simulate: At HQ Center (Inside)</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionButton} onPress={() => handlePresetLocation('Near HQ boundary', 12.9722, 77.5953)}>
               <Text style={styles.actionButtonText}>Simulate: Near HQ Edge (Inside)</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionButton} onPress={() => handlePresetLocation('At Home / Too Far', 12.9900, 77.5500)}>
               <Text style={styles.actionButtonText}>Simulate: At Home (Outside)</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionButton} onPress={() => handlePresetLocation('At Indiranagar Store', 12.9625, 77.6380)}>
               <Text style={styles.actionButtonText}>Simulate: Retail Store Branch</Text>
             </TouchableOpacity>

             <View style={{marginTop: 40}}>
                <Text style={{color: '#000', fontSize: 16, marginBottom: 10}}>Geofence Validation: {enforceGeofence ? 'ON' : 'OFF'}</Text>
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: enforceGeofence ? '#e63946' : '#10b981'}]} onPress={() => setEnforceGeofence(!enforceGeofence)}>
                  <Text style={styles.actionButtonText}>Toggle Validation</Text>
                </TouchableOpacity>
             </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Camera Modal */}
      <Modal visible={showCameraFor !== null} animationType="slide" transparent={false} onRequestClose={() => setShowCameraFor(null)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, zIndex: 10 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Face Punch Verification</Text>
            <TouchableOpacity onPress={() => setShowCameraFor(null)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 300, height: 400, borderRadius: 150, overflow: 'hidden', borderWidth: 4, borderColor: '#3b82f6' }}>
              <CameraView 
                ref={cameraRef}
                style={{ flex: 1 }} 
                facing="front"
              />
            </View>
            <Text style={{ color: '#fff', marginTop: 30, fontSize: 16, textAlign: 'center', paddingHorizontal: 20 }}>
              Please align your face in the circle and capture to verify your {showCameraFor === 'in' ? 'check-in' : 'check-out'}.
            </Text>
          </View>

          <View style={{ padding: 30, alignItems: 'center' }}>
            <TouchableOpacity 
              style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' }}
              onPress={handleCaptureAndPunch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="camera" size={32} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 4. HR Report Modal */}
      <Modal visible={modalView === 'hrReport'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>HR Reports</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38', marginBottom: 20 }}>Available Reports</Text>
            {hrReports.length === 0 ? (
              <Text style={{ color: '#555', textAlign: 'center', marginTop: 40 }}>No reports generated yet.</Text>
            ) : (
              hrReports.map((report: any) => (
                <View key={report.id} style={styles.reportCard}>
                  <Text style={styles.reportTitle}>{report.report_type}</Text>
                  <Text style={styles.reportMeta}>
                    Period: {report.period_start} to {report.period_end}
                  </Text>
                  <TouchableOpacity style={styles.reportDownloadBtn} onPress={() => Alert.alert('Downloading...', 'Your report is being generated.')}>
                    <Ionicons name="download-outline" size={18} color="#ffffff" />
                    <Text style={styles.reportDownloadText}>Download PDF</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 5. Payroll Modal */}
      <Modal visible={modalView === 'payroll'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>My Payroll</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={[styles.reportCard, { backgroundColor: '#1a3b38', borderColor: '#1a3b38' }]}>
              <Text style={[styles.reportTitle, { color: '#fff' }]}>Current Compensation</Text>
              <Text style={{ color: '#e0e0e0', fontSize: 14, marginTop: 4 }}>Basic + Allowances</Text>
              <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 12 }}>₹ 100,000 / mo</Text>
            </View>

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38', marginBottom: 20, marginTop: 10 }}>Recent Payslips</Text>
            {salarySlips.length === 0 ? (
              <Text style={{ color: '#555', textAlign: 'center', marginTop: 20 }}>No payslips available.</Text>
            ) : (
              salarySlips.map((slip: any) => (
                <View key={slip.id} style={styles.reportCard}>
                  <Text style={styles.reportTitle}>{slip.month} {slip.year}</Text>
                  <Text style={styles.reportMeta}>
                    Basic: ₹{slip.basic_salary} | Allowances: ₹{slip.allowances}
                  </Text>
                  <Text style={[styles.reportMeta, { color: '#e63946' }]}>
                    Deductions: -₹{slip.deductions}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 }}>
                    Net Pay: ₹{slip.net_payable}
                  </Text>
                  <TouchableOpacity style={styles.reportDownloadBtn} onPress={() => Alert.alert('Downloading...', 'Your payslip is downloading.')}>
                    <Ionicons name="download-outline" size={18} color="#ffffff" />
                    <Text style={styles.reportDownloadText}>Download Payslip</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 6. Time and Absences Modal */}
      <Modal visible={modalView === 'absences'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Time and Absences</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38' }}>Leave Balances</Text>
              <TouchableOpacity style={{ backgroundColor: '#1a3b38', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>+ Request Leave</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
              {leaveBalances.map((bal: any) => (
                <View key={bal.id} style={[styles.reportCard, { width: '48%', padding: 12, marginBottom: 12 }]}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a3b38' }}>{bal.leave_type} Balance</Text>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#000' }}>
                    {bal.total_leaves - bal.used_leaves} <Text style={{ fontSize: 12, color: '#555' }}>days</Text>
                  </Text>
                  <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Used: {bal.used_leaves} / {bal.total_leaves}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38', marginBottom: 16 }}>Recent Requests</Text>
            {leaveRequests.length === 0 ? (
              <Text style={{ color: '#555', textAlign: 'center', marginTop: 20 }}>No leave requests found.</Text>
            ) : (
              leaveRequests.map((req: any) => (
                <View key={req.id} style={styles.reportCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                      <Text style={styles.reportTitle}>{req.leave_type} - {req.reason}</Text>
                      <Text style={styles.reportMeta}>{req.start_date} to {req.end_date}</Text>
                    </View>
                    <View style={{ 
                      backgroundColor: req.status === 'Approved' ? '#e6f4ea' : req.status === 'Rejected' ? '#fce8e6' : '#fef7e0', 
                      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 
                    }}>
                      <Text style={{ 
                        color: req.status === 'Approved' ? '#137333' : req.status === 'Rejected' ? '#c5221f' : '#b06000', 
                        fontSize: 12, fontWeight: 'bold' 
                      }}>{req.status}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}

          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 7. AskHR Modal */}
      <Modal visible={modalView === 'askHR'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setModalView('none'); setShowTicketForm(false); }}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setModalView('none'); setShowTicketForm(false); }}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>AskHR</Text>
            <View style={{width: 28}} />
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38' }}>My Support Tickets</Text>
              <TouchableOpacity style={{ backgroundColor: '#1a3b38', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }} onPress={() => setShowTicketForm(!showTicketForm)}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{showTicketForm ? '✕ Cancel' : '+ Create Ticket'}</Text>
              </TouchableOpacity>
            </View>

            {/* Create Ticket Form */}
            {showTicketForm && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Create New Ticket</Text>

                <Text style={styles.formLabel}>Subject *</Text>
                <TextInput style={styles.formInput} placeholder="Enter subject" placeholderTextColor="#999" value={ticketSubject} onChangeText={setTicketSubject} />

                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.formChipRow}>
                  {['General', 'Payroll', 'Leave', 'IT Support', 'Policy'].map((cat) => (
                    <TouchableOpacity key={cat} style={[styles.formChip, ticketCategory === cat && styles.formChipActive]} onPress={() => setTicketCategory(cat)}>
                      <Text style={[styles.formChipText, ticketCategory === cat && styles.formChipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Priority</Text>
                <View style={styles.formChipRow}>
                  {['Low', 'Medium', 'High', 'Urgent'].map((pri) => (
                    <TouchableOpacity key={pri} style={[styles.formChip, ticketPriority === pri && styles.formChipActive]} onPress={() => setTicketPriority(pri)}>
                      <Text style={[styles.formChipText, ticketPriority === pri && styles.formChipTextActive]}>{pri}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Description *</Text>
                <TextInput style={[styles.formInput, styles.formTextArea]} placeholder="Describe your issue..." placeholderTextColor="#999" multiline numberOfLines={4} value={ticketDescription} onChangeText={setTicketDescription} />

                <TouchableOpacity style={styles.formSubmitBtn} onPress={handleSubmitTicket} disabled={ticketSubmitting}>
                  {ticketSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.formSubmitText}>Submit Ticket</Text>}
                </TouchableOpacity>
              </View>
            )}

            {helpdeskTickets.length === 0 && !showTicketForm ? (
              <Text style={{ color: '#555', textAlign: 'center', marginTop: 40 }}>No tickets found.</Text>
            ) : (
              helpdeskTickets.map((ticket: any) => (
                <View key={ticket.id} style={styles.reportCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={styles.reportTitle}>{ticket.subject}</Text>
                      <Text style={[styles.reportMeta, { marginTop: 4 }]}>Category: {ticket.category} | Priority: {ticket.priority}</Text>
                    </View>
                    <View style={{ 
                      backgroundColor: ticket.status === 'open' ? '#fef7e0' : ticket.status === 'resolved' ? '#e6f4ea' : ticket.status === 'in_progress' ? '#e8f0fe' : '#f1f3f4', 
                      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 
                    }}>
                      <Text style={{ 
                        color: ticket.status === 'open' ? '#b06000' : ticket.status === 'resolved' ? '#137333' : ticket.status === 'in_progress' ? '#1a73e8' : '#5f6368', 
                        fontSize: 12, fontWeight: 'bold' 
                      }}>{ticket.status}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* 8. Leave Management Modal */}
      <Modal visible={modalView === 'leaveManagement'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setModalView('none'); setShowLeaveForm(false); }}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setModalView('none'); setShowLeaveForm(false); }}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Leave Management</Text>
            <View style={{width: 28}} />
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>

            {/* Leave Balances Overview */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38', marginBottom: 16 }}>Leave Balances</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
              {leaveBalances.length === 0 ? (
                <Text style={{ color: '#555' }}>No balance data available.</Text>
              ) : (
                leaveBalances.map((bal: any) => (
                  <View key={bal.id} style={[styles.reportCard, { width: '48%', padding: 12, marginBottom: 12 }]}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1a3b38' }}>{bal.leave_type}</Text>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 6, color: '#000' }}>
                      {bal.total_leaves - bal.used_leaves} <Text style={{ fontSize: 11, color: '#555' }}>left</Text>
                    </Text>
                    <View style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: '#e0e0e0' }}>
                      <View style={{ height: 6, borderRadius: 3, backgroundColor: bal.used_leaves / bal.total_leaves > 0.8 ? '#e63946' : '#10b981', width: `${Math.min((bal.used_leaves / bal.total_leaves) * 100, 100)}%` }} />
                    </View>
                    <Text style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Used: {bal.used_leaves} / {bal.total_leaves}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Apply Leave Button */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38' }}>Recent Requests</Text>
              <TouchableOpacity style={{ backgroundColor: '#1a3b38', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }} onPress={() => setShowLeaveForm(!showLeaveForm)}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{showLeaveForm ? '✕ Cancel' : '+ Apply Leave'}</Text>
              </TouchableOpacity>
            </View>

            {/* Apply Leave Form */}
            {showLeaveForm && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Apply for Leave</Text>

                <Text style={styles.formLabel}>Leave Type</Text>
                <View style={styles.formChipRow}>
                  {['CL', 'EL', 'SL', 'LWP'].map((type) => (
                    <TouchableOpacity key={type} style={[styles.formChip, leaveType === type && styles.formChipActive]} onPress={() => setLeaveType(type)}>
                      <Text style={[styles.formChipText, leaveType === type && styles.formChipTextActive]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Start Date * (YYYY-MM-DD)</Text>
                <TextInput style={styles.formInput} placeholder="e.g. 2026-07-01" placeholderTextColor="#999" value={leaveStartDate} onChangeText={setLeaveStartDate} />

                <Text style={styles.formLabel}>End Date * (YYYY-MM-DD)</Text>
                <TextInput style={styles.formInput} placeholder="e.g. 2026-07-03" placeholderTextColor="#999" value={leaveEndDate} onChangeText={setLeaveEndDate} />

                <Text style={styles.formLabel}>Reason *</Text>
                <TextInput style={[styles.formInput, styles.formTextArea]} placeholder="Enter reason for leave..." placeholderTextColor="#999" multiline numberOfLines={3} value={leaveReason} onChangeText={setLeaveReason} />

                <TouchableOpacity style={styles.formSubmitBtn} onPress={handleSubmitLeave} disabled={leaveSubmitting}>
                  {leaveSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.formSubmitText}>Submit Leave Request</Text>}
                </TouchableOpacity>
              </View>
            )}

            {/* Recent Leave Requests */}
            {leaveRequests.length === 0 && !showLeaveForm ? (
              <Text style={{ color: '#555', textAlign: 'center', marginTop: 20 }}>No leave requests found.</Text>
            ) : (
              leaveRequests.map((req: any) => (
                <View key={req.id} style={styles.reportCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reportTitle}>{req.leave_type} — {req.reason}</Text>
                      <Text style={styles.reportMeta}>{req.start_date} → {req.end_date}</Text>
                    </View>
                    <View style={{ 
                      backgroundColor: req.status === 'Approved' ? '#e6f4ea' : req.status === 'Rejected' ? '#fce8e6' : '#fef7e0', 
                      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 
                    }}>
                      <Text style={{ 
                        color: req.status === 'Approved' ? '#137333' : req.status === 'Rejected' ? '#c5221f' : '#b06000', 
                        fontSize: 12, fontWeight: 'bold' 
                      }}>{req.status}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}

          </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* 9. Shift Management Modal */}
      <Modal visible={modalView === 'shifts'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Shift Management</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>

            {/* My Current Shift */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38', marginBottom: 16 }}>My Current Shift</Text>
            {myShift && myShift.shift ? (
              <View style={[styles.reportCard, { backgroundColor: '#1a3b38', borderColor: '#1a3b38' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <MaterialCommunityIcons name="clock-outline" size={28} color="#fff" />
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginLeft: 12 }}>{myShift.shift.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#a0b3b1', fontSize: 12 }}>START TIME</Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 }}>{myShift.shift.start_time}</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#2e5754' }} />
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#a0b3b1', fontSize: 12 }}>END TIME</Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 }}>{myShift.shift.end_time}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: '#2e5754', borderRadius: 6, padding: 8, marginTop: 8 }}>
                  <Text style={{ color: '#a0b3b1', fontSize: 12, textAlign: 'center' }}>Grace Period: {myShift.shift.grace_period_minutes} minutes</Text>
                </View>
                <Text style={{ color: '#a0b3b1', fontSize: 12, marginTop: 8 }}>Effective From: {myShift.effective_from}{myShift.effective_to ? ` to ${myShift.effective_to}` : ' (Ongoing)'}</Text>
              </View>
            ) : (
              <View style={[styles.reportCard, { alignItems: 'center', paddingVertical: 30 }]}>
                <MaterialCommunityIcons name="calendar-remove-outline" size={40} color="#999" />
                <Text style={{ color: '#555', marginTop: 12, fontSize: 15 }}>No shift currently assigned.</Text>
              </View>
            )}

            {/* All Available Shifts */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3b38', marginBottom: 16, marginTop: 24 }}>All Available Shifts</Text>
            {allShifts.length === 0 ? (
              <Text style={{ color: '#555', textAlign: 'center' }}>No shifts configured.</Text>
            ) : (
              allShifts.map((shift: any) => (
                <View key={shift.id} style={styles.reportCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.reportTitle}>{shift.name}</Text>
                      <Text style={styles.reportMeta}>{shift.start_time} — {shift.end_time}</Text>
                    </View>
                    <View style={{ backgroundColor: '#e6f4ea', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ color: '#137333', fontSize: 11, fontWeight: 'bold' }}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Grace: {shift.grace_period_minutes} min</Text>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 10. Notifications Modal */}
      <Modal visible={modalView === 'notifications'} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalView('none')}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalView('none')}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Notifications</Text>
            <View style={{width: 28}} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {notifications.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 60 }}>
                <Ionicons name="notifications-off-outline" size={56} color="#ccc" />
                <Text style={{ color: '#555', fontSize: 16, marginTop: 16 }}>You're all caught up!</Text>
                <Text style={{ color: '#999', fontSize: 13, marginTop: 6 }}>No new notifications.</Text>
              </View>
            ) : (
              notifications.map((notif: any) => (
                <TouchableOpacity key={notif.id} style={styles.notifCard} onPress={() => {
                  if (notif.type === 'leave') setModalView('leaveManagement');
                  else if (notif.type === 'ticket') setModalView('askHR');
                  else if (notif.type === 'attendance') setModalView('punch');
                }}>
                  <View style={[
                    styles.notifIconCircle,
                    { backgroundColor: notif.type === 'leave' ? '#e8f0fe' : notif.type === 'ticket' ? '#fef7e0' : notif.type === 'attendance' ? '#ecfdf5' : '#f1f3f4' }
                  ]}>
                    <Ionicons name={notif.icon} size={22} color={
                      notif.type === 'leave' ? '#1a73e8' : notif.type === 'ticket' ? '#b06000' : notif.type === 'attendance' ? '#10b981' : '#555'
                    } />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifMessage}>{notif.message}</Text>
                  </View>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3b38' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a3b38' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#ffffff' },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#1a3b38', borderBottomWidth: 1, borderBottomColor: '#122e2b' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerTitle: { color: '#ffffff', fontSize: 17, fontWeight: 'bold', marginLeft: 16, flexShrink: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 4, marginLeft: 12 },
  greenMenuButton: {
    backgroundColor: '#2ecc71',
    padding: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#e63946', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  // Tabs
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#122e2b', backgroundColor: '#1a3b38' },
  tab: { paddingVertical: 12, marginRight: 24, position: 'relative' },
  tabText: { color: '#a0b3b1', fontSize: 15, fontWeight: '500' },
  tabTextActive: { color: '#ffffff', fontWeight: 'bold' },
  activeTabIndicator: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, backgroundColor: '#ffffff', borderRadius: 2 },

  scrollContent: { paddingBottom: 40, backgroundColor: '#1a3b38' },
  
  // Section UI
  sectionContainer: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginBottom: 12, letterSpacing: 0.5 },
  
  // Quick Actions
  quickActionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#122e2b' },
  quickActionIcon: { marginRight: 16 },
  quickActionText: { color: '#ffffff', fontSize: 15 },
  showMoreButton: { marginTop: 16, paddingVertical: 8 },
  showMoreText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },

  // Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  appTile: { width: '48%', backgroundColor: '#2e5754', borderRadius: 0, padding: 16, marginBottom: 4, alignItems: 'center' },
  appTileIconContainer: { marginBottom: 12 },
  appTileText: { color: '#ffffff', fontSize: 13, textAlign: 'center', fontWeight: 'bold' },

  // Emptys
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyText: { color: '#ffffff', fontSize: 18, marginTop: 16, fontWeight: 'bold' },
  emptySubtext: { color: '#a0b3b1', fontSize: 14, marginTop: 8, textAlign: 'center' },
  actionButton: { backgroundColor: '#2e5754', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, marginTop: 24, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#122e2b' },
  actionButtonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },

  // Drawer
  drawerOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 },
  drawer: { position: 'absolute', top: 0, bottom: 0, left: 0, width: width * 0.8, backgroundColor: '#ffffff', zIndex: 20, elevation: 16, boxShadow: '4px 0px 10px rgba(0,0,0,0.3)' },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  drawerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 16 },
  drawerProfile: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  avatarText: { fontSize: 24, color: '#000', fontWeight: 'bold' },
  drawerEmpName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  drawerEmpRole: { fontSize: 14, color: '#555', marginTop: 4 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20 },
  drawerItemText: { fontSize: 16, color: '#000', marginLeft: 16 },
  drawerListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, marginVertical: 4, marginRight: 16, borderTopRightRadius: 24, borderBottomRightRadius: 24, position: 'relative' },
  drawerListItemActive: { backgroundColor: '#f0f7ff' },
  activePill: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 4, backgroundColor: '#1a73e8', borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  drawerListText: { fontSize: 16, color: '#4b5563', fontWeight: '500' },
  drawerListTextActive: { color: '#1a73e8', fontWeight: 'bold' },
  drawerAccordion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20, backgroundColor: '#f9f9f9', borderBottomWidth: 1, borderBottomColor: '#eee' },
  drawerAccordionText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, marginTop: 40, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  logoutText: { fontSize: 16, color: '#e63946', fontWeight: 'bold', marginLeft: 12 },

  // Modals
  modalContainer: { flex: 1, backgroundColor: '#ffffff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  modalTitle: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  modalContentCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalMockTitle: { color: '#000', fontSize: 22, fontWeight: 'bold', marginTop: 24, textAlign: 'center' },
  modalMockDesc: { color: '#555', fontSize: 15, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  modalCloseBtn: { marginTop: 40, backgroundColor: '#1a3b38', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 30 },
  modalCloseBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // HR Report Modal specific
  reportCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#122e2b', borderLeftWidth: 6, borderLeftColor: '#1a3b38' },
  reportTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a3b38', marginBottom: 6 },
  reportMeta: { fontSize: 13, color: '#555', marginBottom: 12 },
  reportDownloadBtn: { backgroundColor: '#1a3b38', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
  reportDownloadText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginLeft: 6 },

  // Punch Modal specific
  punchModalContent: { padding: 20, alignItems: 'center' },
  clockCard: { backgroundColor: '#f9f9f9', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  clockTimeText: { fontSize: 36, fontWeight: 'bold', color: '#000' },
  clockDateText: { fontSize: 14, color: '#555', marginTop: 8, textTransform: 'uppercase' },
  geofenceCard: { borderRadius: 12, padding: 16, width: '100%', marginBottom: 24, borderWidth: 1 },
  geofenceCardSuccess: { backgroundColor: '#ecfdf5', borderColor: '#10b981' },
  geofenceCardDanger: { backgroundColor: '#fef2f2', borderColor: '#ef4444' },
  geofenceTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  geofenceDetails: { fontSize: 14, color: '#000', marginTop: 4 },
  punchActionContainer: { marginVertical: 30, alignItems: 'center', justifyContent: 'center' },
  punchCircleBtn: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', elevation: 8, boxShadow: '0px 6px 8px rgba(0,0,0,0.15)' },
  punchInBtn: { backgroundColor: '#10b981' },
  punchOutBtn: { backgroundColor: '#ef4444' },
  punchDoneBtn: { backgroundColor: '#64748b' },
  disabledBtn: { opacity: 0.5 },
  punchCircleText: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginTop: 12, letterSpacing: 1 },

  // History Modal specific
  historyCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  historyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingBottom: 8 },
  historyDate: { color: '#000', fontSize: 15, fontWeight: 'bold' },

  // Form Styles
  formContainer: { backgroundColor: '#f0f7ff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#c3dafe' },
  formTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a3b38', marginBottom: 16 },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  formInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d0d5dd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#000' },
  formTextArea: { height: 90, textAlignVertical: 'top' },
  formChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  formChip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d0d5dd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  formChipActive: { backgroundColor: '#1a3b38', borderColor: '#1a3b38' },
  formChipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  formChipTextActive: { color: '#fff' },
  formSubmitBtn: { backgroundColor: '#1a3b38', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  formSubmitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Notification Styles
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  notifIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  notifTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a3b38', marginBottom: 2 },
  notifMessage: { fontSize: 12, color: '#555', lineHeight: 17 },
  notifTime: { fontSize: 11, color: '#999', marginLeft: 8 },
});
