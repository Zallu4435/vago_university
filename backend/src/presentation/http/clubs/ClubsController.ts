import {
  IGetClubsUseCase,
  IGetClubByIdUseCase,
  ICreateClubUseCase,
  IUpdateClubUseCase,
  IDeleteClubUseCase,
} from "../../../application/clubs/useCases/ClubUseCases";
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
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getClubsUseCase: IGetClubsUseCase,
    private getClubByIdUseCase: IGetClubByIdUseCase,
    private createClubUseCase: ICreateClubUseCase,
    private updateClubUseCase: IUpdateClubUseCase,
    private deleteClubUseCase: IDeleteClubUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getClubs(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", category = "all", status = "all", dateRange } = httpRequest.query || {};
    if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
      return this.httpErrors.error_400();
    }
    let startDate, endDate;
    if (dateRange) {
      const [start, end] = String(dateRange).split(",");
      startDate = new Date(start);
      endDate = new Date(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return this.httpErrors.error_400();
      }
    }
    const getClubsRequestDTO: GetClubsRequestDTO = {
      page: Number(page),
      limit: Number(limit),
      category: String(category),
      status: String(status),
      startDate,
      endDate,
    };
    const response = await this.getClubsUseCase.execute(getClubsRequestDTO);
    return this.httpSuccess.success_200(response);
  }

  async getClubById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id || !mongoose.isValidObjectId(id)) {
      return this.httpErrors.error_400();
    }
    const getClubByIdRequestDTO: GetClubByIdRequestDTO = { id };
    const response = await this.getClubByIdUseCase.execute(getClubByIdRequestDTO);
    return this.httpSuccess.success_200(response);
  }

  async createClub(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const clubData = httpRequest.body || {};
    const createClubRequestDTO: CreateClubRequestDTO = clubData;
    const response = await this.createClubUseCase.execute(createClubRequestDTO);
    return this.httpSuccess.success_201(response);
  }

  async updateClub(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const clubData = httpRequest.body || {};
    if (!id || !mongoose.isValidObjectId(id)) {
      return this.httpErrors.error_400();
    }
    const updateClubRequestDTO: UpdateClubRequestDTO = { id, ...clubData };
    const response = await this.updateClubUseCase.execute(updateClubRequestDTO);
    return this.httpSuccess.success_200(response);
  }

  async deleteClub(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id || !mongoose.isValidObjectId(id)) {
      return this.httpErrors.error_400();
    }
    const deleteClubRequestDTO: DeleteClubRequestDTO = { id };
    const response = await this.deleteClubUseCase.execute(deleteClubRequestDTO);
    return this.httpSuccess.success_200(response);
  }
}

export const clubsController = new ClubsController(
  // Dependency injection placeholders
  {} as IGetClubsUseCase,
  {} as IGetClubByIdUseCase,
  {} as ICreateClubUseCase,
  {} as IUpdateClubUseCase,
  {} as IDeleteClubUseCase
); 