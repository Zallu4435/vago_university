import { GetMaterialsRequestDTO, GetMaterialByIdRequestDTO, CreateMaterialRequestDTO, UpdateMaterialRequestDTO, DeleteMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { GetMaterialsResponseDTO, GetMaterialByIdResponseDTO, CreateMaterialResponseDTO, UpdateMaterialResponseDTO } from '../../../domain/materials/dtos/MaterialResponseDTOs';
import { MaterialProps } from '../../../domain/materials/entities/MaterialTypes';

export interface IMaterialsRepository {
  find(filter: Partial<MaterialProps>, options?: { skip?: number; limit?: number; sort?: any }): Promise<MaterialProps[]>;
  count(filter: Partial<MaterialProps>): Promise<number>;
  findById(id: string): Promise<MaterialProps | null>;
  create(data: CreateMaterialRequestDTO): Promise<MaterialProps>;
  update(id: string, data: UpdateMaterialRequestDTO): Promise<MaterialProps | null>;
  delete(id: string): Promise<void>;
} 