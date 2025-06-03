import {
  IGetSportsUseCase,
  IGetSportByIdUseCase,
  ICreateSportUseCase,
  IUpdateSportUseCase,
  IDeleteSportUseCase,
} from "../../../application/sports/useCases/SportUseCases";
import { ISportsController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";

export class SportsController implements ISportsController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private readonly getSportsUseCase: IGetSportsUseCase,
    private readonly getSportByIdUseCase: IGetSportByIdUseCase,
    private readonly createSportUseCase: ICreateSportUseCase,
    private readonly updateSportUseCase: IUpdateSportUseCase,
    private readonly deleteSportUseCase: IDeleteSportUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getSports(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "10", sportType = "all", status = "all", coach = "all" } = httpRequest.query;

      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) < 1 ||
        Number(limit) < 1
      ) {
        return this.httpErrors.error_400();
      }

      const result = await this.getSportsUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        sportType: String(sportType),
        status: String(status),
        coach: String(coach),
      });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`Error in getSports:`, err);
      return this.httpErrors.error_400();
    }
  }

  async getSportById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.path;

      if (!id) {
        return this.httpErrors.error_400();
      }

      const sport = await this.getSportByIdUseCase.execute({ id });
      if (!sport) {
        return this.httpErrors.error_404();
      }

      return this.httpSuccess.success_200(sport);
    } catch (err) {
      console.error(`Error in getSportById:`, err);
      return this.httpErrors.error_500();
    }
  }

  async createSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const sportData = httpRequest.body;
      const sport = await this.createSportUseCase.execute(sportData);
      return this.httpSuccess.success_201(sport);
    } catch (err) {
      console.error(`Error in createSport:`, err);
      return this.httpErrors.error_400();
    }
  }

  async updateSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.path;
      const sportData = httpRequest.body;

      if (!id) {
        return this.httpErrors.error_400();
      }

      const sport = await this.updateSportUseCase.execute({ id, ...sportData });
      if (!sport) {
        return this.httpErrors.error_404();
      }

      return this.httpSuccess.success_200(sport);
    } catch (err) {
      console.error(`Error in updateSport:`, err);
      return this.httpErrors.error_400();
    }
  }

  async deleteSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.path;

      if (!id) {
        return this.httpErrors.error_400();
      }

      await this.deleteSportUseCase.execute({ id });
      return this.httpSuccess.success_200({ message: "Sport deleted successfully" });
    } catch (err) {
      console.error(`Error in deleteSport:`, err);
      return this.httpErrors.error_400();
    }
  }
} 