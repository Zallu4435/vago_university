import { CreateMaterialRequestDTO, UpdateMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { MaterialProps } from '../../../domain/materials/entities/MaterialTypes';

export interface IMaterialsRepository {
  find(filter: Partial<MaterialProps>, options?: { skip?: number; limit?: number; sort?: any }): Promise<MaterialProps[]>;
  count(filter: Partial<MaterialProps>): Promise<number>;
  findById(id: string): Promise<MaterialProps | null>;
  create(data: CreateMaterialRequestDTO): Promise<MaterialProps>;
  update(id: string, data: UpdateMaterialRequestDTO): Promise<MaterialProps | null>;
  delete(id: string): Promise<void>;
} 