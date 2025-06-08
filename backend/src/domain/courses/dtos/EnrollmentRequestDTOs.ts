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
  
  export interface SimplifiedEnrollmentDTO {
    id: string;
    studentName: string;
    studentId: string;
    courseTitle: string;
    requestedAt: string;
    status: string;
    specialization: string;
    term: string;
  }
  
  export interface GetEnrollmentsResponseDTO extends PaginatedResponseDTO<SimplifiedEnrollmentDTO> {
    data: SimplifiedEnrollmentDTO[];
  }
  
  export interface CourseRequestDetailsDTO {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    reason: string;
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
  
  export interface GetCourseRequestDetailsResponseDTO {
    courseRequest: CourseRequestDetailsDTO;
  }