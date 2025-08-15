import { IUserSiteSectionRepository } from "../../../application/site-management/repositories/IUserSiteSectionRepository";
import { GetUserSiteSectionsUseCase } from "../../../application/site-management/useCases/UserSiteSectionUseCases";
import { UserSiteSectionController } from "../../../presentation/http/site-management/UserSiteSectionController";
import { UserSiteSectionRepository } from "../../repositories/site-management/UserSiteSectionRepository";

export function getUserSiteSectionsComposer(): UserSiteSectionController {
  const repository: IUserSiteSectionRepository = new UserSiteSectionRepository();
  const getUserSiteSectionsUseCase = new GetUserSiteSectionsUseCase(repository);
  
  return new UserSiteSectionController(getUserSiteSectionsUseCase);
} 