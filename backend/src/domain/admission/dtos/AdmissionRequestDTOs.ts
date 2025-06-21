import mongoose from "mongoose";
import { AdmissionStatus, PaymentMethod } from "../entities/Admission";

export interface CreateApplicationRequestDTO {
  userId: string;
}

export interface GetApplicationRequestDTO {
  userId: string;
}

export interface SaveSectionRequestDTO {
  applicationId: string;
  section: string;
  data: any;
}

export interface UploadDocumentRequestDTO {
  applicationId: string;
  documentType: string;
  file: Express.Multer.File;
}

export interface UploadMultipleDocumentsRequestDTO {
  applicationId: string;
  files: Express.Multer.File[];
  documentTypes: string[];
}

export interface ProcessPaymentRequestDTO {
  applicationId: string;
  paymentDetails: {
    method: PaymentMethod | string;
    amount: number;
    currency: string;
    paymentMethodId?: string;
    returnUrl?: string;
  };
}

export interface ConfirmPaymentRequestDTO {
  paymentId: string;
  stripePaymentIntentId: string;
}

export interface FinalizeAdmissionRequestDTO {
  applicationId: string;
  paymentId: string;
}