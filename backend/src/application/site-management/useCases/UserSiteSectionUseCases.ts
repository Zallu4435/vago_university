import { GetUserSiteSectionsRequestDTO, GetUserSiteSectionsResponseDTO } from "../../../domain/site-management/dtos/UserSiteSectionDTOs";
import { IUserSiteSectionRepository } from "../repositories/IUserSiteSectionRepository";

export interface IGetUserSiteSectionsUseCase {
  execute(params: GetUserSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetUserSiteSectionsResponseDTO }>;
}

export class GetUserSiteSectionsUseCase implements IGetUserSiteSectionsUseCase {
  constructor(private readonly userSiteSectionRepository: IUserSiteSectionRepository) {}

  async execute(params: GetUserSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetUserSiteSectionsResponseDTO }> {
    try {
      const data = await this.userSiteSectionRepository.getUserSections(params);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        data: { sections: [], total: 0, page: 1, limit: 10, totalPages: 1 } 
      };
    }
  }
} 