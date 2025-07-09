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

    return this.httpSuccess.success_200(result);
  }

  async getSportById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const sport = await this.getSportByIdUseCase.execute({ id });
    return this.httpSuccess.success_200(sport);
  }

  async createSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const sportData = httpRequest.body;
    const sport = await this.createSportUseCase.execute(sportData);
    return this.httpSuccess.success_201(sport);
  }

  async updateSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const sportData = httpRequest.body;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const sport = await this.updateSportUseCase.execute({ id, ...sportData });
    return this.httpSuccess.success_200(sport);
  }

  async deleteSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const result = await this.deleteSportUseCase.execute({ id });
    return this.httpSuccess.success_200(result);
  }
} 