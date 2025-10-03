import { IClubsRepository } from "../../../application/clubs/repositories/IClubsRepository";
import { 
  GetClubsUseCase, 
  GetClubByIdUseCase, 
  CreateClubUseCase, 
  UpdateClubUseCase, 
  DeleteClubUseCase
} from "../../../application/clubs/useCases/ClubUseCases";
import {
  IGetClubsUseCase,
  IGetClubByIdUseCase,
  ICreateClubUseCase,
  IUpdateClubUseCase,
  IDeleteClubUseCase
} from "../../../application/clubs/useCases/IClubUseCases";
import { ClubsController } from "../../../presentation/http/clubs/ClubsController";
import { ClubsRepository } from "../../repositories/clubs/ClubsRepository";
import { IClubsController } from "../../../presentation/http/IHttp";

export function getClubsComposer(): IClubsController {
  const repository: IClubsRepository = new ClubsRepository();
  const getClubsUseCase: IGetClubsUseCase = new GetClubsUseCase(repository);
  const getClubByIdUseCase: IGetClubByIdUseCase = new GetClubByIdUseCase(repository);
  const createClubUseCase: ICreateClubUseCase = new CreateClubUseCase(repository);
  const updateClubUseCase: IUpdateClubUseCase = new UpdateClubUseCase(repository);
  const deleteClubUseCase: IDeleteClubUseCase = new DeleteClubUseCase(repository);

  return new ClubsController(
    getClubsUseCase,
    getClubByIdUseCase,
    createClubUseCase,
    updateClubUseCase,
    deleteClubUseCase
  );
} 