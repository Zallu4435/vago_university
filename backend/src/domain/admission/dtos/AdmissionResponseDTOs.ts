import { Admission, AdmissionDraft } from "../entities/Admission";

export interface CreateApplicationResponseDTO {
  applicationId: string;
}

export interface GetApplicationResponseDTO {
  draft: AdmissionDraft | null;
}

export interface SaveSectionResponseDTO {
  draft: AdmissionDraft;
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