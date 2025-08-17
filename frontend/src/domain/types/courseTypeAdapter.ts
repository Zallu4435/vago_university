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
export function adaptToCourseRequestDetails(request: any): CourseRequestDetails {
  // Handle the backend response structure: { data: { courseRequest: {...} } }
  if (request && typeof request === 'object') {
    // If request has courseRequest property (backend response)
    if ('courseRequest' in request) {
      const courseRequest = request.courseRequest;
      return {
        id: courseRequest.id || '',
        status: courseRequest.status as StatusType,
        createdAt: courseRequest.createdAt || '',
        updatedAt: courseRequest.updatedAt || '',
        reason: courseRequest.reason || '',
        additionalInfo: courseRequest.additionalInfo,
        course: {
          id: courseRequest.course?.id || '',
          title: courseRequest.course?.title || '',
          specialization: courseRequest.course?.specialization || '',
          term: courseRequest.course?.term || '',
          faculty: courseRequest.course?.faculty || '',
          credits: courseRequest.course?.credits || 0,
        },
        user: courseRequest.user ? {
          id: courseRequest.user.id || '',
          name: courseRequest.user.name || '',
          email: courseRequest.user.email || '',
        } : undefined,
      };
    }
    
    // If request is already the courseRequest object
    if ('course' in request && 'user' in request) {
      return {
        id: request.id || '',
        status: request.status as StatusType,
        createdAt: request.createdAt || '',
        updatedAt: request.updatedAt || '',
        reason: request.reason || '',
        additionalInfo: request.additionalInfo,
        course: {
          id: request.course?.id || '',
          title: request.course?.title || '',
          specialization: request.course?.specialization || '',
          term: request.course?.term || '',
          faculty: request.course?.faculty || '',
          credits: request.course?.credits || 0,
        },
        user: request.user ? {
          id: request.user.id || '',
          name: request.user.name || '',
          email: request.user.email || '',
        } : undefined,
      };
    }
  }
  
  // Fallback for old structure (DomainEnrollmentRequest)
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
