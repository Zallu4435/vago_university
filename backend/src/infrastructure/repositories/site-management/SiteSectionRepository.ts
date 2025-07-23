import { SiteSectionModel } from '../../database/mongoose/models/site-management/SiteSectionModel';
import { ISiteSectionRepository } from '../../../application/site-management/repositories/ISiteSectionRepository';
import {
  GetSiteSectionsRequestDTO,
  GetSiteSectionByIdRequestDTO,
  CreateSiteSectionRequestDTO,
  UpdateSiteSectionRequestDTO,
  DeleteSiteSectionRequestDTO,
} from '../../../domain/site-management/dtos/SiteSectionDTOs';


export class SiteSectionRepository implements ISiteSectionRepository {
  async getSections(query: any): Promise<any[]> {
    return SiteSectionModel.find(query).lean();
  }

  async getSectionById(params: GetSiteSectionByIdRequestDTO): Promise<any | null> {
    return SiteSectionModel.findById(params.id).lean();
  }

  async createSection(params: CreateSiteSectionRequestDTO): Promise<any> {
    const createData = (params as any)?._props ? { ...(params as any)._props } : params;
    const { id, ...finalData } = createData;
    return SiteSectionModel.create(finalData);
  }

  async updateSection(params: UpdateSiteSectionRequestDTO): Promise<any | null> {
    const { id, ...updateData } = params;
    return SiteSectionModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  async deleteSection(params: DeleteSiteSectionRequestDTO): Promise<void> {
    await SiteSectionModel.findByIdAndDelete(params.id);
  }
}
