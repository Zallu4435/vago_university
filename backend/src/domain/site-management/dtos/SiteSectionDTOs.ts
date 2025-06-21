import { SiteSectionKey } from '../entities/SiteSection';

// Request DTOs
export interface GetSiteSectionsRequestDTO {
  sectionKey?: SiteSectionKey;
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetSiteSectionByIdRequestDTO {
  id: string;
}

export interface CreateSiteSectionRequestDTO {
  sectionKey: SiteSectionKey;
  title: string;
  description: string;
  image?: string;
  link?: string;
  category?: string;
}

export interface UpdateSiteSectionRequestDTO {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  category?: string;
}

export interface DeleteSiteSectionRequestDTO {
  id: string;
}

// Response DTOs
export interface SiteSectionDTO {
  id: string;
  sectionKey: SiteSectionKey;
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetSiteSectionsResponseDTO {
  sections: SiteSectionDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetSiteSectionByIdResponseDTO {
  section: SiteSectionDTO;
}

export interface CreateSiteSectionResponseDTO {
  section: SiteSectionDTO;
}

export interface UpdateSiteSectionResponseDTO {
  section: SiteSectionDTO;
}

export interface SiteSectionFilterDTO {
  sectionType?: 'highlights' | 'vagoNow' | 'leadership';
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}