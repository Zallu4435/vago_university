import { SiteSectionModel } from '../../database/mongoose/models/site-management/SiteSectionModel';
import { IUserSiteSectionRepository } from '../../../application/site-management/repositories/IUserSiteSectionRepository';
import { GetUserSiteSectionsRequestDTO, GetUserSiteSectionsResponseDTO, UserSiteSectionDTO } from '../../../domain/site-management/dtos/UserSiteSectionDTOs';

function toUserDTO(doc: any): UserSiteSectionDTO {
  return {
    id: doc._id.toString(),
    sectionKey: doc.sectionKey,
    title: doc.title,
    description: doc.description,
    image: doc.image || '',
    link: doc.link || '',
    category: doc.category,
    createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

export class UserSiteSectionRepository implements IUserSiteSectionRepository {
  async getUserSections(params: GetUserSiteSectionsRequestDTO): Promise<GetUserSiteSectionsResponseDTO> {
    const { sectionKey, page = 1, limit = 10 } = params;
    
    const query: any = { sectionKey };
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      SiteSectionModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      SiteSectionModel.countDocuments(query),
    ]);

    return {
      sections: docs.map(toUserDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
} 