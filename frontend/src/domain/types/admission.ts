// frontend/src/domain/types/admission.ts
export interface Admission {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  program: string;
}

export interface AdmissionDetails extends Admission {
  faculty: string;
  gpa: string;
  previousEducation: string;
  nationality: string;
  documents: string[];
  personalStatement: string;
  interviewScore: string;
  applicationNotes: string;
}

export interface AdmissionApiResponse {
  admissions: Admission[];
  totalAdmissions: number;
  totalPages: number;
  currentPage: number;
}