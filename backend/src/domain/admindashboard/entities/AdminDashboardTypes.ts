// AdminDashboardTypes.ts

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
  financialAidCount: number;
  videoCount: number;
  sportsCount: number;
  diplomaCount: number;
  eventsCount: number;
  clubsCount: number;
} 