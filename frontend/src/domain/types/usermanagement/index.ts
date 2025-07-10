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