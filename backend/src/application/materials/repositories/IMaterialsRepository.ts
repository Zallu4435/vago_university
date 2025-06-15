import { GetMaterialsRequestDTO, GetMaterialByIdRequestDTO, CreateMaterialRequestDTO, UpdateMaterialRequestDTO, DeleteMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { GetMaterialsResponseDTO, GetMaterialByIdResponseDTO, CreateMaterialResponseDTO, UpdateMaterialResponseDTO } from '../../../domain/materials/dtos/MaterialResponseDTOs';

export interface IMaterialsRepository {
  getMaterials(params: GetMaterialsRequestDTO): Promise<GetMaterialsResponseDTO>;
  getMaterialById(params: GetMaterialByIdRequestDTO): Promise<GetMaterialByIdResponseDTO | null>;
  createMaterial(params: CreateMaterialRequestDTO): Promise<CreateMaterialResponseDTO>;
  updateMaterial(params: UpdateMaterialRequestDTO): Promise<UpdateMaterialResponseDTO | null>;
  deleteMaterial(params: DeleteMaterialRequestDTO): Promise<void>;
} 