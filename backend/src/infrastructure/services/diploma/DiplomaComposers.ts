import { IDiplomaRepository } from "../../../application/diploma/repositories/IDiplomaRepository";
import {
  GetDiplomasUseCase,
  GetDiplomaByIdUseCase,
  CreateDiplomaUseCase,
  UpdateDiplomaUseCase,
  DeleteDiplomaUseCase,
} from "../../../application/diploma/useCases/DiplomaUseCases";
import { DiplomaRepository } from "../../../infrastructure/repositories/diploma/DiplomaRepository";
import { DiplomaController } from "../../../presentation/http/diploma/DiplomaController";
import { IDiplomaController } from "../../../presentation/http/IHttp";

export function getDiplomaComposer(): IDiplomaController {
  const diplomaRepository: IDiplomaRepository = new DiplomaRepository();

  const getDiplomasUseCase = new GetDiplomasUseCase(diplomaRepository);
  const getDiplomaByIdUseCase = new GetDiplomaByIdUseCase(diplomaRepository);
  const createDiplomaUseCase = new CreateDiplomaUseCase(diplomaRepository);
  const updateDiplomaUseCase = new UpdateDiplomaUseCase(diplomaRepository);
  const deleteDiplomaUseCase = new DeleteDiplomaUseCase(diplomaRepository);

  return new DiplomaController(
    getDiplomasUseCase,
    getDiplomaByIdUseCase,
    createDiplomaUseCase,
    updateDiplomaUseCase,
    deleteDiplomaUseCase
  );
} 