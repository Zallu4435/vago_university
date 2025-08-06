import { AdminAdmission, AdminAdmissionStatus, FullAdmissionDetails } from '../entities/AdminAdmissionTypes';

export interface AdmissionResponseDTO {
    _id: string;
    fullName: string;
    email: string;
    createdAt: string;
    status: AdminAdmissionStatus;
    program: string;
}
  
export interface GetAdmissionsResponseDTO {
    admissions: AdmissionResponseDTO[];
    totalAdmissions: number;
    totalPages: number;
    currentPage: number;
}
  
export interface GetAdmissionByIdResponseDTO extends FullAdmissionDetails {
    blocked?: boolean;
}
  
export interface GetAdmissionByTokenResponseDTO {
    admission: AdminAdmission;
}
  
export interface ApproveAdmissionResponseDTO {
    message: string;
}
  
export interface RejectAdmissionResponseDTO {
    message: string;
}
  
export interface DeleteAdmissionResponseDTO {
    message: string;
}
  
export interface ConfirmAdmissionOfferResponseDTO {
    message: string;
}