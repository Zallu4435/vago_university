import { GetMaterialsRequestDTO, GetMaterialByIdRequestDTO, CreateMaterialRequestDTO, UpdateMaterialRequestDTO, DeleteMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { GetMaterialsResponseDTO, GetMaterialByIdResponseDTO, CreateMaterialResponseDTO, UpdateMaterialResponseDTO } from '../../../domain/materials/dtos/MaterialResponseDTOs';

export interface IGetMaterialsUseCase {
  execute(params: GetMaterialsRequestDTO): Promise<GetMaterialsResponseDTO>;
}

export interface IGetMaterialByIdUseCase {
  execute(params: GetMaterialByIdRequestDTO): Promise<GetMaterialByIdResponseDTO>;
}

export interface ICreateMaterialUseCase {
  execute(params: CreateMaterialRequestDTO): Promise<CreateMaterialResponseDTO>;
}

export interface IUpdateMaterialUseCase {
  execute(params: UpdateMaterialRequestDTO): Promise<UpdateMaterialResponseDTO>;
}

export interface IDeleteMaterialUseCase {
  execute(params: DeleteMaterialRequestDTO): Promise<void>;
}
