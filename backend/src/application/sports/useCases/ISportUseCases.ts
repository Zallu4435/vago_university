import {
  GetSportsRequestDTO,
  GetSportByIdRequestDTO,
  CreateSportRequestDTO,
  UpdateSportRequestDTO,
  DeleteSportRequestDTO,
} from "../../../domain/sports/dtos/SportRequestDTOs";
import {
  GetSportsResponseDTO,
  GetSportByIdResponseDTO,
  CreateSportResponseDTO,
  UpdateSportResponseDTO,
} from "../../../domain/sports/dtos/SportResponseDTOs";

export interface IGetSportsUseCase {
  execute(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO>;
}

export interface IGetSportByIdUseCase {
  execute(params: GetSportByIdRequestDTO): Promise<GetSportByIdResponseDTO>;
}

export interface ICreateSportUseCase {
  execute(params: CreateSportRequestDTO): Promise<CreateSportResponseDTO>;
}

export interface IUpdateSportUseCase {
  execute(params: UpdateSportRequestDTO): Promise<UpdateSportResponseDTO>;
}

export interface IDeleteSportUseCase {
  execute(params: DeleteSportRequestDTO): Promise<{ message: string }>;
}
