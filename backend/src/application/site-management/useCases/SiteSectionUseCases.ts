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
import { CreateSiteSectionRequest, DeleteSiteSectionRequest, SiteSectionFilter, UpdateSiteSectionRequest } from '../../../domain/site-management/entities/SiteSection';
import { InvalidSectionKeyError, InvalidHighlightError, InvalidVagoNowError, InvalidLeadershipError } from '../../../domain/site-management/errors/SiteSectionErrors';
import { ICreateSiteSectionUseCase, IDeleteSiteSectionUseCase, IGetSiteSectionByIdUseCase, IGetSiteSectionsUseCase, IUpdateSiteSectionUseCase } from './ISiteSectionUseCases';
 
export class GetSiteSectionsUseCase implements IGetSiteSectionsUseCase {
  constructor(private readonly _siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: GetSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetSiteSectionsResponseDTO }> {
    const { sectionKey, page = 1, limit = 10, search, category, dateRange, startDate, endDate, status } = params;
    const query: SiteSectionFilter = {};
    
    if (sectionKey) query.sectionKey = sectionKey;
    
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }
    
    if (category && category !== 'all' && category !== 'All Categories') {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }
    
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }
    
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
    
    const skip = (page - 1) * limit;
    const allDocs = await this._siteSectionRepository.getSections(query);
    
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

export class GetSiteSectionByIdUseCase implements IGetSiteSectionByIdUseCase {
  constructor(private readonly _siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: GetSiteSectionByIdRequestDTO): Promise<{ success: boolean; data: GetSiteSectionByIdResponseDTO | null }> {
    const doc = await this._siteSectionRepository.getSectionById(params.id);
    return doc ? { success: true, data: { section: SiteSectionUseCaseMapper.toDTO(doc) } } : { success: false, data: null };
  }
}

export class CreateSiteSectionUseCase implements ICreateSiteSectionUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: CreateSiteSectionRequestDTO): Promise<{ success: boolean; data: CreateSiteSectionResponseDTO }> {
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
    const doc = await this.siteSectionRepository.createSection(params as CreateSiteSectionRequest);
    return { success: true, data: { section: SiteSectionUseCaseMapper.toDTO(doc) } };
  }
}

export class UpdateSiteSectionUseCase implements IUpdateSiteSectionUseCase {
  constructor(private readonly _siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: UpdateSiteSectionRequestDTO): Promise<{ success: boolean; data: UpdateSiteSectionResponseDTO | null }> {
    const doc = await this._siteSectionRepository.updateSection(params as UpdateSiteSectionRequest);
    return doc ? { success: true, data: { section: SiteSectionUseCaseMapper.toDTO(doc) } } : { success: false, data: null };
  }
}

export class DeleteSiteSectionUseCase implements IDeleteSiteSectionUseCase {
  constructor(private readonly _siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: DeleteSiteSectionRequestDTO): Promise<{ success: boolean; data: void }> {
    await this._siteSectionRepository.deleteSection(params as DeleteSiteSectionRequest);
    return { success: true, data: undefined };
  }
}

class SiteSectionUseCaseMapper {
  static toDTO(doc): SiteSectionDTO {
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