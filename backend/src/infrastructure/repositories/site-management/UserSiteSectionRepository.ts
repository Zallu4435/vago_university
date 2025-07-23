import { SiteSectionModel } from '../../database/mongoose/models/site-management/SiteSectionModel';
import { IUserSiteSectionRepository } from '../../../application/site-management/repositories/IUserSiteSectionRepository';

export class UserSiteSectionRepository implements IUserSiteSectionRepository {
  async findSectionsRaw(query: any, skip: number, limit: number): Promise<any[]> {
    return SiteSectionModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean();
  }

  async countSectionsRaw(query: any): Promise<number> {
    return SiteSectionModel.countDocuments(query);
  }
} 