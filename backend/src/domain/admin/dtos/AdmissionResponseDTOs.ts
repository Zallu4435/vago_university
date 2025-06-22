export interface AdmissionResponseDTO {
    _id: string;
    fullName: string;
    email: string;
    createdAt: string;
    status: "pending" | "approved" | "rejected" | "offered";
    program: string;
  }
  
  export interface GetAdmissionsResponseDTO {
    admissions: AdmissionResponseDTO[];
    totalAdmissions: number;
    totalPages: number;
    currentPage: number;
  }
  
  export interface GetAdmissionByIdResponseDTO {
    admission: any;
  }
  
  export interface GetAdmissionByTokenResponseDTO {
    admission: any;
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