import { SiteSectionModel } from '../../database/mongoose/site-management/SiteSectionModel';
import { ISiteSectionRepository } from '../../../application/site-management/repositories/ISiteSectionRepository';
import { CreateSiteSectionRequest, DeleteSiteSectionRequest, UpdateSiteSectionRequest } from '../../../domain/site-management/entities/SiteSection';
import { SiteSectionFilter } from '../../../domain/site-management/entities/SiteSectionTypes';


export class SiteSectionRepository implements ISiteSectionRepository {
  async getSections(query: SiteSectionFilter) {
    return SiteSectionModel.find(query).lean();
  }

  async getSectionById(id: string) {
    return SiteSectionModel.findById(id).lean();
  }

  async createSection(params: CreateSiteSectionRequest) {
    return SiteSectionModel.create(params);
  }

  async updateSection(params: UpdateSiteSectionRequest) {
    const { id, ...updateData } = params;
    return SiteSectionModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  async deleteSection(params: DeleteSiteSectionRequest) {
    await SiteSectionModel.findByIdAndDelete(params.id);
  }
}
