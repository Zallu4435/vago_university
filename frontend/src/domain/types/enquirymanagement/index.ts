export interface Enquiry {
  id: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export enum EnquiryStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export interface EnquiryApiResponse {
  enquiries: Enquiry[];
  totalPages: number;
  page: number;
  limit: number;
  total: number;
}

export interface CreateEnquiryData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EnquiryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: Enquiry | null;
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
}

export interface ReplyModalProps {
  enquiry: Enquiry;
  onClose: () => void;
  onSend: (enquiryId: string, replyMessage: string) => Promise<void>;
}

// Add more enquiry management related types/interfaces here as needed 