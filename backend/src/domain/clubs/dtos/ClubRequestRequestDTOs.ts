export interface GetClubRequestsRequestDTO {
    page: number;
    limit: number;
    status?: string;
    type?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }
  
  export interface ApproveClubRequestRequestDTO {
    id: string;
  }
  
  export interface RejectClubRequestRequestDTO {
    id: string;
  }
  
  export interface GetClubRequestDetailsRequestDTO {
    id: string;
  }