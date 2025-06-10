export interface Session {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  course: string;
  date: string;
  time: string;
  duration: number;
  status: 'live' | 'upcoming' | 'completed';
  hasRecording: boolean;
  attendees: number;
  maxAttendees: number;
  description: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isLive: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | null;
}

export interface UserAccess {
  isEnrolled: boolean;
  watchedSessions: string[];
  likedSessions: string[];
  userName: string;
  userRole: string;
}

export interface Filters {
  status: 'all' | 'live' | 'upcoming' | 'completed';
  instructor: string;
  dateRange: string;
}

export interface SessionStats {
  liveCount: number;
  upcomingCount: number;
  completedCount: number;
  watchedCount: number;
}

export interface SessionCardProps {
  session: Session;
  index: number;
  userAccess: UserAccess;
  styles: any;
  onToggleWatched: (sessionId: string) => void;
  onToggleLike: (sessionId: string) => void;
}

export interface SessionFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
  uniqueInstructors: string[];
  userAccess: UserAccess;
  onToggleEnrollment: (isEnrolled: boolean) => void;
  styles: any;
}

export interface SessionHeaderProps {
  userName: string;
  currentTime: Date;
  isEnrolled: boolean;
  sessionCount: number;
  styles: any;
}

export interface SessionStatsProps {
  stats: SessionStats;
  styles: any;
} 