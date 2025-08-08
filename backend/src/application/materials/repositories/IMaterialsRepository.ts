import { CreateMaterialRequestDTO, UpdateMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { MaterialProps } from '../../../domain/materials/entities/MaterialTypes';

export interface IMaterialsRepository {
  find(filter: Partial<MaterialProps>, options?: { skip?: number; limit?: number; sort?: any });
  count(filter: Partial<MaterialProps>);
  findById(id: string);
  create(data: CreateMaterialRequestDTO);
  update(id: string, data: UpdateMaterialRequestDTO);
  delete(id: string): Promise<void>;
} 