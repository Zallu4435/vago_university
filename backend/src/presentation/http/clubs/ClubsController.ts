import {
  IGetClubsUseCase,
  IGetClubByIdUseCase,
  ICreateClubUseCase,
  IUpdateClubUseCase,
  IDeleteClubUseCase,
} from "../../../application/clubs/useCases/IClubUseCases";
import {
  GetClubsRequestDTO,
  GetClubByIdRequestDTO,
  CreateClubRequestDTO,
  UpdateClubRequestDTO,
  DeleteClubRequestDTO,
} from "../../../domain/clubs/dtos/ClubRequestDTOs";
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IClubsController } from "../IHttp";
import mongoose from "mongoose";

export class ClubsController implements IClubsController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getClubsUseCase: IGetClubsUseCase,
    private _getClubByIdUseCase: IGetClubByIdUseCase,
    private _createClubUseCase: ICreateClubUseCase,
    private _updateClubUseCase: IUpdateClubUseCase,
    private _deleteClubUseCase: IDeleteClubUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getClubs(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", category = "all", status = "all", dateRange, search } = httpRequest.query || {};
    if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
      return this._httpErrors.error_400();
    }
    let startDate, endDate;
    if (dateRange) {
      const [start, end] = String(dateRange).split(",");
      startDate = new Date(start);
      endDate = new Date(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return this._httpErrors.error_400();
      }
    }
    const getClubsRequestDTO: GetClubsRequestDTO = {
      page: Number(page),
      limit: Number(limit),
      category: String(category),
      status: String(status),
      startDate,
      endDate,
      search: search ? String(search) : undefined,
    };
    const response = await this._getClubsUseCase.execute(getClubsRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async getClubById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id || !mongoose.isValidObjectId(id)) {
      return this._httpErrors.error_400();
    }
    const getClubByIdRequestDTO: GetClubByIdRequestDTO = { id };
    const response = await this._getClubByIdUseCase.execute(getClubByIdRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async createClub(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const clubData = httpRequest.body || {};
    const createClubRequestDTO: CreateClubRequestDTO = clubData;
    const response = await this._createClubUseCase.execute(createClubRequestDTO);
    return this._httpSuccess.success_201(response);
  }

  async updateClub(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const clubData = httpRequest.body || {};
    if (!id || !mongoose.isValidObjectId(id)) {
      return this._httpErrors.error_400();
    }
    const updateClubRequestDTO: UpdateClubRequestDTO = { id, ...clubData };
    const response = await this._updateClubUseCase.execute(updateClubRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async deleteClub(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id || !mongoose.isValidObjectId(id)) {
      return this._httpErrors.error_400();
    }
    const deleteClubRequestDTO: DeleteClubRequestDTO = { id };
    const response = await this._deleteClubUseCase.execute(deleteClubRequestDTO);
    return this._httpSuccess.success_200(response);
  }
} 