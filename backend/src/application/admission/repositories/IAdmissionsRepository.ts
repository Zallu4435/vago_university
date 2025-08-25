  import {
    CreateApplicationResponseDTO,
    ProcessPaymentResponseDTO,
    ConfirmPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
    UploadDocumentResponseDTO,
    UploadMultipleDocumentsResponseDTO,
  } from "../../../domain/admission/dtos/AdmissionResponseDTOs";
   
  export interface IAdmissionsRepository {
    createApplication(params: { userId: string }): Promise<CreateApplicationResponseDTO>;
    findDraftByRegisterId(userId: string);
    findDraftByApplicationId(applicationId: string)
    saveDraft(draft);
    processPayment(params: { applicationId: string, paymentDetails: { method: string, amount: number, currency: string, paymentMethodId?: string, returnUrl?: string } }): Promise<ProcessPaymentResponseDTO>;
    confirmPayment(params: { paymentId: string, stripePaymentIntentId: string }): Promise<ConfirmPaymentResponseDTO>;
    finalizeAdmission(params: { applicationId: string, paymentId: string }): Promise<FinalizeAdmissionResponseDTO>;
    uploadDocument(params: { file: Express.Multer.File, applicationId: string, documentType: string }): Promise<UploadDocumentResponseDTO>;
    uploadMultipleDocuments(params: { files: Express.Multer.File[], applicationId: string, documentTypes: string[] }): Promise<UploadMultipleDocumentsResponseDTO>;
    getDocumentByKey(params: { userId: string; documentKey: string });
  }