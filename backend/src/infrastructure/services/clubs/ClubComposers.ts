import { IClubsRepository } from "../../../application/clubs/repositories/IClubsRepository";
import { GetClubsUseCase, GetClubByIdUseCase, CreateClubUseCase, UpdateClubUseCase, DeleteClubUseCase } from "../../../application/clubs/useCases/ClubUseCases";
import { ClubsController } from "../../../presentation/http/clubs/ClubsController";
import { ClubsRepository } from "../../repositories/clubs/ClubsRepository";
import { IClubsController } from "../../../presentation/http/IHttp";

export function getClubsComposer(): IClubsController {
  const repository: IClubsRepository = new ClubsRepository();
  const getClubsUseCase: GetClubsUseCase = new GetClubsUseCase(repository);
  const getClubByIdUseCase: GetClubByIdUseCase = new GetClubByIdUseCase(repository);
  const createClubUseCase: CreateClubUseCase = new CreateClubUseCase(repository);
  const updateClubUseCase: UpdateClubUseCase = new UpdateClubUseCase(repository);
  const deleteClubUseCase: DeleteClubUseCase = new DeleteClubUseCase(repository);

  return new ClubsController(
    getClubsUseCase,
    getClubByIdUseCase,
    createClubUseCase,
    updateClubUseCase,
    deleteClubUseCase
  );
} 