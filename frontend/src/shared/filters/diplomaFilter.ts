import { Diploma, Enrollment } from '../../domain/types/management/diplomamanagement';

export function filterDiplomas(diplomas: Diploma[], searchTerm: string): Diploma[] {
  return diplomas.filter((diploma) =>
    diploma.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export function filterEnrollments(enrollments: Enrollment[], searchTerm: string): Enrollment[] {
  return enrollments.filter((enrollment) =>
    enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
} 