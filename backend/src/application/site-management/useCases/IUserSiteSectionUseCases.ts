import { GetUserSiteSectionsRequestDTO, GetUserSiteSectionsResponseDTO } from "../../../domain/site-management/dtos/UserSiteSectionDTOs";

export interface IGetUserSiteSectionsUseCase {
  execute(params: GetUserSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetUserSiteSectionsResponseDTO }>;
}
