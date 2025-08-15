import { EnrollmentProps, EnrollmentStatus, CourseProps } from '../entities/coursetypes';

export interface GetEnrollmentsRequestDTO {
  page: number;
  limit: number;
  status?: string;
  specialization?: string;
  term?: string;
}

export interface ApproveEnrollmentRequestDTO {
  enrollmentId: string;
}

export interface RejectEnrollmentRequestDTO {
  enrollmentId: string;
}

export interface GetCourseRequestDetailsRequestDTO {
  id: string;
}

interface PaginatedResponseDTO<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export type SimplifiedEnrollmentDTO = Pick<EnrollmentProps, 'id' | 'studentId' | 'courseId' | 'status' | 'requestedAt'> & {
  studentName: string;
  courseTitle: string;
  specialization: string;
  term: string;
};

export interface GetEnrollmentsResponseDTO extends PaginatedResponseDTO<SimplifiedEnrollmentDTO> {
  data: SimplifiedEnrollmentDTO[];
}

export type CourseRequestDetailsCourseDTO = Pick<CourseProps, 'id' | 'title' | 'specialization' | 'term' | 'faculty' | 'credits'>;

export interface CourseRequestDetailsDTO {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  reason: string;
  course: CourseRequestDetailsCourseDTO;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface GetCourseRequestDetailsResponseDTO {
  courseRequest: CourseRequestDetailsDTO;
}