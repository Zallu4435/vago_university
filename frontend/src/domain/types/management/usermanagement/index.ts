export type User = {
  _id: string;
  fullName: string;
  email: string;
  program: string;
  status: string;
  createdAt: string;
  blocked: boolean;
};

export interface ApplicantDetailsProps {
  selectedApplicant: any;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  approveAdmission: (data: any) => void;
  rejectAdmission: (data: { id: string; reason: string }) => void;
  deleteAdmission?: (id: string) => void;
  onViewDocument?: (document: { name: string; url: string }) => void;
  onDownloadDocument?: (document: { name: string; url: string }) => void;
}

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (data: any) => void;
  applicantName: string;
}

// Added based on usage in user.service.ts and typical admission data
export interface AdmissionDetails {
  id: string;
  fullName: string;
  email: string;
  program: string;
  status: string;
  createdAt: string;
  documents?: Array<{ name: string; url: string }>;
  [key: string]: any;
}

export interface AdmissionApiResponse {
  admissions: AdmissionDetails[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
} 