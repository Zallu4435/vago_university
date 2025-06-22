export interface GetAdmissionsRequestDTO {
    page: number;
    limit: number;
    status?: string;
    program?: string;
    dateRange?: string;
    startDate?: string;
    endDate?: string;
  }
  
  export interface GetAdmissionByIdRequestDTO {
    id: string;
  }
  
  export interface GetAdmissionByTokenRequestDTO {
    admissionId: string;
    token: string;
  }
  
  export interface ApproveAdmissionRequestDTO {
    id: string;
    additionalInfo?: {
      programDetails?: string;
      startDate?: string;
      scholarshipInfo?: string;
      additionalNotes?: string;
    };
  }
  
  export interface RejectAdmissionRequestDTO {
    id: string;
  }
  
  export interface DeleteAdmissionRequestDTO {
    id: string;
  }
  
  export interface ConfirmAdmissionOfferRequestDTO {
    admissionId: string;
    token: string;
    action: "accept" | "reject";
  }