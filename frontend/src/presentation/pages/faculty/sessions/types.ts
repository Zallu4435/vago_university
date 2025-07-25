export interface Session {
  id: number;
  title: string;
  instructor: string;
  course: string;
  date: string; // ISO date string (e.g., "2025-06-15")
  time: string; // Time string (e.g., "14:00")
  duration: string; // Duration in hours (e.g., "2")
  maxAttendees: number;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'upcoming' | 'live' | 'completed';
  isLive: boolean;
  hasRecording: boolean;
  recordingUrl?: string;
  attendees: number;
  attendeeList?: { id: string; name: string }[];
  startTime?: string;
}

export interface NewSession {
  title: string;
  instructor: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  maxAttendees: string;
  description: string;
  tags: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
