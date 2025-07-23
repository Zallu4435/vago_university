import { MaterialProps } from '../../../domain/materials/entities/MaterialTypes';

export interface IUserMaterialsRepository {
  find(filter: Partial<MaterialProps>, options?: { skip?: number; limit?: number; sort?: any }): Promise<MaterialProps[]>;
  count(filter: Partial<MaterialProps>): Promise<number>;
  findById(id: string): Promise<MaterialProps | null>;
  update(id: string, data: Partial<MaterialProps>): Promise<MaterialProps | null>;
  toggleBookmark(materialId: string, userId: string): Promise<void>;
  toggleLike(materialId: string, userId: string): Promise<void>;
  incrementDownloads(materialId: string): Promise<string>;
} 