import {
  GetCampusLifeOverviewRequestDTO,
  GetEventsRequestDTO,
  GetEventByIdRequestDTO,
  GetSportsRequestDTO,
  GetSportByIdRequestDTO,
  GetClubsRequestDTO,
  GetClubByIdRequestDTO,
  JoinClubRequestDTO,
  JoinSportRequestDTO,
  JoinEventRequestDTO,
  CampusLifeOverviewResponseDTO,
  GetEventsResponseDTO,
  GetEventByIdResponseDTO,
  GetSportsResponseDTO,
  GetSportByIdResponseDTO,
  GetClubsResponseDTO,
  GetClubByIdResponseDTO,
  JoinClubResponseDTO,
  JoinSportResponseDTO,
  JoinEventResponseDTO,
} from "../../../domain/campus-life/dtos/CampusLifeDTOs";

export interface ICampusLifeRepository {
  getCampusLifeOverview(params: GetCampusLifeOverviewRequestDTO): Promise<CampusLifeOverviewResponseDTO>;
  getEvents(params: GetEventsRequestDTO): Promise<GetEventsResponseDTO>;
  getEventById(params: GetEventByIdRequestDTO): Promise<GetEventByIdResponseDTO | null>;
  getSports(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO>;
  getSportById(params: GetSportByIdRequestDTO): Promise<GetSportByIdResponseDTO | null>;
  getClubs(params: GetClubsRequestDTO): Promise<GetClubsResponseDTO>;
  getClubById(params: GetClubByIdRequestDTO): Promise<GetClubByIdResponseDTO | null>;
  joinClub(params: JoinClubRequestDTO): Promise<JoinClubResponseDTO>;
  joinSport(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO>;
  joinEvent(params: JoinEventRequestDTO): Promise<JoinEventResponseDTO>;
}