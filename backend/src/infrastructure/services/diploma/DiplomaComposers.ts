import { IDiplomaRepository } from "../../../application/diploma/repositories/IDiplomaRepository";
import {
  IGetDiplomasUseCase,
  IGetDiplomaByIdUseCase,
  ICreateDiplomaUseCase,
  IUpdateDiplomaUseCase,
  IDeleteDiplomaUseCase,
  IEnrollStudentUseCase,
  GetDiplomasUseCase,
  GetDiplomaByIdUseCase,
  CreateDiplomaUseCase,
  UpdateDiplomaUseCase,
  DeleteDiplomaUseCase,
  EnrollStudentUseCase
} from "../../../application/diploma/useCases/DiplomaUseCases";
import { DiplomaRepository } from "../../../infrastructure/repositories/diploma/DiplomaRepository";
import { DiplomaController } from "../../../presentation/http/diploma/DiplomaController";
import { IDiplomaController } from "../../../presentation/http/IHttp";

export function getDiplomaComposer(): IDiplomaController {
  const diplomaRepository: IDiplomaRepository = new DiplomaRepository();

  const getDiplomasUseCase: IGetDiplomasUseCase = new GetDiplomasUseCase(diplomaRepository);
  const getDiplomaByIdUseCase: IGetDiplomaByIdUseCase = new GetDiplomaByIdUseCase(diplomaRepository);
  const createDiplomaUseCase: ICreateDiplomaUseCase = new CreateDiplomaUseCase(diplomaRepository);
  const updateDiplomaUseCase: IUpdateDiplomaUseCase = new UpdateDiplomaUseCase(diplomaRepository);
  const deleteDiplomaUseCase: IDeleteDiplomaUseCase = new DeleteDiplomaUseCase(diplomaRepository);
  const enrollStudentUseCase: IEnrollStudentUseCase = new EnrollStudentUseCase(diplomaRepository);

  return new DiplomaController(
    getDiplomasUseCase,
    getDiplomaByIdUseCase,
    createDiplomaUseCase,
    updateDiplomaUseCase,
    deleteDiplomaUseCase,
    enrollStudentUseCase
  );
} 