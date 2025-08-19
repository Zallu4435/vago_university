export interface Announcement {
    title: string;
    date: string;
}

export interface AnnouncementsProps {
    announcements: Announcement[];
}

export interface CalendarDayEntry {
    type: string;
    title: string;
    date: string;
}

export interface CalendarProps {
    calendarDays: Record<number, CalendarDayEntry[]>;
}

export interface LegendProps {
    color: string;
    label: string;
    styles: {
        card: {
            background: string;
            border: string;
        };
        textSecondary: string;
    };
}

export interface Deadline {
    title: string;
    date: string;
    urgent?: boolean;
}

export interface DeadlinesProps {
    deadlines: Deadline[];
}

export interface EventItem {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
}

export interface NewEventsProps {
    events?: EventItem[];
}

export interface Class {
    id: string;
    title: string;
    faculty: string;
    schedule: string;
    cousre: string;
    description: string;
}

export interface ScheduledClassesProps {
    classes: Class[];
}

export interface StudentInfo {
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    course?: string;
    profilePicture?: string;
}

export type StudentDashboardData = {
    announcements: Announcement[];
    deadlines: Deadline[];
    classes: ClassInfo[];
    newEvents: NewEvent[];
    calendarDays?: Record<number, CalendarDayEntry[]>;
    isLoading?: boolean;
    isLoadingAnnouncements?: boolean;
    isLoadingDeadlines?: boolean;
    isLoadingClasses?: boolean;
    isLoadingNewEvents?: boolean;
    isLoadingCalendarDays?: boolean;
    hasError?: boolean;
    dashboardError?: unknown;
    announcementsError?: unknown;
    deadlinesError?: unknown;
    classesError?: unknown;
    newEventsError?: unknown;
    calendarDaysError?: unknown;
    refetchDashboard?: () => Promise<void>;
    refetchAnnouncements?: () => Promise<void>;
    refetchDeadlines?: () => Promise<void>;
    refetchClasses?: () => Promise<void>;
    refetchNewEvents?: () => Promise<void>;
    refetchCalendarDays?: () => Promise<void>;
};

export interface Deadline {
    title: string;
    date: string;
    urgent?: boolean;
}

export interface ClassInfo {
    id: string;
    title: string;
    faculty: string;
    schedule: string;
    cousre: string;
    description: string;
}

export interface OnlineTopic {
    title: string;
    votes: number;
    voted: boolean;
}

export interface NewEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
}

export interface CalendarDayEntry {
    type: string;
    title: string;
    date: string;
}
