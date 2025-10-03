import {
  IGetSportsUseCase,
  IGetSportByIdUseCase,
  ICreateSportUseCase,
  IUpdateSportUseCase,
  IDeleteSportUseCase,
} from "../../../application/sports/useCases/ISportUseCases";
import { ISportsController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";

export class SportsController implements ISportsController {
  private _httpSuccess: HttpSuccess;
  private _httpErrors: HttpErrors;

  constructor(
    private readonly _getSportsUseCase: IGetSportsUseCase,
    private readonly _getSportByIdUseCase: IGetSportByIdUseCase,
    private readonly _createSportUseCase: ICreateSportUseCase,
    private readonly _updateSportUseCase: IUpdateSportUseCase,
    private readonly _deleteSportUseCase: IDeleteSportUseCase
  ) {
    this._httpSuccess = new HttpSuccess();
    this._httpErrors = new HttpErrors();
  }

  async getSports(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", sportType = "all", status = "all", coach = "all", startDate, endDate, search } = httpRequest.query;

    if (
      isNaN(Number(page)) ||
      isNaN(Number(limit)) ||
      Number(page) < 1 ||
      Number(limit) < 1
    ) {
      return this._httpErrors.error_400();
    }

    const result = await this._getSportsUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      sportType: String(sportType),
      status: String(status),
      coach: String(coach),
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      search: search ? String(search) : undefined,
    });

    return this._httpSuccess.success_200(result);
  }

  async getSportById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const sport = await this._getSportByIdUseCase.execute({ id });
    return this._httpSuccess.success_200(sport);
  }

  async createSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const sportData = httpRequest.body;
    const sport = await this._createSportUseCase.execute(sportData);
    return this._httpSuccess.success_201(sport);
  }

  async updateSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const sportData = httpRequest.body;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const sport = await this._updateSportUseCase.execute({ id, ...sportData });
    return this._httpSuccess.success_200(sport);
  }

  async deleteSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const result = await this._deleteSportUseCase.execute({ id });
    return this._httpSuccess.success_200(result);
  }
} 