import {
  GetSiteSectionsRequestDTO,
  GetSiteSectionByIdRequestDTO,
  CreateSiteSectionRequestDTO,
  UpdateSiteSectionRequestDTO,
  DeleteSiteSectionRequestDTO,
} from '../../../domain/site-management/dtos/SiteSectionDTOs';
import {
  GetSiteSectionsResponseDTO,
  GetSiteSectionByIdResponseDTO,
  CreateSiteSectionResponseDTO,
  UpdateSiteSectionResponseDTO,
} from '../../../domain/site-management/dtos/SiteSectionDTOs';

export interface ISiteSectionRepository {
  getSections(query: any): Promise<any[]>;
  getSectionById(params: GetSiteSectionByIdRequestDTO): Promise<any | null>;
  createSection(params: CreateSiteSectionRequestDTO): Promise<any>;
  updateSection(params: UpdateSiteSectionRequestDTO): Promise<any | null>;
  deleteSection(params: DeleteSiteSectionRequestDTO): Promise<void>;
}