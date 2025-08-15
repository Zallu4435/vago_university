import { ISiteSectionRepository } from "../../../application/site-management/repositories/ISiteSectionRepository";
import { 
  GetSiteSectionsUseCase, 
  GetSiteSectionByIdUseCase, 
  CreateSiteSectionUseCase, 
  UpdateSiteSectionUseCase, 
  DeleteSiteSectionUseCase 
} from "../../../application/site-management/useCases/SiteSectionUseCases";
import { SiteSectionController } from "../../../presentation/http/site-management/SiteSectionController";
import { SiteSectionRepository } from "../../repositories/site-management/SiteSectionRepository";

export function getSiteSectionsComposer(): SiteSectionController {
  const repository: ISiteSectionRepository = new SiteSectionRepository();
  const getSiteSectionsUseCase = new GetSiteSectionsUseCase(repository);
  const getSiteSectionByIdUseCase = new GetSiteSectionByIdUseCase(repository);
  const createSiteSectionUseCase = new CreateSiteSectionUseCase(repository);
  const updateSiteSectionUseCase = new UpdateSiteSectionUseCase(repository);
  const deleteSiteSectionUseCase = new DeleteSiteSectionUseCase(repository);
  
  return new SiteSectionController(
    getSiteSectionsUseCase,
    getSiteSectionByIdUseCase,
    createSiteSectionUseCase,
    updateSiteSectionUseCase,
    deleteSiteSectionUseCase
  );
}
