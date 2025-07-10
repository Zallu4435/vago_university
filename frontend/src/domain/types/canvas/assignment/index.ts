export interface Submission {
    id: string;
    studentId: string;
    studentName: string;
    assignmentId: string;
    files: Array<{
        fileName: string;
        fileUrl: string;
        fileSize: number;
    }>;
    submittedDate: string;
    status: 'pending' | 'reviewed' | 'late' | 'needs_correction';
    marks?: number;
    feedback?: string;
    isLate: boolean;
}

export interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    maxMarks: number;
    description: string;
    files: Array<{
        fileName: string;
        fileUrl: string;
        fileSize: number;
        _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'published' | 'submitted' | 'graded';
    totalSubmissions: number;
    averageMarks?: number;
    submission?: Submission | null;
}

export interface SelectedFile {
    [key: string]: File;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'dueDate' | 'priority' | 'status' | 'course';
export type FilterStatus = 'all' | 'draft' | 'published' | 'submitted' | 'graded' | 'needs_correction';

export interface AssignmentCardProps {
    assignment: Assignment;
    styles: any;
    onUpload: (assignment: Assignment) => void;
    onViewGrade: (assignment: Assignment) => void;
}

export interface GradeModalProps {
    assignment: Assignment;
    onClose: () => void;
}

export interface UploadModalProps {
    assignment: Assignment;
    styles: any;
    selectedFile: File | null;
    onClose: () => void;
    onFileSelect: (file: File) => void;
    onSubmit: () => void;
}
