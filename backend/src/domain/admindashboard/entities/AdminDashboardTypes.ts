export interface DashboardMetrics {
  totalUsers: number;
  totalRevenue: number;
  activeCourses: number;
  pendingApprovals: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
  target: number;
}

export interface RevenueData {
  month: string;
  tuition: number;
  fees: number;
  other: number;
}

export interface PerformanceData {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
  avatar: string;
  type: 'success' | 'warning' | 'info' | 'default';
  isRead: boolean;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  isDismissed: boolean;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  userGrowth: UserGrowthData[];
  revenue: RevenueData[];
  performance: PerformanceData[];
  activities: ActivityItem[];
  alerts: SystemAlert[];
}

export interface PerformanceRawData {
  userCount: number;
  facultyCount: number;
  courseCount: number;
  admissionCount: number;
  paymentCount: number;
  enquiryCount: number;
  notificationCount: number;
  communicationCount: number;
  videoCount: number;
  sportsCount: number;
  diplomaCount: number;
  eventsCount: number;
  clubsCount: number;
  data: PerformanceData[];
}

// Repository-specific types that match actual return data
export interface CompletedPaymentsAggResult {
  _id: null;
  total: number;
}

export interface DashboardMetricsRaw {
  totalUsers: number;
  totalFaculty: number;
  totalCourses: number;
  pendingAdmissions: number;
  completedPayments: CompletedPaymentsAggResult[];
  data: DashboardMetrics;
}

export interface UserGrowthDataRaw {
  month: string;
  usersCount: number;
  facultyCount: number;
  data: UserGrowthData[];
}

export interface RevenuePaymentAggResult {
  _id: string;
  total: number;
}

export interface RevenueDataRaw {
  month: string;
  payments: RevenuePaymentAggResult[];
  data: RevenueData[];
}

export interface RecentAdmissionRaw {
  _id: string;
  status?: string;
  personal?: { fullName?: string };
  registerId?: { firstName?: string; lastName?: string; email?: string };
  createdAt?: string;
}

export interface RecentPaymentRaw {
  _id: string;
  amount?: number;
  method?: string;
  studentId?: { firstName?: string; lastName?: string; email?: string };
  createdAt?: string;
}

export interface RecentEnquiryRaw {
  _id: string;
  name?: string;
  subject?: string;
  createdAt?: string;
}

export interface RecentNotificationRaw {
  _id: string;
  title?: string;
  createdAt?: string;
}

export interface ActivityItemRaw {
  recentAdmissions: RecentAdmissionRaw[];
  recentPayments: RecentPaymentRaw[];
  recentEnquiries: RecentEnquiryRaw[];
  recentNotifications: RecentNotificationRaw[];
  data: ActivityItem[];
}

export interface SystemAlertRaw {
  pendingAdmissions: number;
  failedPayments: number;
  overdueCharges: number;
  completedPayments: number;
  data: SystemAlert[];
}

export interface DashboardDataRaw {
  metricsRaw: DashboardMetricsRaw;
  userGrowthRaw: UserGrowthDataRaw;
  revenueRaw: RevenueDataRaw;
  performanceRaw: PerformanceRawData;
  activitiesRaw: ActivityItemRaw;
  alertsRaw: SystemAlertRaw;
} 