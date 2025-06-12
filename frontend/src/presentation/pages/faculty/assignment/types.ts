export interface Assignment {
    id: number;
    title: string;
    subject: string;
    dueDate: string;
    maxMarks: number;
    description: string;
    totalStudents: number;
    submitted: number;
    reviewed: number;
    late: number;
    status: 'active' | 'inactive';
    createdDate: string;
  }
  
  export interface Submission {
    id: number;
    assignmentId: number;
    studentId: string;
    studentName: string;
    submittedDate: string;
    status: 'reviewed' | 'pending' | 'needs_correction';
    marks: number | null;
    feedback: string;
    isLate: boolean;
    files: string[];
    fileName: string;
    fileSize: string;
  }
  
  export interface ReviewData {
    marks: number;
    status: 'reviewed' | 'pending' | 'needs_correction';
    feedback: string;
  }
  
  export interface NewAssignment {
    title: string;
    subject: string;
    dueDate: string;
    maxMarks: string;
    description: string;
    files: string[];
  }