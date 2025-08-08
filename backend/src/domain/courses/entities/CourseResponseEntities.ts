import { ICourseDocument } from "./coursetypes";

export class CourseSummary {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly specialization: string,
    public readonly faculty: string,
    public readonly term: string,
    public readonly credits: number
  ) {}

  static create(params: {
    id: string;
    title: string;
    specialization: string;
    faculty: string;
    term: string;
    credits: number;
  }): CourseSummary {
    return new CourseSummary(
      params.id,
      params.title,
      params.specialization,
      params.faculty,
      params.term,
      params.credits
    );
  }
}

export class CourseDetails {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly specialization: string,
    public readonly faculty: string,
    public readonly credits: number,
    public readonly schedule: string,
    public readonly maxEnrollment: number,
    public readonly currentEnrollment: number,
    public readonly description?: string,
    public readonly term?: string,
    public readonly prerequisites?: string[]
  ) {}

  static create(params: {
    id: string;
    title: string;
    specialization: string;
    faculty: string;
    credits: number;
    schedule: string;
    maxEnrollment: number;
    currentEnrollment: number;
    description?: string;
    term?: string;
    prerequisites?: string[];
  }): CourseDetails {
    return new CourseDetails(
      params.id,
      params.title,
      params.specialization,
      params.faculty,
      params.credits,
      params.schedule,
      params.maxEnrollment,
      params.currentEnrollment,
      params.description,
      params.term,
      params.prerequisites
    );
  }
}

export class PaginatedResponse<T> {
  constructor(
    public readonly data: T[],
    public readonly totalItems: number,
    public readonly totalPages: number,
    public readonly currentPage: number
  ) {}

  static create<T>(params: {
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }): PaginatedResponse<T> {
    return new PaginatedResponse(
      params.data,
      params.totalItems,
      params.totalPages,
      params.currentPage
    );
  }
}

// Updated to match repository return structure
export type GetCoursesResponse = {
  courses: Pick<ICourseDocument, '_id' | 'title' | 'specialization' | 'faculty' | 'term' | 'credits'>[];
  totalItems: number;
  page: number;
  limit: number;
};

// Updated to match repository return structure
export type GetCourseByIdResponse = ICourseDocument | null;

// Updated to match repository return structure
export type CreateCourseResponse = ICourseDocument;

// Updated to match repository return structure
export type UpdateCourseResponse = ICourseDocument | null; 