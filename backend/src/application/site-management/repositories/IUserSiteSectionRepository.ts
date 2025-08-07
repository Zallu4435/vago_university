import { ISiteSectionDocument } from '../../../domain/site-management/entities/SiteSectionTypes';

export interface IUserSiteSectionRepository {
  findSectionsRaw(query: any, skip: number, limit: number): Promise<ISiteSectionDocument[]>;
  countSectionsRaw(query: any): Promise<number>;
} 