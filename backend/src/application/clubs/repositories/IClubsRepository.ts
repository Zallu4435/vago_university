import {
  GetClubsRequest,
  CreateClubRequest,
  UpdateClubRequest,
  GetClubRequestsRequest,
  ApproveClubRequestRequest,
  RejectClubRequestRequest,
  GetClubRequestDetailsRequest,
} from "../../../domain/clubs/entities/Club";
import { IBaseRepository } from "../../repositories";
import { Club, ClubRequest } from "../../../domain/clubs/entities/ClubTypes";

export interface IClubsRepository extends 
  IBaseRepository<Club, CreateClubRequest, UpdateClubRequest, Record<string, unknown>, Club> {
  
  getClubs(params: GetClubsRequest): Promise<{ clubs: Club[]; totalItems: number; totalPages: number; currentPage: number }>;
  
  // getClubById(id: string): Promise<GetClubByIdResponse | null>;        // Use getById() instead
  // createClub(params: CreateClubRequest): Promise<CreateClubResponse>;  // Use create() instead  
  // updateClub(params: UpdateClubRequest): Promise<UpdateClubResponse | null>;  // Use updateById() instead
  // deleteClub(params: DeleteClubRequest): Promise<void>;               // Use deleteById() instead

  getClubRequests(params: GetClubRequestsRequest): Promise<{ rawRequests: ClubRequest[]; totalItems: number; totalPages: number; currentPage: number }>;
  approveClubRequest(params: ApproveClubRequestRequest): Promise<void>;
  rejectClubRequest(params: RejectClubRequestRequest): Promise<void>;
  getClubRequestDetails(params: GetClubRequestDetailsRequest): Promise<{ clubRequest: ClubRequest } | null>;
}