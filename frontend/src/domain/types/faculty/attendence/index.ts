export interface AttendanceInterval {
    joinedAt: string;
    leftAt?: string;
  }
  
  export interface AttendanceUser {
    id: number;
    username: string;
    email: string;
    intervals: AttendanceInterval[];
    status?: string;
    attendancePercentage?: number;
  }
  
  export interface StudentAttendanceData {
    studentId: string;
    studentName: string;
    studentEmail: string;
    totalSessions: number;
    totalTimeSpent: number;
    averageAttendance: number;
    approvedSessions: number;
    declinedSessions: number;
    pendingSessions: number;
    sessionDetails: Array<{
      sessionId: string;
      sessionTitle: string;
      sessionDate: string;
      timeSpent: number;
      attendancePercentage: number;
      status: string;
      intervals: AttendanceInterval[];
    }>;
  }
  
  export interface Session {
    _id?: string;
    id?: string | number;
    title: string;
    name?: string;
    hostId?: string;
    status?: string;
    startTime: string;
    endTime?: string;
    description?: string;
    instructor?: string;
    course?: string;
    duration?: number | string;
    maxAttendees?: number;
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    isLive?: boolean;
    hasRecording?: boolean;
    recordingUrl?: string;
    attendees?: number;
    date?: string;
    time?: string;
    attendeeList?: AttendanceUser[];
  }
  export interface AttendanceInterval {
    joinedAt: string;
    leftAt?: string;
  }
  
  export interface SessionAttendanceViewModalProps {
    selectedUser: AttendanceUser | null;
    currentSession: Session | undefined;
    attendanceDecisions: Map<string, string>;
    closeIntervalModal: () => void;
    formatDuration: (ms: number) => string;
    calculateTotalTime: (intervals: AttendanceInterval[], sessionEndTime?: string) => number;
    formatTime: (timestamp: string) => string;
    getAttendanceRecommendation: (percentage: number) => string;
  }
  
  export interface SessionDetailsModalProps {
    session: any;
    onClose: () => void;
  }
  