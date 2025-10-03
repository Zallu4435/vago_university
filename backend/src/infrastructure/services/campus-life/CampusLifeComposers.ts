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
import {
  IGetCampusLifeOverviewUseCase,
  IGetEventsUseCase,
  IGetEventByIdUseCase,
  IGetSportsUseCase,
  IGetSportByIdUseCase,
  IGetClubsUseCase,
  IGetClubByIdUseCase,
  IJoinClubUseCase,
  IJoinSportUseCase,
  IJoinEventUseCase,
} from "../../../application/campus-life/useCases/ICampusLifeUseCases";
import { CampusLifeRepository} from "../../../infrastructure/repositories/campus-life/CampusLifeRepository"; 
import { CampusLifeController } from "../../../presentation/http/campus-life/CampusLifeController";
import { ICampusLifeController } from "../../../presentation/http/IHttp";

export function getCampusLifeComposer(): ICampusLifeController {
  const campusLifeRepository: ICampusLifeRepository = new CampusLifeRepository();

  const getCampusLifeOverviewUseCase: IGetCampusLifeOverviewUseCase = new GetCampusLifeOverviewUseCase(campusLifeRepository);
  const getEventsUseCase: IGetEventsUseCase = new GetEventsUseCase(campusLifeRepository);
  const getEventByIdUseCase: IGetEventByIdUseCase = new GetEventByIdUseCase(campusLifeRepository);
  const getSportsUseCase: IGetSportsUseCase = new GetSportsUseCase(campusLifeRepository);
  const getSportByIdUseCase: IGetSportByIdUseCase = new GetSportByIdUseCase(campusLifeRepository);
  const getClubsUseCase: IGetClubsUseCase = new GetClubsUseCase(campusLifeRepository);
  const getClubByIdUseCase: IGetClubByIdUseCase = new GetClubByIdUseCase(campusLifeRepository);
  const joinClubUseCase: IJoinClubUseCase = new JoinClubUseCase(campusLifeRepository);
  const joinSportUseCase: IJoinSportUseCase = new JoinSportUseCase(campusLifeRepository);
  const joinEventUseCase: IJoinEventUseCase = new JoinEventUseCase(campusLifeRepository);

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