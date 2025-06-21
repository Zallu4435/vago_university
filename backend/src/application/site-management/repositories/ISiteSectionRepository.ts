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
  getSections(params: GetSiteSectionsRequestDTO): Promise<GetSiteSectionsResponseDTO>;
  getSectionById(params: GetSiteSectionByIdRequestDTO): Promise<GetSiteSectionByIdResponseDTO | null>;
  createSection(params: CreateSiteSectionRequestDTO): Promise<CreateSiteSectionResponseDTO>;
  updateSection(params: UpdateSiteSectionRequestDTO): Promise<UpdateSiteSectionResponseDTO | null>;
  deleteSection(params: DeleteSiteSectionRequestDTO): Promise<void>;
}