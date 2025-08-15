import { ISportsRepository } from "../../../application/sports/repositories/ISportsRepository";
import {
  GetSportRequestsUseCase,
  ApproveSportRequestUseCase,
  RejectSportRequestUseCase,
  GetSportRequestDetailsUseCase,
  JoinSportUseCase,
  IGetSportRequestsUseCase,
  IApproveSportRequestUseCase,
  IRejectSportRequestUseCase,
  IGetSportRequestDetailsUseCase,
  IJoinSportUseCase,
} from "../../../application/sports/useCases/SportRequestUseCases";
import { SportsRepository } from "../../../infrastructure/repositories/sports/SportsRepository";
import { SportRequestController } from "../../../presentation/http/sports/SportRequestController";
import { ISportRequestController } from "../../../presentation/http/IHttp";

export function getSportRequestsComposer(): ISportRequestController {
  const sportsRepository: ISportsRepository = new SportsRepository();

  const getSportRequestsUseCase: IGetSportRequestsUseCase = new GetSportRequestsUseCase(sportsRepository);
  const approveSportRequestUseCase: IApproveSportRequestUseCase = new ApproveSportRequestUseCase(sportsRepository);
  const rejectSportRequestUseCase: IRejectSportRequestUseCase = new RejectSportRequestUseCase(sportsRepository);
  const getSportRequestDetailsUseCase: IGetSportRequestDetailsUseCase = new GetSportRequestDetailsUseCase(sportsRepository);
  const joinSportUseCase: IJoinSportUseCase = new JoinSportUseCase(sportsRepository);

  return new SportRequestController(
    getSportRequestsUseCase,
    approveSportRequestUseCase,
    rejectSportRequestUseCase,
    getSportRequestDetailsUseCase,
    joinSportUseCase
  );
} 