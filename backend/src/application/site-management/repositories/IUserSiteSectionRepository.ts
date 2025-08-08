import { ISiteSectionDocument } from '../../../domain/site-management/entities/SiteSectionTypes';

export interface IUserSiteSectionRepository {
  findSectionsRaw(query, skip: number, limit: number): Promise<ISiteSectionDocument[]>;
  countSectionsRaw(query): Promise<number>;
} 