import { IClubsRepository } from "../../../application/clubs/repositories/IClubsRepository";
import { 
  GetClubRequestsUseCase, 
  ApproveClubRequestUseCase, 
  RejectClubRequestUseCase, 
  GetClubRequestDetailsUseCase,
    IGetClubRequestsUseCase,
    IApproveClubRequestUseCase,
    IRejectClubRequestUseCase,
    IGetClubRequestDetailsUseCase
} from "../../../application/clubs/useCases/ClubRequestUseCases";
import { ClubRequestController } from "../../../presentation/http/clubs/ClubRequestController";
import { ClubsRepository } from "../../repositories/clubs/ClubsRepository";
import { IClubRequestController } from "../../../presentation/http/IHttp";

export function getClubRequestsComposer(): IClubRequestController {
  const repository: IClubsRepository = new ClubsRepository();
  const getClubRequestsUseCase: IGetClubRequestsUseCase = new GetClubRequestsUseCase(repository);
  const approveClubRequestUseCase: IApproveClubRequestUseCase = new ApproveClubRequestUseCase(repository);
  const rejectClubRequestUseCase: IRejectClubRequestUseCase = new RejectClubRequestUseCase(repository);
  const getClubRequestDetailsUseCase: IGetClubRequestDetailsUseCase = new GetClubRequestDetailsUseCase(repository);

  return new ClubRequestController(
    getClubRequestsUseCase,
    approveClubRequestUseCase,
    rejectClubRequestUseCase,
    getClubRequestDetailsUseCase
  );
} 