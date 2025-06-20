import {
    CreateApplicationRequestDTO,
    GetApplicationRequestDTO,
    SaveSectionRequestDTO,
    ProcessPaymentRequestDTO,
    FinalizeAdmissionRequestDTO,
  } from "../../../domain/admission/dtos/AdmissionRequestDTOs";
  import {
    CreateApplicationResponseDTO,
    GetApplicationResponseDTO,
    SaveSectionResponseDTO,
    ProcessPaymentResponseDTO,
    FinalizeAdmissionResponseDTO,
  } from "../../../domain/admission/dtos/AdmissionResponseDTOs";
  
  export interface IAdmissionsRepository {
    createApplication(params: CreateApplicationRequestDTO): Promise<CreateApplicationResponseDTO>;
    getApplication(params: GetApplicationRequestDTO): Promise<GetApplicationResponseDTO>;
    saveSection(params: SaveSectionRequestDTO): Promise<SaveSectionResponseDTO>;
    processPayment(params: ProcessPaymentRequestDTO): Promise<ProcessPaymentResponseDTO>;
    finalizeAdmission(params: FinalizeAdmissionRequestDTO): Promise<FinalizeAdmissionResponseDTO>;
  }