import { IClubsRepository } from "../../../application/clubs/repositories/IClubsRepository";
import { GetClubRequestsUseCase, ApproveClubRequestUseCase, RejectClubRequestUseCase, GetClubRequestDetailsUseCase } from "../../../application/clubs/useCases/ClubRequestUseCases";
import { ClubRequestController } from "../../../presentation/http/clubs/ClubRequestController";
import { ClubsRepository } from "../../repositories/clubs/ClubsRepository";
import { IClubRequestController } from "../../../presentation/http/IHttp";

export function getClubRequestsComposer(): IClubRequestController {
  const repository: IClubsRepository = new ClubsRepository();
  const getClubRequestsUseCase: GetClubRequestsUseCase = new GetClubRequestsUseCase(repository);
  const approveClubRequestUseCase: ApproveClubRequestUseCase = new ApproveClubRequestUseCase(repository);
  const rejectClubRequestUseCase: RejectClubRequestUseCase = new RejectClubRequestUseCase(repository);
  const getClubRequestDetailsUseCase: GetClubRequestDetailsUseCase = new GetClubRequestDetailsUseCase(repository);

  return new ClubRequestController(
    getClubRequestsUseCase,
    approveClubRequestUseCase,
    rejectClubRequestUseCase,
    getClubRequestDetailsUseCase
  );
} 