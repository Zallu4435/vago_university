// src/domain/types/course.ts
export interface Course {
    _id: string;
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
    joined?: boolean;
  }
  
  export interface CourseDetails extends Course {
    enrolledStudents?: {
      id: string;
      name: string;
      email: string;
      enrollmentDate: string;
    }[];
    facultyDetails?: {
      name: string;
      email: string;
      office: string;
    };
    scheduleDetails?: {
      days: string[];
      time: string;
      location: string;
    };
  }
  
  export interface EnrolledStudent {
    id: string;
    name: string;
    status: 'Enrolled' | 'Completed' | 'Dropped';
    term: string;
    grade?: string;
  }
  
  export interface EnrollmentRequest {
    _id: string;
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
  
  export interface CourseApiResponse {
    data: Course[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
  }

  export interface CourseApiWrapper {
    data: CourseApiResponse;
  }

export interface RequestFilters {
  status: string;
  specialization: string;
  term: string;
}

export interface CourseDetailsResponse {
  data: CourseDetails;
}

export interface EnrollmentRequestsResponse {
  data: {
    requests: EnrollmentRequest[];
    totalPages: number;
  };
}

export interface EnrollmentRequestDetailsResponse {
  data: EnrollmentRequest;
}