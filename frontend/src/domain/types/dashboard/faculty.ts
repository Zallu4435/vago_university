export interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: number;
    icon: React.ComponentType<{ className?: string }>;
    color?: 'blue' | 'green' | 'orange' | 'red';
}

export interface ChartCardProps {
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    color?: 'blue' | 'green' | 'orange' | 'red';
}

export interface InfoCardProps {
    title: React.ReactNode;
    children: React.ReactNode;
    expandable?: boolean;
}

export interface StatusCardProps {
    title: string;
    status: 'success' | 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
}

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
}

export interface Activity {
    action: string;
    course: string;
    time: string;
}

export interface RecentActivitiesProps {
    activities: Activity[];
}

export interface Stat {
    title: string;
    value: number;
    icon: React.ReactNode;
}

export interface StatsSectionProps {
    stats: Stat[];
}

export interface DashboardStats {
    totalSessions: number;
    totalAssignments: number;
    totalAttendance: number;
}

export interface WeeklyAttendanceData {
    day: string;
    attendance: number;
}

export interface AssignmentPerformanceData {
    assignment: string;
    score: number;
    submissions: number;
}

export interface SessionDistributionData {
    name: string;
    value: number;
    color: string;
}

export interface RecentActivity {
    id: string;
    type: 'attendance' | 'assignment' | 'announcement' | 'system';
    message: string;
    time: string;
}

export interface FacultyDashboardData {
    stats: DashboardStats;
    weeklyAttendance: WeeklyAttendanceData[];
    assignmentPerformance: AssignmentPerformanceData[];
    sessionDistribution: SessionDistributionData[];
    recentActivities: RecentActivity[];
}