import { ISportsRepository } from "../repositories/ISportsRepository";
import {
  GetSportRequestsRequestDTO,
  ApproveSportRequestRequestDTO,
  RejectSportRequestRequestDTO,
  GetSportRequestDetailsRequestDTO,
  JoinSportRequestDTO,
} from "../../../domain/sports/dtos/SportRequestDTOs";
import {
  GetSportRequestsResponseDTO,
  GetSportRequestDetailsResponseDTO,
  JoinSportResponseDTO,
} from "../../../domain/sports/dtos/SportResponseDTOs";

export interface IGetSportRequestsUseCase {
  execute(params: GetSportRequestsRequestDTO): Promise<GetSportRequestsResponseDTO>;
}

export interface IApproveSportRequestUseCase {
  execute(params: ApproveSportRequestRequestDTO): Promise<{ message: string }>;
}

export interface IRejectSportRequestUseCase {
  execute(params: RejectSportRequestRequestDTO): Promise<{ message: string }>;
}

export interface IGetSportRequestDetailsUseCase {
  execute(params: GetSportRequestDetailsRequestDTO): Promise<GetSportRequestDetailsResponseDTO>;
}

export interface IJoinSportUseCase {
  execute(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO>;
}
