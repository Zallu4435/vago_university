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
    const { sectionKey, page = 1, limit = 10, search, category, dateRange, startDate, endDate, status } = params;
    const query: any = {};
    
    // Section key filter
    if (sectionKey) query.sectionKey = sectionKey;
    
    // Search functionality
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }
    
    // Category filter (case-insensitive)
    if (category && category !== 'all' && category !== 'All Categories') {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }
    
    // Status filter (for active/inactive sections)
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }
    
    // Date range filtering
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDateFilter: Date;
      let endDateFilter: Date;

      switch (dateRange) {
        case 'last_week':
          startDateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDateFilter = now;
          break;
        case 'last_month':
          startDateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDateFilter = now;
          break;
        case 'last_3_months':
          startDateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          endDateFilter = now;
          break;
        case 'custom':
          if (startDate && endDate) {
            startDateFilter = new Date(startDate);
            endDateFilter = new Date(endDate);
            // Set end date to end of day
            endDateFilter.setHours(23, 59, 59, 999);
          } else {
            startDateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            endDateFilter = now;
          }
          break;
        default:
          startDateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDateFilter = now;
      }

      query.createdAt = {
        $gte: startDateFilter,
        $lte: endDateFilter
      };
    }
    
    // Debug: Log the query object
    console.log('[SiteSectionUseCase] Query:', JSON.stringify(query, null, 2));
    const skip = (page - 1) * limit;
    const allDocs: any[] = await this.siteSectionRepository.getSections(query);
    // Debug: Log the number of results and a sample of the data
    console.log(`[SiteSectionUseCase] Results: ${allDocs.length}`);
    if (allDocs.length > 0) {
      console.log('[SiteSectionUseCase] Sample result:', allDocs[0]);
    }
    // Debug: Log all unique categories
    const allCategories = Array.from(new Set(allDocs.map(doc => doc.category).filter(Boolean)));
    console.log('[SiteSectionUseCase] Unique categories in DB:', allCategories);
    
    // Sort by createdAt in descending order (newest first)
    const sortedDocs = allDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const total = sortedDocs.length;
    const pagedDocs = sortedDocs.slice(skip, skip + limit);
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