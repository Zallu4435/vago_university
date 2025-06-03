import { ISportsRepository } from "../../../application/sports/repositories/ISportsRepository";
import {
  GetSportsUseCase,
  GetSportByIdUseCase,
  CreateSportUseCase,
  UpdateSportUseCase,
  DeleteSportUseCase,
} from "../../../application/sports/useCases/SportUseCases";
import { SportsRepository } from "../../../infrastructure/repositories/sports/SportsRepository";
import { SportsController } from "../../../presentation/http/sports/SportsController";
import { ISportsController } from "../../../presentation/http/IHttp";

export function getSportsComposer(): ISportsController {
  const sportsRepository: ISportsRepository = new SportsRepository();

  const getSportsUseCase = new GetSportsUseCase(sportsRepository);
  const getSportByIdUseCase = new GetSportByIdUseCase(sportsRepository);
  const createSportUseCase = new CreateSportUseCase(sportsRepository);
  const updateSportUseCase = new UpdateSportUseCase(sportsRepository);
  const deleteSportUseCase = new DeleteSportUseCase(sportsRepository);

  return new SportsController(
    getSportsUseCase,
    getSportByIdUseCase,
    createSportUseCase,
    updateSportUseCase,
    deleteSportUseCase
  );
} 