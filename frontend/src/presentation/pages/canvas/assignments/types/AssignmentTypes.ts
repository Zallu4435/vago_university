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
}

export interface SelectedFile {
  [key: string]: File;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'dueDate' | 'priority' | 'status' | 'course';
export type FilterStatus = 'all' | 'draft' | 'published' | 'submitted' | 'graded'; 