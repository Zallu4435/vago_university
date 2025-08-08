import {
    CreateApplicationRequestDTO,
    ProcessPaymentRequestDTO,
    ConfirmPaymentRequestDTO,
    FinalizeAdmissionRequestDTO,
    UploadDocumentRequestDTO,
    UploadMultipleDocumentsRequestDTO,
  } from "../../../domain/admission/dtos/AdmissionRequestDTOs";
  import {
    CreateApplicationResponseDTO,
    ProcessPaymentResponseDTO,
    ConfirmPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
    UploadDocumentResponseDTO,
    UploadMultipleDocumentsResponseDTO,
  } from "../../../domain/admission/dtos/AdmissionResponseDTOs";
  
  export interface IAdmissionsRepository {
    createApplication(params: CreateApplicationRequestDTO): Promise<CreateApplicationResponseDTO>;
    findDraftByRegisterId(userId: string);
    findDraftByApplicationId(applicationId: string)
    saveDraft(draft);
    processPayment(params: ProcessPaymentRequestDTO): Promise<ProcessPaymentResponseDTO>;
    confirmPayment(params: ConfirmPaymentRequestDTO): Promise<ConfirmPaymentResponseDTO>;
    finalizeAdmission(params: FinalizeAdmissionRequestDTO): Promise<FinalizeAdmissionResponseDTO>;
    uploadDocument(params: UploadDocumentRequestDTO): Promise<UploadDocumentResponseDTO>;
    uploadMultipleDocuments(params: UploadMultipleDocumentsRequestDTO): Promise<UploadMultipleDocumentsResponseDTO>;
    getDocumentByKey(params: { userId: string; documentKey: string });
  }