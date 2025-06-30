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
export interface CreateMaterialRequestDTO {
  title: string;
  description: string;
  subject: string;
  course: string;
  semester: number;
  type: string;
  fileUrl: string;
  thumbnailUrl: string;
  tags: string[];
  difficulty: string;
  estimatedTime: string;
  isNewMaterial: boolean;
  isRestricted: boolean;
  uploadedBy: string;
}
export interface UpdateMaterialRequestDTO {
  id: string;
  data: Partial<CreateMaterialRequestDTO>;
}
export interface DeleteMaterialRequestDTO { id: string; } 