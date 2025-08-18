export interface Assignment {
  id?: string;
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  maxMarks: number;
  description: string;
  files: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }> | string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'closed';
  totalSubmissions: number;
  averageMarks?: number;
  submissionCount?: number;
  averageMark?: number;
}

export interface Submission {
  _id: string;
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedDate: string;
  status: 'pending' | 'reviewed' | 'late' | 'needs_correction';
  marks: number;
  feedback: string;
  isLate: boolean;
  files: string[] | Array<{ fileName: string; fileUrl: string; fileSize: number }>;
  fileName: string;
  fileSize: number;
}

export interface ReviewData {
  marks: number;
  status: 'pending' | 'reviewed' | 'needs_correction';
  feedback: string;
}

export interface NewAssignment {
  title: string;
  subject: string;
  dueDate: string;
  maxMarks: string;
  description: string;
  files: File[];
}

export interface Analytics {
  totalAssignments: number;
  totalSubmissions: number;
  averageMarks: number;
  submissionStatus: {
    pending: number;
    reviewed: number;
    needs_correction: number;
    late: number;
  };
  lateSubmissions: number;
  submissionsByDate: {
    date: string;
    count: number;
  }[];
  marksDistribution: {
    range: string;
    count: number;
  }[];
} 