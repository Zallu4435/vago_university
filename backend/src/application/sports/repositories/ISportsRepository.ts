import { Sport, SportLeanResult, CreateSportData, UpdateSportData } from "../../../domain/sports/entities/SportTypes";

export interface ISportsRepository {
  getSports(page: number, limit: number, sportType: string, status: string, coach: string, startDate: string, endDate: string, search: string)
  getSportById(id: string): Promise<SportLeanResult | null>;
  createSport(params: CreateSportData): Promise<Sport>;
  updateSport(params: UpdateSportData): Promise<SportLeanResult | null>;
  deleteSport(id: string): Promise<void>;
  getSportRequests(page: number, limit: number, status: string, type: string, startDate: string, endDate: string, search: string);
  approveSportRequest(id: string): Promise<void>;
  rejectSportRequest(id: string): Promise<void>;
  getSportRequestDetails(id: string);
  joinSport(id: string);
} 