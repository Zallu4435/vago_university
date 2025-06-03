import {
    GetClubsRequestDTO,
    GetClubByIdRequestDTO,
    CreateClubRequestDTO,
    UpdateClubRequestDTO,
    DeleteClubRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestDTOs";
  import {
    GetClubsResponseDTO,
    GetClubByIdResponseDTO,
    CreateClubResponseDTO,
    UpdateClubResponseDTO,
  } from "../../../domain/clubs/dtos/ClubResponseDTOs";
  import {
    GetClubRequestsRequestDTO,
    ApproveClubRequestRequestDTO,
    RejectClubRequestRequestDTO,
    GetClubRequestDetailsRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestRequestDTOs";
  import {
    GetClubRequestsResponseDTO,
    GetClubRequestDetailsResponseDTO,
  } from "../../../domain/clubs/dtos/ClubRequestResponseDTOs";
  
  export interface IClubsRepository {
    getClubs(params: GetClubsRequestDTO): Promise<GetClubsResponseDTO>;
    getClubById(params: GetClubByIdRequestDTO): Promise<GetClubByIdResponseDTO | null>;
    createClub(params: CreateClubRequestDTO): Promise<CreateClubResponseDTO>;
    updateClub(params: UpdateClubRequestDTO): Promise<UpdateClubResponseDTO | null>;
    deleteClub(params: DeleteClubRequestDTO): Promise<void>;
    getClubRequests(params: GetClubRequestsRequestDTO): Promise<GetClubRequestsResponseDTO>;
    approveClubRequest(params: ApproveClubRequestRequestDTO): Promise<void>;
    rejectClubRequest(params: RejectClubRequestRequestDTO): Promise<void>;
    getClubRequestDetails(params: GetClubRequestDetailsRequestDTO): Promise<GetClubRequestDetailsResponseDTO | null>;
  }