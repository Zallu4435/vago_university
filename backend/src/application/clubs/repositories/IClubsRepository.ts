import {
  GetClubsRequest,
  GetClubByIdRequest,
  CreateClubRequest,
  UpdateClubRequest,
  DeleteClubRequest,
  GetClubRequestsRequest,
  ApproveClubRequestRequest,
  RejectClubRequestRequest,
  GetClubRequestDetailsRequest,
  GetClubsResponse,
  GetClubByIdResponse,
  CreateClubResponse,
  UpdateClubResponse,
  GetClubRequestsResponse,
  GetClubRequestDetailsResponse,
} from "../../../domain/clubs/entities/Club";
   
export interface IClubsRepository {
  getClubs(params: GetClubsRequest): Promise<GetClubsResponse>;
  getClubById(id: string): Promise<GetClubByIdResponse | null>;
  createClub(params: CreateClubRequest): Promise<CreateClubResponse>;
  updateClub(params: UpdateClubRequest): Promise<UpdateClubResponse | null>;
  deleteClub(params: DeleteClubRequest): Promise<void>;
  getClubRequests(params: GetClubRequestsRequest): Promise<GetClubRequestsResponse>;
  approveClubRequest(params: ApproveClubRequestRequest): Promise<void>;
  rejectClubRequest(params: RejectClubRequestRequest): Promise<void>;
  getClubRequestDetails(params: GetClubRequestDetailsRequest): Promise<GetClubRequestDetailsResponse | null>;
}