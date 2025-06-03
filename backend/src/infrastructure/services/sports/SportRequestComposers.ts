import { ISportsRepository } from "../../../application/sports/repositories/ISportsRepository";
import {
  GetSportRequestsUseCase,
  ApproveSportRequestUseCase,
  RejectSportRequestUseCase,
  GetSportRequestDetailsUseCase,
  JoinSportUseCase,
} from "../../../application/sports/useCases/SportRequestUseCases";
import { SportsRepository } from "../../../infrastructure/repositories/sports/SportsRepository";
import { SportRequestController } from "../../../presentation/http/sports/SportRequestController";
import { ISportRequestController } from "../../../presentation/http/IHttp";

export function getSportRequestsComposer(): ISportRequestController {
  const sportsRepository: ISportsRepository = new SportsRepository();

  const getSportRequestsUseCase = new GetSportRequestsUseCase(sportsRepository);
  const approveSportRequestUseCase = new ApproveSportRequestUseCase(sportsRepository);
  const rejectSportRequestUseCase = new RejectSportRequestUseCase(sportsRepository);
  const getSportRequestDetailsUseCase = new GetSportRequestDetailsUseCase(sportsRepository);
  const joinSportUseCase = new JoinSportUseCase(sportsRepository);

  return new SportRequestController(
    getSportRequestsUseCase,
    approveSportRequestUseCase,
    rejectSportRequestUseCase,
    getSportRequestDetailsUseCase,
    joinSportUseCase
  );
} 