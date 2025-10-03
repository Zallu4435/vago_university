import { ISiteSectionRepository } from "../../../application/site-management/repositories/ISiteSectionRepository";
import { 
  GetSiteSectionsUseCase, 
  GetSiteSectionByIdUseCase, 
  CreateSiteSectionUseCase, 
  UpdateSiteSectionUseCase, 
  DeleteSiteSectionUseCase 
} from "../../../application/site-management/useCases/SiteSectionUseCases";
import { IGetSiteSectionsUseCase, IGetSiteSectionByIdUseCase, ICreateSiteSectionUseCase, IUpdateSiteSectionUseCase, IDeleteSiteSectionUseCase } from "../../../application/site-management/useCases/ISiteSectionUseCases";
import { SiteSectionController } from "../../../presentation/http/site-management/SiteSectionController";
import { SiteSectionRepository } from "../../repositories/site-management/SiteSectionRepository";

export function getSiteSectionsComposer(): SiteSectionController {
  const repository: ISiteSectionRepository = new SiteSectionRepository();
  const getSiteSectionsUseCase: IGetSiteSectionsUseCase = new GetSiteSectionsUseCase(repository);
  const getSiteSectionByIdUseCase: IGetSiteSectionByIdUseCase = new GetSiteSectionByIdUseCase(repository);
  const createSiteSectionUseCase: ICreateSiteSectionUseCase = new CreateSiteSectionUseCase(repository);
  const updateSiteSectionUseCase: IUpdateSiteSectionUseCase = new UpdateSiteSectionUseCase(repository);
  const deleteSiteSectionUseCase: IDeleteSiteSectionUseCase = new DeleteSiteSectionUseCase(repository);
  
  return new SiteSectionController(
    getSiteSectionsUseCase,
    getSiteSectionByIdUseCase,
    createSiteSectionUseCase,
    updateSiteSectionUseCase,
    deleteSiteSectionUseCase
  );
}
