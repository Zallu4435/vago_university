import { MaterialProps, UserMaterialFilter } from '../../../domain/materials/entities/MaterialTypes';

export interface IUserMaterialsRepository {
  find(filter: UserMaterialFilter, options?: { skip?: number; limit?: number; sort? }): Promise<MaterialProps[]>;
  count(filter: UserMaterialFilter): Promise<number>;
  findById(id: string): Promise<MaterialProps | null>;
  update(id: string, data: Partial<MaterialProps>): Promise<MaterialProps | null>;
  toggleBookmark(materialId: string, userId: string): Promise<void>;
  toggleLike(materialId: string, userId: string): Promise<void>;
  incrementDownloads(materialId: string): Promise<string>;
} 