import { SiteSectionModel } from '../../database/mongoose/models/site-management/SiteSectionModel';
import { ISiteSectionRepository } from '../../../application/site-management/repositories/ISiteSectionRepository';
import {
  GetSiteSectionsRequestDTO,
  GetSiteSectionByIdRequestDTO,
  CreateSiteSectionRequestDTO,
  UpdateSiteSectionRequestDTO,
  DeleteSiteSectionRequestDTO,
} from '../../../domain/site-management/dtos/SiteSectionDTOs';
import {
  GetSiteSectionsResponseDTO,
  GetSiteSectionByIdResponseDTO,
  CreateSiteSectionResponseDTO,
  UpdateSiteSectionResponseDTO,
  SiteSectionDTO,
} from '../../../domain/site-management/dtos/SiteSectionDTOs';

function toDTO(doc: any): SiteSectionDTO {
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

export class SiteSectionRepository implements ISiteSectionRepository {
  async getSections(params: GetSiteSectionsRequestDTO): Promise<GetSiteSectionsResponseDTO> {
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
    const [docs, total] = await Promise.all([
      SiteSectionModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      SiteSectionModel.countDocuments(query),
    ]);

    return {
      sections: docs.map(toDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSectionById(params: GetSiteSectionByIdRequestDTO): Promise<GetSiteSectionByIdResponseDTO | null> {
    const doc = await SiteSectionModel.findById(params.id).lean();
    return doc ? { section: toDTO(doc) } : null;
  }

  async createSection(params: CreateSiteSectionRequestDTO): Promise<CreateSiteSectionResponseDTO> {
    const doc = await SiteSectionModel.create(params);
    return { section: toDTO(doc) };
  }

  async updateSection(params: UpdateSiteSectionRequestDTO): Promise<UpdateSiteSectionResponseDTO | null> {
    const { id, ...updateData } = params;
    const doc = await SiteSectionModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return doc ? { section: toDTO(doc) } : null;
  }

  async deleteSection(params: DeleteSiteSectionRequestDTO): Promise<void> {
    await SiteSectionModel.findByIdAndDelete(params.id);
  }
}
