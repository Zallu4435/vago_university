import { Course as DomainCourse, EnrollmentRequest as DomainEnrollmentRequest } from './course';
import { Course as ManagementCourse, EnrollmentRequest as ManagementEnrollmentRequest, CourseRequestDetails, StatusType } from './management/coursemanagement';

export function adaptDomainCourseToManagement(course: DomainCourse): ManagementCourse & { id: string } {
  return {
    ...course,
    id: course.id || course._id || '',
    _id: course._id || course.id || '',
  };
}

export function adaptDomainEnrollmentRequestToManagement(request: DomainEnrollmentRequest): ManagementEnrollmentRequest {
  return {
    ...request,
    id: request.id || request._id || '',
    _id: request._id || request.id || '',
  };
}

export function adaptManagementCourseToDomain(course: ManagementCourse): DomainCourse {
  return {
    ...course,
    id: course.id,
    _id: course._id,
  };
}

export function adaptManagementEnrollmentRequestToDomain(request: ManagementEnrollmentRequest): DomainEnrollmentRequest {
  return {
    ...request,
    id: request.id,
    _id: request._id,
  };
}

// Type guards
export function isDomainCourse(item: DomainCourse | DomainEnrollmentRequest): item is DomainCourse {
  return (item as DomainCourse).title !== undefined;
}

export function isDomainEnrollmentRequest(item: DomainCourse | DomainEnrollmentRequest): item is DomainEnrollmentRequest {
  return (item as DomainEnrollmentRequest).studentName !== undefined;
}

// Adapter for CourseRequestDetails modal
export function adaptToCourseRequestDetails(request: DomainEnrollmentRequest): CourseRequestDetails {
  return {
    id: request.id || request._id || '',
    status: request.status as StatusType,
    createdAt: request.requestedAt,
    updatedAt: request.lastUpdatedAt,
    reason: request.reason || '',
    additionalInfo: request.additionalNotes,
    course: {
      id: request._id || '',
      title: request.courseTitle,
      specialization: request.specialization,
      term: request.term,
      faculty: '',
      credits: 0,
    },
    user: {
      id: request.studentId,
      name: request.studentName,
      email: request.studentEmail,
    },
  };
}
