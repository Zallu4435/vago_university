import { GetUserSiteSectionsRequestDTO, GetUserSiteSectionsResponseDTO } from '../../../domain/site-management/dtos/UserSiteSectionDTOs';

export interface IUserSiteSectionRepository {
  findSectionsRaw(query: any, skip: number, limit: number): Promise<any[]>;
  countSectionsRaw(query: any): Promise<number>;
} 