export class GetCoursesRequest {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly specialization?: string,
    public readonly faculty?: string,
    public readonly term?: string,
    public readonly search?: string
  ) {
    if (page < 1) throw new Error('Page must be greater than 0');
    if (limit < 1) throw new Error('Limit must be greater than 0');
  }

  static create(params: {
    page: number;
    limit: number;
    specialization?: string;
    faculty?: string;
    term?: string;
    search?: string;
  }): GetCoursesRequest {
    return new GetCoursesRequest(
      params.page,
      params.limit,
      params.specialization,
      params.faculty,
      params.term,
      params.search
    );
  }
}

export class CreateCourseRequest {
  constructor(
    public readonly title: string,
    public readonly specialization: string,
    public readonly faculty: string,
    public readonly credits: number,
    public readonly schedule: string,
    public readonly maxEnrollment: number,
    public readonly currentEnrollment?: number,
    public readonly description?: string,
    public readonly term?: string,
    public readonly prerequisites?: string[]
  ) {
    if (!title || title.length < 3) throw new Error('Title must be at least 3 characters long');
    if (!specialization) throw new Error('Specialization is required');
    if (!faculty) throw new Error('Faculty is required');
    if (credits < 0) throw new Error('Credits must be non-negative');
    if (maxEnrollment < 1) throw new Error('Max enrollment must be at least 1');
  }

  static create(params: {
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
  }): CreateCourseRequest {
    return new CreateCourseRequest(
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

export class UpdateCourseRequest {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly specialization?: string,
    public readonly faculty?: string,
    public readonly credits?: number,
    public readonly schedule?: string,
    public readonly maxEnrollment?: number,
    public readonly currentEnrollment?: number,
    public readonly description?: string,
    public readonly term?: string,
    public readonly prerequisites?: string[]
  ) {
    if (!id) throw new Error('Course ID is required');
    if (title && title.length < 3) throw new Error('Title must be at least 3 characters long');
    if (credits !== undefined && credits < 0) throw new Error('Credits must be non-negative');
    if (maxEnrollment !== undefined && maxEnrollment < 1) throw new Error('Max enrollment must be at least 1');
  }

  static create(params: {
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
  }): UpdateCourseRequest {
    return new UpdateCourseRequest(
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

export class DeleteCourseRequest {
  constructor(
    public readonly id: string
  ) {
    if (!id) throw new Error('Course ID is required');
  }

  static create(params: { id: string }): DeleteCourseRequest {
    return new DeleteCourseRequest(params.id);
  }
} 

export interface CourseFilter {
  title?: string | { $regex: string; $options: string };
  specialization?: string | { $regex: string; $options: string };
  faculty?: string | { $regex: string; $options: string };
  term?: string | { $regex: string; $options: string };
  status?: string | { $regex: string; $options: string };
  courseId?: string | { $in: string[] };
  studentId?: string | { $in: string[] };
  createdAt?: { $gte?: Date; $lte?: Date };
  updatedAt?: { $gte?: Date; $lte?: Date };
  $or?: Array<{
    title?: { $regex: string; $options: string };
    specialization?: { $regex: string; $options: string };
    faculty?: { $regex: string; $options: string };
    term?: { $regex: string; $options: string };
    courseId?: { $in: string[] };
    studentId?: { $in: string[] };
  }>;
  [key: string]: unknown;
}
