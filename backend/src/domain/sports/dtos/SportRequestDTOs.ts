export interface GetSportsRequestDTO {
  page: number;
  limit: number;
  sportType: string;
  status: string;
  coach: string;
}

export interface GetSportByIdRequestDTO {
  id: string;
}

export interface CreateSportRequestDTO {
  title: string;
  type: string;
  headCoach: string;
  playerCount: number;
  status: string;
  formedOn: string;
  logo: string;
  division?: string;
}

export interface UpdateSportRequestDTO {
  id: string;
  title?: string;
  type?: string;
  headCoach?: string;
  playerCount?: number;
  status?: string;
  formedOn?: string;
  logo?: string;
  division?: string;
}

export interface DeleteSportRequestDTO {
  id: string;
}

export interface GetSportRequestsRequestDTO {
  page: number;
  limit: number;
  status: string;
  type: string;
  startDate?: string;
  endDate?: string;
}

export interface ApproveSportRequestRequestDTO {
  id: string;
}

export interface RejectSportRequestRequestDTO {
  id: string;
}

export interface GetSportRequestDetailsRequestDTO {
  id: string;
}

export interface JoinSportRequestDTO {
  sportId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
} 