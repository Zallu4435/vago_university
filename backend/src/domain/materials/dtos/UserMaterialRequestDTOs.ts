export interface GetUserMaterialsRequestDTO {
  userId: string;
  subject?: string;
  course?: string;
  semester?: number;
  type?: string;
  difficulty?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface GetUserMaterialByIdRequestDTO {
  userId: string;
  id: string;
}

export interface ToggleBookmarkRequestDTO {
  userId: string;
  materialId: string;
}

export interface ToggleLikeRequestDTO {
  userId: string;
  materialId: string;
}

export interface DownloadMaterialRequestDTO {
  userId: string;
  materialId: string;
}

export interface GetUserBookmarkedMaterialsRequestDTO {
  userId: string;
  page: number;
  limit: number;
}

export interface GetUserLikedMaterialsRequestDTO {
  userId: string;
  page: number;
  limit: number;
} 