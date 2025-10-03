import { GetUserSiteSectionsRequestDTO, GetUserSiteSectionsResponseDTO, UserSiteSectionDTO } from "../../../domain/site-management/dtos/UserSiteSectionDTOs";
import { SiteSectionFilter } from "../../../domain/site-management/entities/SiteSectionTypes";
import { IUserSiteSectionRepository } from "../repositories/IUserSiteSectionRepository";
import { IGetUserSiteSectionsUseCase } from "./IUserSiteSectionUseCases";


export class GetUserSiteSectionsUseCase implements IGetUserSiteSectionsUseCase {
  constructor(private readonly _userSiteSectionRepository: IUserSiteSectionRepository) { }

  async execute(params: GetUserSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetUserSiteSectionsResponseDTO }> {
    const { sectionKey, page = 1, limit = 10, search, category } = params;
    const query: SiteSectionFilter = { sectionKey };
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category.trim() !== '') {
      query.category = category;
    }
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this._userSiteSectionRepository.findSectionsRaw(query, skip, limit),
      this._userSiteSectionRepository.countSectionsRaw(query),
    ]);
    return {
      success: true,
      data: {
        sections: docs.map(toUserDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
} 

function toUserDTO(doc): UserSiteSectionDTO {
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