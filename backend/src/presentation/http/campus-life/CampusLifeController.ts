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
} from "../../../application/campus-life/useCases/CampusLifeUseCases";
import { IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../../http/IHttp";
import { ICampusLifeController } from "../../http/IHttp";

export class CampusLifeController implements ICampusLifeController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private readonly getCampusLifeOverviewUseCase: IGetCampusLifeOverviewUseCase,
    private readonly getEventsUseCase: IGetEventsUseCase,
    private readonly getEventByIdUseCase: IGetEventByIdUseCase,
    private readonly getSportsUseCase: IGetSportsUseCase,
    private readonly getSportByIdUseCase: IGetSportByIdUseCase,
    private readonly getClubsUseCase: IGetClubsUseCase,
    private readonly getClubByIdUseCase: IGetClubByIdUseCase,
    private readonly joinClubUseCase: IJoinClubUseCase,
    private readonly joinSportUseCase: IJoinSportUseCase,
    private readonly joinEventUseCase: IJoinEventUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getCampusLifeOverview(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const result = await this.getCampusLifeOverviewUseCase.execute({});
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getCampusLifeOverview:`, err);
      return this.httpErrors.error_500();
    }
  }

  async getEvents(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "10", search = "", status = "all" } = httpRequest.query;
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const result = await this.getEventsUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: String(status) as "upcoming" | "past" | "all",
        userId: httpRequest.user.id,
      });
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getEvents:`, err);
      return this.httpErrors.error_500();
    }
  }

  async getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { eventId } = httpRequest.params;
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      if (httpRequest.user.collection !== "admin") {
        return this.httpErrors.error_403();
      }
      const result = await this.getEventByIdUseCase.execute({ eventId });
      if (!result.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getEventById:`, err);
      return this.httpErrors.error_500();
    }
  }

  async getSports(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { type, search = "" } = httpRequest.query;
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const result = await this.getSportsUseCase.execute({
        type: type ? String(type) as "VARSITY SPORTS" | "INTRAMURAL SPORTS" : undefined,
        search: String(search),
        userId: httpRequest.user.id,
      });
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getSports:`, err);
      return this.httpErrors.error_500();
    }
  }

  async getSportById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { sportId } = httpRequest.params;
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const result = await this.getSportByIdUseCase.execute({ sportId });
      if (!result.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getSportById:`, err);
      return this.httpErrors.error_500();
    }
  }

  async getClubs(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { search = "", type, status = "all" } = httpRequest.query;
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const result = await this.getClubsUseCase.execute({
        search: String(search),
        type: type ? String(type) : undefined,
        status: String(status) as "active" | "inactive" | "all",
        userId: httpRequest.user.id,
      });
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getClubs:`, err);
      return this.httpErrors.error_500();
    }
  }

  async getClubById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { clubId } = httpRequest.params;
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const result = await this.getClubByIdUseCase.execute({ clubId });
      if (!result.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getClubById:`, err);
      return this.httpErrors.error_500();
    }
  }

  async joinClub(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { clubId } = httpRequest.params;
      const { reason, additionalInfo } = httpRequest.body;
      const studentId = httpRequest.user?.id;
      if (!httpRequest.user || !studentId) {
        return this.httpErrors.error_401();
      }
      const result = await this.joinClubUseCase.execute({
        clubId,
        studentId,
        reason,
        additionalInfo,
      });
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in joinClub:`, err);
      return this.httpErrors.error_500();
    }
  }

  async joinSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { sportId } = httpRequest.params;
      const { reason, additionalInfo } = httpRequest.body;
      const studentId = httpRequest.user?.id;
      if (!httpRequest.user || !studentId) {
        return this.httpErrors.error_401();
      }
      const result = await this.joinSportUseCase.execute({
        sportId,
        studentId,
        reason,
        additionalInfo,
      });
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in joinSport:`, err);
      return this.httpErrors.error_500();
    }
  }

  async joinEvent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { eventId } = httpRequest.params;
      const { reason, additionalInfo } = httpRequest.body;
      const studentId = httpRequest.user?.id;
      if (!httpRequest.user || !studentId) {
        return this.httpErrors.error_401();
      }
      const result = await this.joinEventUseCase.execute({
        eventId,
        studentId,
        reason,
        additionalInfo,
      });
      if (!result.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in joinEvent:`, err);
      return this.httpErrors.error_500();
    }
  }
}