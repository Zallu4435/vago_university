export interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: Date;
  urgency: 'urgent' | 'normal';
  status: 'pending' | 'submitted' | 'graded';
  description: string;
  hasFile: boolean;
  submittedFile: string | null;
  submittedAt?: Date;
  grade: { score: number; total: number; feedback: string } | null;
  isLate?: boolean;
  priority: number;
  estimatedTime: string;
  completionRate?: number;
}

export interface SelectedFile {
  [key: number]: File;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'dueDate' | 'priority' | 'status' | 'course';
export type FilterStatus = 'all' | 'pending' | 'submitted' | 'graded'; 