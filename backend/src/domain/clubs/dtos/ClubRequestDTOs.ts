import { ClubProps, ClubRequestProps, ClubStatus, ClubRequestStatus } from "../entities/ClubTypes";

// Reusable types for Club
export type ClubDataDTO = Pick<ClubProps, 
  'name' | 'type' | 'createdBy' | 'description' | 'members' | 'color' | 'icon' | 
  'nextMeeting' | 'about' | 'enteredMembers' | 'upcomingEvents'
> & {
  status?: ClubStatus;
};

// Reusable types for ClubRequest
export type ClubRequestDataDTO = Pick<ClubRequestProps, 
  'clubId' | 'userId' | 'whyJoin'
> & {
  additionalInfo?: string;
};

// Request DTOs
export interface GetClubsRequestDTO {
  page: number;
  limit: number;
  category?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface GetClubByIdRequestDTO {
  id: string;
}

export interface CreateClubRequestDTO extends ClubDataDTO {}

export type UpdateClubRequestDTO = {
  id: string;
} & Partial<ClubDataDTO>;

export interface DeleteClubRequestDTO {
  id: string;
}

export interface GetClubRequestsRequestDTO {
  page: number;
  limit: number;
  status: string;
  type: string;
  startDate?: string;
  endDate?: string;
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

export interface JoinClubRequestDTO extends ClubRequestDataDTO {}