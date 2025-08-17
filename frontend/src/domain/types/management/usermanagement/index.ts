export type User = {
  _id: string;
  fullName: string;
  email: string;
  program: string;
  status: string;
  createdAt: string;
  blocked: boolean;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
};

export interface ApplicantDetailsProps {
  selectedApplicant: any;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  approveAdmission: (data: unknown) => void;
  rejectAdmission: (data: { id: string; reason: string }) => void;
  deleteAdmission?: (id: string) => void;
  onViewDocument?: (document: { name: string; url: string }) => void;
  onDownloadDocument?: (document: { name: string; url: string }) => void;
  expandedSections: {
    personal: boolean;
    programs: boolean;
    education: boolean;
    achievements: boolean;
    otherInfo: boolean;
    documents: boolean;
    declaration: boolean;
    application: boolean;
  };
  toggleSection: (section: "personal" | "programs" | "education" | "achievements" | "otherInfo" | "documents" | "declaration" | "application") => void;
  formatDate: (dateString: string) => string;
}

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (data: unknown) => void;
  onReject: (data: unknown) => void;
  onDelete: () => void;
  applicantName: string;
}

// Added based on usage in user.service.ts and typical admission data
export interface AdmissionDetails {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  program: string;
  status: string;
  createdAt: string;
  blocked: boolean;
  documents?: Array<{ name: string; url: string }>;
  [key: string]: unknown;
}

export interface AdmissionApiResponse {
  data: {
    admissions: AdmissionDetails[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export interface AdmissionDetailsResponse {
  data: {
    admission: AdmissionDetails;
  };
}

export interface Filters {
  status: string;
  program: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
