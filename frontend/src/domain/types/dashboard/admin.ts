export interface GlassPanelProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}

export interface PerformanceMatrixProps {
    performanceData: Array<{ name: string; value: number; color: string }>;
}

export interface ActivityItem {
    id: string;
    action: string;
    user: string;
    time: string;
    avatar: string;
    type: 'success' | 'warning' | 'info' | 'default';
}

export interface RecentActivitiesProps {
    activitiesData: ActivityItem[];
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    trend: string;
    icon: React.ElementType;
    bgGradient: string;
    iconBg: string;
    trendUp: boolean;
    delay?: number;
    loading?: boolean;
}

interface Alert {
    id: string;
    title: string;
    message: string;
    type: string;
}

export interface SystemAlertsProps {
    alertsData: Alert[];
    getAlertIcon: (type: string) => React.ReactNode;
    getAlertBgColor: (type: string) => string;
    getAlertBorderColor: (type: string) => string;
    getAlertTextColor: (type: string) => string;
    getAlertSubtextColor: (type: string) => string;
    dismissAlert: (id: string) => void;
}


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
}

export interface SystemAlert {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    priority: 'low' | 'medium' | 'high';
    timestamp: string;
}

export interface DashboardData {
    metrics: DashboardMetrics;
    userGrowth: UserGrowthData[];
    revenue: RevenueData[];
    performance: PerformanceData[];
    activities: ActivityItem[];
    alerts: SystemAlert[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}