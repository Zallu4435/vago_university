export interface Faculty {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  experience: string;
  cv: string;
  certificates: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  blocked?: boolean;
}

export interface FacultyApprovalData {
  department: string;
  role: string;
  startDate: string;
  additionalNotes?: string;
}

export interface FacultyFilters {
  status: string;
  department: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface FacultyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: Faculty;
  onBlockToggle?: (facultyId: string, blocked: boolean) => void;
} 

export interface FacultyApiResponse {
  faculty: Faculty[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}