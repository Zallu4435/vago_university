// src/domain/types/course.ts
export interface Course {
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
  }
  
  export interface CourseDetails extends Course {
    enrolledStudents: EnrolledStudent[];
    enrollmentRequests: EnrollmentRequest[];
  }
  
  export interface EnrolledStudent {
    id: string;
    name: string;
    status: 'Enrolled' | 'Completed' | 'Dropped';
    term: string;
    grade?: string;
  }
  
  export interface EnrollmentRequest {
    id: string;
    studentName: string;
    studentId: string;
    courseTitle: string;
    term: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedAt: string;
    reason?: string;
  }
  
  export interface CourseApiResponse {
    courses: Course[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }