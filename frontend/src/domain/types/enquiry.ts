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
  CLOSED = 'closed'
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