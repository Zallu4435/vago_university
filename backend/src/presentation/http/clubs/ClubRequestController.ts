import {
    IGetClubRequestsUseCase,
    IApproveClubRequestUseCase,
    IRejectClubRequestUseCase,
    IGetClubRequestDetailsUseCase,
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
      private getClubRequestsUseCase: IGetClubRequestsUseCase,
      private approveClubRequestUseCase: IApproveClubRequestUseCase,
      private rejectClubRequestUseCase: IRejectClubRequestUseCase,
      private getClubRequestDetailsUseCase: IGetClubRequestDetailsUseCase
    ) {
      this.httpErrors = new HttpErrors();
      this.httpSuccess = new HttpSuccess();
    }
  
    async getClubRequests(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      try {
        const { page = "1", limit = "10", status = "all", category = "all", startDate, endDate } = httpRequest.query || {};
        const getClubRequestsRequestDTO: GetClubRequestsRequestDTO = {
          page: Number(page),
          limit: Number(limit),
          status: String(status),
          category: String(category),
          startDate: startDate ? new Date(String(startDate)) : undefined,
          endDate: endDate ? new Date(String(endDate)) : undefined,
        };
        const response = await this.getClubRequestsUseCase.execute(getClubRequestsRequestDTO);
        if (!response.success || !response.data) {
          return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(response.data);
      } catch (error: any) {
        return this.httpErrors.error_500();
      }
    }
  
    async approveClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      try {
        const { id } = httpRequest.path || {};
        if (!id) {
          return this.httpErrors.error_400();
        }
        const approveClubRequestRequestDTO: ApproveClubRequestRequestDTO = { id };
        const response = await this.approveClubRequestUseCase.execute(approveClubRequestRequestDTO);
        if (!response.success) {
          return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200({ message: "Club request approved successfully" });
      } catch (error: any) {
        return this.httpErrors.error_500();
      }
    }
  
    async rejectClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      try {
        const { id } = httpRequest.path || {};
        if (!id) {
          return this.httpErrors.error_400();
        }
        const rejectClubRequestRequestDTO: RejectClubRequestRequestDTO = { id };
        const response = await this.rejectClubRequestUseCase.execute(rejectClubRequestRequestDTO);
        if (!response.success) {
          return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200({ message: "Club request rejected successfully" });
      } catch (error: any) {
        return this.httpErrors.error_500();
      }
    }
  
    async getClubRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      try {
        const { id } = httpRequest.path || {};
        if (!id) {
          return this.httpErrors.error_400();
        }
        const getClubRequestDetailsRequestDTO: GetClubRequestDetailsRequestDTO = { id };
        const response = await this.getClubRequestDetailsUseCase.execute(getClubRequestDetailsRequestDTO);
        if (!response.success || !response.data) {
          if (response.data && 'error' in response.data && response.data.error === "Club request not found!") {
            return this.httpErrors.error_404();
          }
          return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(response.data);
      } catch (error: any) {
        return this.httpErrors.error_500();
      }
    }
  }
  
  export const clubRequestController = new ClubRequestController(
    // Dependency injection placeholders
    {} as IGetClubRequestsUseCase,
    {} as IApproveClubRequestUseCase,
    {} as IRejectClubRequestUseCase,
    {} as IGetClubRequestDetailsUseCase
  );