import { IEnrollmentDocument } from "./coursetypes";

// Type for populated enrollment with student and course details
export interface PopulatedEnrollment extends Omit<IEnrollmentDocument, 'studentId' | 'courseId'> {
  studentId: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  courseId: {
    _id: string;
    title: string;
    specialization: string;
    term: string;
    faculty: string;
    credits: number;
  };
}

export class SimplifiedEnrollment {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly courseId: string,
    public readonly status: string,
    public readonly requestedAt: string,
    public readonly studentName: string,
    public readonly courseTitle: string,
    public readonly specialization: string,
    public readonly term: string
  ) {}

  static create(params: {
    id: string;
    studentId: string;
    courseId: string;
    status: string;
    requestedAt: string;
    studentName: string;
    courseTitle: string;
    specialization: string;
    term: string;
  }): SimplifiedEnrollment {
    return new SimplifiedEnrollment(
      params.id,
      params.studentId,
      params.courseId,
      params.status,
      params.requestedAt,
      params.studentName,
      params.courseTitle,
      params.specialization,
      params.term
    );
  }
}

// Updated to match repository return structure
export type GetEnrollmentsResponse = {
  enrollments: PopulatedEnrollment[];
  totalItems: number;
  page: number;
  limit: number;
};

export class CourseRequestDetailsCourse {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly specialization: string,
    public readonly term: string,
    public readonly faculty: string,
    public readonly credits: number
  ) {}

  static create(params: {
    id: string;
    title: string;
    specialization: string;
    term: string;
    faculty: string;
    credits: number;
  }): CourseRequestDetailsCourse {
    return new CourseRequestDetailsCourse(
      params.id,
      params.title,
      params.specialization,
      params.term,
      params.faculty,
      params.credits
    );
  }
}

export class CourseRequestDetailsUser {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}

  static create(params: {
    id: string;
    name: string;
    email: string;
  }): CourseRequestDetailsUser {
    return new CourseRequestDetailsUser(
      params.id,
      params.name,
      params.email
    );
  }
}

export class CourseRequestDetails {
  constructor(
    public readonly id: string,
    public readonly status: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly reason: string,
    public readonly course: CourseRequestDetailsCourse,
    public readonly user?: CourseRequestDetailsUser
  ) {}

  static create(params: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    reason: string;
    course: CourseRequestDetailsCourse;
    user?: CourseRequestDetailsUser;
  }): CourseRequestDetails {
    return new CourseRequestDetails(
      params.id,
      params.status,
      params.createdAt,
      params.updatedAt,
      params.reason,
      params.course,
      params.user
    );
  }
}

// Updated to match repository return structure
export type GetCourseRequestDetailsResponse = PopulatedEnrollment | null; 