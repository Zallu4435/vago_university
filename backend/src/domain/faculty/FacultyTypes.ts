// FacultyTypes.ts - matches AuthTypes.ts style

export type FacultyStatus = "pending" | "approved" | "rejected" | "offered";
export type FacultyRejectedBy = "admin" | "user" | null;

export interface FacultyBase {
  id?: string;
  createdAt?: Date;
}

export interface FacultyProps extends FacultyBase {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  experience: string;
  aboutMe: string;
  cvUrl?: string;
  certificatesUrl?: string[];
}

export interface IFacultyRegister extends FacultyProps {
  password: string;
  status: FacultyStatus;
  rejectedBy: FacultyRejectedBy;
  confirmationToken: string | null;
  tokenExpiry: Date | null;
  blocked?: boolean;
}

export interface IFaculty extends FacultyProps {
  status: FacultyStatus;
  rejectedBy?: FacultyRejectedBy;
  confirmationToken?: string | null;
  tokenExpiry?: Date | null;
} 