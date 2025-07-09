import {
  GetSiteSectionsRequestDTO,
  GetSiteSectionByIdRequestDTO,
  CreateSiteSectionRequestDTO,
  UpdateSiteSectionRequestDTO,
  DeleteSiteSectionRequestDTO,
  SiteSectionDTO,
  GetSiteSectionsResponseDTO,
  GetSiteSectionByIdResponseDTO,
  CreateSiteSectionResponseDTO,
  UpdateSiteSectionResponseDTO,
} from "../../../domain/site-management/dtos/SiteSectionDTOs";
import { ISiteSectionRepository } from "../repositories/ISiteSectionRepository";
import { SiteSection } from '../../../domain/site-management/entities/SiteSection';
import { InvalidSectionKeyError, InvalidHighlightError, InvalidVagoNowError, InvalidLeadershipError } from '../../../domain/site-management/errors/SiteSectionErrors';

export class GetSiteSectionsUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: GetSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetSiteSectionsResponseDTO }> {
    const { sectionKey, page = 1, limit = 10, search } = params;
    const query: any = {};
    if (sectionKey) query.sectionKey = sectionKey;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const allDocs: any[] = await this.siteSectionRepository.getSections(query);
    const total = allDocs.length;
    const pagedDocs = allDocs.slice(skip, skip + limit);
    return {
      success: true,
      data: {
        sections: pagedDocs.map(doc => SiteSectionUseCaseMapper.toDTO(doc)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export class GetSiteSectionByIdUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: GetSiteSectionByIdRequestDTO): Promise<{ success: boolean; data: GetSiteSectionByIdResponseDTO | null }> {
    const doc = await this.siteSectionRepository.getSectionById(params);
    return doc ? { success: true, data: { section: SiteSectionUseCaseMapper.toDTO(doc) } } : { success: false, data: null };
  }
}

export class CreateSiteSectionUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: CreateSiteSectionRequestDTO): Promise<{ success: boolean; data: CreateSiteSectionResponseDTO }> {
    // Validation and entity creation using domain errors
    if (!params.sectionKey) throw new InvalidSectionKeyError();
    if (params.sectionKey === 'highlights' && (!('title' in params) || !params.title || !('description' in params) || !params.description)) {
      throw new InvalidHighlightError();
    }
    if (params.sectionKey === 'vagoNow' && (!('title' in params) || !params.title || !('content' in params) || !params.content)) {
      throw new InvalidVagoNowError();
    }
    if (params.sectionKey === 'leadership' && (!('title' in params) || !params.title || !('position' in params) || !params.position)) {
      throw new InvalidLeadershipError();
    }
    const entity = SiteSection.create(params);
    const doc = await this.siteSectionRepository.createSection(entity);
    return { success: true, data: { section: SiteSectionUseCaseMapper.toDTO(doc) } };
  }
}

export class UpdateSiteSectionUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: UpdateSiteSectionRequestDTO): Promise<{ success: boolean; data: UpdateSiteSectionResponseDTO | null }> {
    // Optionally validate update fields here
    const doc = await this.siteSectionRepository.updateSection(params);
    return doc ? { success: true, data: { section: SiteSectionUseCaseMapper.toDTO(doc) } } : { success: false, data: null };
  }
}

export class DeleteSiteSectionUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: DeleteSiteSectionRequestDTO): Promise<{ success: boolean; data: void }> {
    await this.siteSectionRepository.deleteSection(params);
    return { success: true, data: undefined };
  }
}

// Mapper for entity <-> DTO
class SiteSectionUseCaseMapper {
  static toDTO(doc: any): SiteSectionDTO {
    return {
      id: doc._id?.toString?.() || doc.id,
      sectionKey: doc.sectionKey,
      title: doc.title,
      description: doc.description,
      image: doc.image || '',
      link: doc.link || '',
      category: doc.category,
      createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
      updatedAt: doc.updatedAt?.toISOString?.() || doc.updatedAt,
    };
  }
} 