import { Admission, AdmissionDraft } from "../entities/Admission";

export interface CreateApplicationResponseDTO {
  applicationId: string;
}

export interface GetApplicationResponseDTO {
  draft: AdmissionDraft | null;
}

export interface SaveSectionResponseDTO {
  success: boolean;
  message: string;
  data?: any;
}

export interface ProcessPaymentResponseDTO {
  paymentId: string;
  status: string;
  message: string;
  clientSecret: string | null;
  stripePaymentIntentId?: string;
}

export interface ConfirmPaymentResponseDTO {
  paymentId: string;
  status: string;
  message: string;
  stripePaymentIntentId: string;
}

export interface FinalizeAdmissionResponseDTO {
  admission: Admission;
}

export interface UploadDocumentResponseDTO {
  success: boolean;
  message: string;
  document: {
    url: string;
    publicId: string;
    fileName: string;
    fileType: string;
  };
}

export interface UploadMultipleDocumentsResponseDTO {
  success: boolean;
  message: string;
  documents: Array<{
    url: string;
    publicId: string;
    fileName: string;
    fileType: string;
  }>;
}