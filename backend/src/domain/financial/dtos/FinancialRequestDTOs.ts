import { ChargeProps, PaymentProps } from "../financialtypes";

export interface DocumentDTO {
    id: string;
    name: string;
    url: string;
    status: "Verified" | "Pending" | "Rejected";
  }
  
  export interface GetStudentFinancialInfoRequestDTO {
    studentId: string;
  }
  
  export interface GetAllPaymentsRequestDTO {
    startDate?: string;
    endDate?: string;
    status?: string;
    page: number;
    limit: number;
  }
  
  export interface GetOnePaymentRequestDTO {
    paymentId: string;
  }
  
  export type MakePaymentRequestDTO = Pick<PaymentProps, "studentId" | "amount" | "method"> & {
    term: string;
    chargeId: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
  };
  
  export interface GetFinancialAidApplicationsRequestDTO {
    studentId: string;
    status?: "Approved" | "Pending" | "Rejected";
  }
  
  export interface GetAllFinancialAidApplicationsRequestDTO {
    status?: string;
    term?: string;
    page: number;
    limit: number;
  }
  
  export interface ApplyForFinancialAidRequestDTO {
    studentId: string;
    term: string;
    amount: number;
    type: "Grant" | "Loan" | "Scholarship";
    documents: Array<{ name: string; url: string }>;
  }
  
  export interface GetAvailableScholarshipsRequestDTO {
    status?: "Open" | "Closed";
    term?: string;
  }
  
  export interface GetScholarshipApplicationsRequestDTO {
    studentId: string;
    status?: "Approved" | "Pending" | "Rejected";
  }
  
  export interface GetAllScholarshipApplicationsRequestDTO {
    status?: string;
    page: number;
    limit: number;
  }
  
  export interface ApplyForScholarshipRequestDTO {
    studentId: string;
    scholarshipId: string;
    documents: Array<{ name: string; url: string }>;
  }
  
  export interface UploadDocumentRequestDTO {
    file: Express.Multer.File;
    type: "financial-aid" | "scholarship";
  }
  
  export interface GetPaymentReceiptRequestDTO {
    studentId: string;
    paymentId: string;
  }
  
  export interface UpdateFinancialAidApplicationRequestDTO {
    studentId: string;
    applicationId: string;
    status?: "Approved" | "Pending" | "Rejected";
    amount?: number;
  }
  
  export interface UpdateScholarshipApplicationRequestDTO {
    studentId: string;
    applicationId: string;
    status?: "Approved" | "Pending" | "Rejected";
  }
  
  export type CreateChargeRequestDTO = Pick<ChargeProps, "title" | "description" | "amount" | "term" | "dueDate" | "applicableFor" | "createdBy">;
  
  export interface GetAllChargesRequestDTO {
    term?: string;
    status?: string;
    search?: string;
    page: number;
    limit: number;
  }