export interface Assignment {
    _id: string;
    title: string;
    subject: string;
    dueDate: string;
    maxMarks: number;
    description: string;
    files: string[];
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'draft' | 'archived';
    totalSubmissions: number;
    averageMarks?: number;
}

export interface Submission {
    _id: string;
    id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    submittedDate: string;
    status: 'submitted' | 'graded' | 'late';
    marks: number;
    feedback: string;
    isLate: boolean;
    files: string[];
    fileName: string;
    fileSize: number;
}

export interface ReviewData {
    marks: number;
    status: 'graded' | 'late';
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