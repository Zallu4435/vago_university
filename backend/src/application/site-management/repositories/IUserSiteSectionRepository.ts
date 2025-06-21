import { GetUserSiteSectionsRequestDTO } from '../../../domain/site-management/dtos/UserSiteSectionDTOs';
import { GetUserSiteSectionsResponseDTO } from '../../../domain/site-management/dtos/UserSiteSectionDTOs';

export interface IUserSiteSectionRepository {
  getUserSections(params: GetUserSiteSectionsRequestDTO): Promise<GetUserSiteSectionsResponseDTO>;
} 