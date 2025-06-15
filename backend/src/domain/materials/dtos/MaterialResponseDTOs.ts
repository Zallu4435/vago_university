import { MaterialProps } from '../entities/Material';
export interface GetMaterialsResponseDTO { materials: MaterialProps[]; totalPages: number; }
export interface GetMaterialByIdResponseDTO { material: MaterialProps; }
export interface CreateMaterialResponseDTO { material: MaterialProps; }
export interface UpdateMaterialResponseDTO { material: MaterialProps; } 