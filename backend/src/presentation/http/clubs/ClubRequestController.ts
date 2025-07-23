import {
    GetClubRequestsUseCase,
    ApproveClubRequestUseCase,
    RejectClubRequestUseCase,
    GetClubRequestDetailsUseCase,
  } from "../../../application/clubs/useCases/ClubRequestUseCases";
  import {
    GetClubRequestsRequestDTO,
    ApproveClubRequestRequestDTO,
    RejectClubRequestRequestDTO,
    GetClubRequestDetailsRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestRequestDTOs";
  import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IClubRequestController } from "../IHttp";
  
  export class ClubRequestController implements IClubRequestController {
    private httpErrors: HttpErrors;
    private httpSuccess: HttpSuccess;
  
    constructor(
      private getClubRequestsUseCase: GetClubRequestsUseCase,
      private approveClubRequestUseCase: ApproveClubRequestUseCase,
      private rejectClubRequestUseCase: RejectClubRequestUseCase,
      private getClubRequestDetailsUseCase: GetClubRequestDetailsUseCase
    ) {
      this.httpErrors = new HttpErrors();
      this.httpSuccess = new HttpSuccess();
    }
  
    async getClubRequests(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { page = "1", limit = "10", status = "all", category = "all", startDate, endDate, search } = httpRequest.query || {};
      const getClubRequestsRequestDTO: GetClubRequestsRequestDTO = {
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        type: String(category),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        search: search ? String(search) : undefined,
      };
      const response = await this.getClubRequestsUseCase.execute(getClubRequestsRequestDTO);
      return this.httpSuccess.success_200(response);
    }
  
    async approveClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const approveClubRequestRequestDTO: ApproveClubRequestRequestDTO = { id };
      const response = await this.approveClubRequestUseCase.execute(approveClubRequestRequestDTO);
      return this.httpSuccess.success_200(response);
    }
  
    async rejectClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const rejectClubRequestRequestDTO: RejectClubRequestRequestDTO = { id };
      const response = await this.rejectClubRequestUseCase.execute(rejectClubRequestRequestDTO);
      return this.httpSuccess.success_200(response);
    }
  
    async getClubRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const getClubRequestDetailsRequestDTO: GetClubRequestDetailsRequestDTO = { id };
      const response = await this.getClubRequestDetailsUseCase.execute(getClubRequestDetailsRequestDTO);
      return this.httpSuccess.success_200(response);
    }
  }
  
  export const clubRequestController = new ClubRequestController(
    {} as GetClubRequestsUseCase,
    {} as ApproveClubRequestUseCase,
    {} as RejectClubRequestUseCase,
    {} as GetClubRequestDetailsUseCase
  );