import {
  GetSportsRequestDTO,
  GetSportByIdRequestDTO,
  CreateSportRequestDTO,
  UpdateSportRequestDTO,
  DeleteSportRequestDTO,
  GetSportRequestsRequestDTO,
  ApproveSportRequestRequestDTO,
  RejectSportRequestRequestDTO,
  GetSportRequestDetailsRequestDTO,
  JoinSportRequestDTO,
} from "../../../domain/sports/dtos/SportRequestDTOs";
import {
  GetSportsResponseDTO,
  GetSportByIdResponseDTO,
  CreateSportResponseDTO,
  UpdateSportResponseDTO,
  GetSportRequestsResponseDTO,
  GetSportRequestDetailsResponseDTO,
  JoinSportResponseDTO,
} from "../../../domain/sports/dtos/SportResponseDTOs";

export interface ISportsRepository {
  getSports(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO>;
  getSportById(params: GetSportByIdRequestDTO): Promise<GetSportByIdResponseDTO | null>;
  createSport(params: CreateSportRequestDTO): Promise<CreateSportResponseDTO>;
  updateSport(params: UpdateSportRequestDTO): Promise<UpdateSportResponseDTO | null>;
  deleteSport(params: DeleteSportRequestDTO): Promise<void>;
  getSportRequests(params: GetSportRequestsRequestDTO): Promise<GetSportRequestsResponseDTO>;
  approveSportRequest(params: ApproveSportRequestRequestDTO): Promise<void>;
  rejectSportRequest(params: RejectSportRequestRequestDTO): Promise<void>;
  getSportRequestDetails(params: GetSportRequestDetailsRequestDTO): Promise<GetSportRequestDetailsResponseDTO | null>;
  joinSport(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO>;
} 