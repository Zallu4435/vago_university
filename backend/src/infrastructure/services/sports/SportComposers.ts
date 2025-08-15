import { ISportsRepository } from "../../../application/sports/repositories/ISportsRepository";
import {
  GetSportsUseCase,
  GetSportByIdUseCase,
  CreateSportUseCase,
  UpdateSportUseCase,
  DeleteSportUseCase,
  IGetSportsUseCase,
  IGetSportByIdUseCase,
  ICreateSportUseCase,
  IUpdateSportUseCase,
  IDeleteSportUseCase,
} from "../../../application/sports/useCases/SportUseCases";
import { SportsRepository } from "../../../infrastructure/repositories/sports/SportsRepository";
import { SportsController } from "../../../presentation/http/sports/SportsController";
import { ISportsController } from "../../../presentation/http/IHttp";

export function getSportsComposer(): ISportsController {
  const sportsRepository: ISportsRepository = new SportsRepository();

  const getSportsUseCase: IGetSportsUseCase = new GetSportsUseCase(sportsRepository);
  const getSportByIdUseCase: IGetSportByIdUseCase = new GetSportByIdUseCase(sportsRepository);
  const createSportUseCase: ICreateSportUseCase = new CreateSportUseCase(sportsRepository);
  const updateSportUseCase: IUpdateSportUseCase = new UpdateSportUseCase(sportsRepository);
  const deleteSportUseCase: IDeleteSportUseCase = new DeleteSportUseCase(sportsRepository);

  return new SportsController(
    getSportsUseCase,
    getSportByIdUseCase,
    createSportUseCase,
    updateSportUseCase,
    deleteSportUseCase
  );
} 