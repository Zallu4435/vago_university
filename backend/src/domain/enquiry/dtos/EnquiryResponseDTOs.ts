import { Enquiry } from "../entities/Enquiry";

export interface CreateEnquiryResponseDTO {
  enquiry: Enquiry;
}

export interface GetEnquiriesResponseDTO {
  enquiries: Enquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetEnquiryByIdResponseDTO {
  enquiry: Enquiry;
}

export interface UpdateEnquiryStatusResponseDTO {
  enquiry: Enquiry;
}

export interface DeleteEnquiryResponseDTO {
  success: boolean;
  message: string;
}

export interface SendEnquiryReplyResponseDTO {
  success: boolean;
  message: string;
} 