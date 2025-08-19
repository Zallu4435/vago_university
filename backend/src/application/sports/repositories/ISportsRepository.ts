import { SportDocument, SportRequest, CreateSportData, UpdateSportData, SportFilter } from "../../../domain/sports/entities/SportTypes";
import { IBaseRepository } from "../../repositories";

export interface ISportsRepository extends 
  IBaseRepository<SportDocument, CreateSportData, UpdateSportData, SportFilter, SportDocument> {
  
  getSports(page: number, limit: number, sportType: string, status: string, coach: string, startDate: string, endDate: string, search: string): Promise<{
    sports: SportDocument[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }>;
  getSportRequests(page: number, limit: number, status: string, type: string, startDate: string, endDate: string, search: string): Promise<{
    requests: SportRequest[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }>;
  approveSportRequest(id: string): Promise<void>;
  rejectSportRequest(id: string): Promise<void>;
  getSportRequestDetails(id: string): Promise<SportRequest | null>;
  joinSport(id: string): Promise<SportRequest>;
}  