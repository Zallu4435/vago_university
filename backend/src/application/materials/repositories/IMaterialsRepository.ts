import { CreateMaterialRequestDTO, UpdateMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { MaterialFilter } from '../../../domain/materials/entities/MaterialTypes';

export interface IMaterialsRepository {
  find(filter: MaterialFilter, options?: { skip?: number; limit?: number; sort});
  count(filter: MaterialFilter);
  findById(id: string);
  create(data: CreateMaterialRequestDTO);
  update(id: string, data: UpdateMaterialRequestDTO);
  delete(id: string): Promise<void>;
} 