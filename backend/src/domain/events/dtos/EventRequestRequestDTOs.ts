export interface GetEventRequestsRequestDTO {
  page: number;
  limit: number;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  organizerType?: string;
  dateRange?: string;
}

export interface ApproveEventRequestRequestDTO {
  id: string;
}

export interface RejectEventRequestRequestDTO {
  id: string;
}

export interface GetEventRequestDetailsRequestDTO {
  id: string;
}