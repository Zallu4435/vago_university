import {
    CreateApplicationRequestDTO,
    GetApplicationRequestDTO,
    SaveSectionRequestDTO,
    ProcessPaymentRequestDTO,
    ConfirmPaymentRequestDTO,
    FinalizeAdmissionRequestDTO,
    UploadDocumentRequestDTO,
    UploadMultipleDocumentsRequestDTO,
  } from "../../../domain/admission/dtos/AdmissionRequestDTOs";
  import {
    CreateApplicationResponseDTO,
    GetApplicationResponseDTO,
    SaveSectionResponseDTO,
    ProcessPaymentResponseDTO,
    ConfirmPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
    UploadDocumentResponseDTO,
    UploadMultipleDocumentsResponseDTO,
  } from "../../../domain/admission/dtos/AdmissionResponseDTOs";
  
  export interface IAdmissionsRepository {
    createApplication(params: CreateApplicationRequestDTO): Promise<CreateApplicationResponseDTO>;
    getApplication(params: GetApplicationRequestDTO): Promise<GetApplicationResponseDTO>;
    saveSection(params: SaveSectionRequestDTO): Promise<SaveSectionResponseDTO>;
    processPayment(params: ProcessPaymentRequestDTO): Promise<ProcessPaymentResponseDTO>;
    confirmPayment(params: ConfirmPaymentRequestDTO): Promise<ConfirmPaymentResponseDTO>;
    finalizeAdmission(params: FinalizeAdmissionRequestDTO): Promise<FinalizeAdmissionResponseDTO>;
    uploadDocument(params: UploadDocumentRequestDTO): Promise<UploadDocumentResponseDTO>;
    uploadMultipleDocuments(params: UploadMultipleDocumentsRequestDTO): Promise<UploadMultipleDocumentsResponseDTO>;
  }