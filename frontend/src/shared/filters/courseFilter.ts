import { Course, EnrollmentRequest } from '../../domain/types/coursemanagement';

export function filterCourses(courses: Course[], searchTerm: string): Course[] {
  return courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export function filterEnrollmentRequests(requests: EnrollmentRequest[], searchTerm: string): EnrollmentRequest[] {
  return requests.filter((request) =>
    request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
} 