import { IconType } from 'react-icons';

export interface Course {
  id?: string;
  _id?: string;
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  prerequisites?: string[];
  term: string;
}

export interface EnrollmentRequest {
  id?: string;
  _id?: string;
  studentName: string;
  courseTitle: string;
  requestedAt: string;
  status: string;
  specialization: string;
  term: string;
  studentId: string;
  studentEmail: string;
  studentPhone?: string;
  reason?: string;
  previousCourses?: {
    courseId: string;
    courseName: string;
    grade: string;
    term: string;
  }[];
  academicStanding?: {
    gpa: number;
    creditsCompleted: number;
    standing: 'Good' | 'Warning' | 'Probation';
  };
  additionalNotes?: string;
  lastUpdatedAt: string;
  updatedBy?: string;
}

export interface CourseDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    specialization: string;
    faculty: string;
    credits: number;
    schedule: string;
    maxEnrollment: number;
    currentEnrollment: number;
    description?: string;
    prerequisites?: string[];
    term?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  isLoading?: boolean;
}

export type StatusType = 'pending' | 'approved' | 'rejected';

export interface CourseRequestDetails {
  id: string;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  reason: string;
  additionalInfo?: string;
  course: {
    id: string;
    title: string;
    specialization: string;
    term: string;
    faculty: string;
    credits: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface StatusBadgeProps {
  status: StatusType;
}

export interface CourseApiResponse {
  data: {
    courses: Course[];
  };
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface CourseApiWrapper {
  data: CourseApiResponse;
}

export interface CourseDetails {
  id: string;
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  prerequisites?: string[];
  term?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseDetailsResponse {
  data: {
    course: CourseDetails;
  };
}

export interface EnrollmentRequestsResponse {
  data: {
    data: EnrollmentRequest[];
    totalPages: number;
  };
}

export interface EnrollmentRequestDetailsResponse {
  data: {
    courseRequest: EnrollmentRequest;
  };
}

export interface InfoCardProps {
  icon: React.ReactNode | IconType;
  label: string;
  value: string | number;
}

export interface CourseRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: CourseRequestDetails | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
  initialData?: unknown;
  isEditing?: boolean;
  specializations: string[];
  faculties: string[];
  terms: string[];
}

export interface Filters {
  specialization: string;
  faculty: string;
  term: string;
}

export interface RequestFilters {
  status: string;
  specialization: string;
  term: string;
}