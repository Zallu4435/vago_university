export interface GetCoursesRequestDTO {
    page: number;
    limit: number;
    specialization?: string;
    faculty?: string;
    term?: string;
    search?: string;
  }
  
  export interface GetCourseByIdRequestDTO {
    id: string;
  }
  
  export interface CreateCourseRequestDTO {
    title: string;
    specialization: string;
    faculty: string;
    credits: number;
    schedule: string;
    maxEnrollment: number;
    currentEnrollment?: number;
    description?: string;
    term?: string;
    prerequisites?: string[];
  }
  
  export interface UpdateCourseRequestDTO {
    id: string;
    title?: string;
    specialization?: string;
    faculty?: string;
    credits?: number;
    schedule?: string;
    maxEnrollment?: number;
    currentEnrollment?: number;
    description?: string;
    term?: string;
    prerequisites?: string[];
  }
  
  export interface DeleteCourseRequestDTO {
    id: string;
  }