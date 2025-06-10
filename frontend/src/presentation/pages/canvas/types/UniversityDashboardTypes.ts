export interface Course {
  id: number;
  title: string;
  progress: number;
  locked: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  rating: number;
  thumbnail?: string;
}

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  grade: string | null;
}

export interface SessionPoll {
  id: number;
  sessionId: number;
  question: string;
  options: string[];
  votes: number[];
  totalVotes: number;
  isActive: boolean;
  allowMultiple: boolean;
  userVoted: boolean;
  userVote: number | null;
  createdBy: string;
  timeRemaining?: number;
}

export interface Session {
  id: number;
  title: string;
  type: 'live' | 'upcoming' | 'completed' | 'scheduled';
  time: string;
  date: string;
  instructor: string;
  attendees: number;
  polls: SessionPoll[];
  hasActivePolls: boolean;
  thumbnail?: string;
}

export interface Material {
  id: number;
  title: string;
  subject: string;
  type: 'pdf' | 'doc' | 'img';
  uploader: string;
  size: string;
  downloads: number;
}

export interface NewPoll {
  question: string;
  options: string[];
  allowMultiple: boolean;
} 