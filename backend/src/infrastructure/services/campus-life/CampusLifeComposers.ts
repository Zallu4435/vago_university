import { ICampusLifeRepository } from "../../../application/campus-life/repositories/ICampusLifeRepository";
import {
  GetCampusLifeOverviewUseCase,
  GetEventsUseCase,
  GetEventByIdUseCase,
  GetSportsUseCase,
  GetSportByIdUseCase,
  GetClubsUseCase,
  GetClubByIdUseCase,
  JoinClubUseCase,
  JoinSportUseCase,
  JoinEventUseCase,
} from "../../../application/campus-life/useCases/CampusLifeUseCases";
import { CampusLifeRepository} from "../../../infrastructure/repositories/campus-life/CampusLifeRepository"; 
import { CampusLifeController } from "../../../presentation/http/campus-life/CampusLifeController";
import { ICampusLifeController } from "../../../presentation/http/IHttp";

export function getCampusLifeComposer(): ICampusLifeController {
  const campusLifeRepository: ICampusLifeRepository = new CampusLifeRepository();

  const getCampusLifeOverviewUseCase = new GetCampusLifeOverviewUseCase(campusLifeRepository);
  const getEventsUseCase = new GetEventsUseCase(campusLifeRepository);
  const getEventByIdUseCase = new GetEventByIdUseCase(campusLifeRepository);
  const getSportsUseCase = new GetSportsUseCase(campusLifeRepository);
  const getSportByIdUseCase = new GetSportByIdUseCase(campusLifeRepository);
  const getClubsUseCase = new GetClubsUseCase(campusLifeRepository);
  const getClubByIdUseCase = new GetClubByIdUseCase(campusLifeRepository);
  const joinClubUseCase = new JoinClubUseCase(campusLifeRepository);
  const joinSportUseCase = new JoinSportUseCase(campusLifeRepository);
  const joinEventUseCase = new JoinEventUseCase(campusLifeRepository);

  return new CampusLifeController(
    getCampusLifeOverviewUseCase,
    getEventsUseCase,
    getEventByIdUseCase,
    getSportsUseCase,
    getSportByIdUseCase,
    getClubsUseCase,
    getClubByIdUseCase,
    joinClubUseCase,
    joinSportUseCase,
    joinEventUseCase
  );
}