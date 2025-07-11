import { FacultyStatus } from '../FacultyTypes';

export interface GetFacultyRequestDTO {
    page: number;
    limit: number;
    status?: FacultyStatus;
    department?: string;
    dateRange?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }
  
  export interface GetFacultyByIdRequestDTO {
    id: string;
  }
  
  export interface GetFacultyByTokenRequestDTO {
    facultyId: string;
    token: string;
  }
  
  export interface ApproveFacultyRequestDTO {
    id: string;
    additionalInfo: {
      department: string;
      position: string;
      startDate: string;
      salary?: string;
      benefits?: string;
      additionalNotes?: string;
    };
  }
  
  export interface RejectFacultyRequestDTO {
    id: string;
  }
  
  export interface DeleteFacultyRequestDTO {
    id: string;
  }
  
  export interface ConfirmFacultyOfferRequestDTO {
    facultyId: string;
    token: string;
    action: "accept" | "reject";
  }
  
  export interface DownloadCertificateRequestDTO {
    facultyId: string;
    certificateUrl: string;
    requestingUserId: string;
    type: string;
  }