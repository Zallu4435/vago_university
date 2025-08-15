import { SportDocument, SportRequest } from "../../../domain/sports/entities/SportTypes";
import { IBaseRepository } from "../../repositories";

export interface ISportsRepository extends 
  IBaseRepository<SportDocument, Record<string, any>, Record<string, any>, any, SportDocument> {
  
  getSports(page: number, limit: number, sportType: string, status: string, coach: string, startDate: string, endDate: string, search: string): Promise<{
    sports: SportDocument[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }>;
  
  // getSportById(id: string): Promise<SportDocument | null>;        // Use getById() instead
  // createSport(params: CreateSportData): Promise<Sport>;           // Use create() instead  
  // updateSport(params: UpdateSportData): Promise<SportDocument | null>; // Use updateById() instead
  // deleteSport(id: string): Promise<void>;                         // Use deleteById() instead

  // Sport request management operations
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