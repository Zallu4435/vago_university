import { MaterialType, MaterialDifficulty, MaterialProps, CreateMaterialProps, UpdateMaterialProps } from "../entities/MaterialTypes";

export interface GetMaterialsRequestDTO {
  subject?: string;
  course?: string;
  semester?: number;
  type?: string;
  uploadedBy?: string;
  page: number;
  limit: number;
}
export interface GetMaterialByIdRequestDTO { id: string; }
export type CreateMaterialRequestDTO = CreateMaterialProps;
export type UpdateMaterialRequestDTO = UpdateMaterialProps;
export interface DeleteMaterialRequestDTO { id: string; } 