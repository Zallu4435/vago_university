import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdminAdmissionController } from "../IHttp";
import {
  GetAdmissionsUseCase,
  GetAdmissionByIdUseCase,
  ApproveAdmissionUseCase,
  RejectAdmissionUseCase,
  DeleteAdmissionUseCase,
  ConfirmAdmissionOfferUseCase,
} from "../../../application/admin/useCases/AdmissionUseCases";

export class AdminAdmissionController implements IAdminAdmissionController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getAdmissionsUseCase: GetAdmissionsUseCase,
    private getAdmissionByIdUseCase: GetAdmissionByIdUseCase,
    private approveAdmissionUseCase: ApproveAdmissionUseCase,
    private rejectAdmissionUseCase: RejectAdmissionUseCase,
    private deleteAdmissionUseCase: DeleteAdmissionUseCase,
    private confirmAdmissionOfferUseCase: ConfirmAdmissionOfferUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getAdmissions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = 1, limit = 5, status = "all", program = "all", dateRange = "all", startDate, endDate } = httpRequest.query || {};
      const response = await this.getAdmissionsUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        program: String(program),
        dateRange: String(dateRange),
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getAdmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.getAdmissionByIdUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async approveAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      const { programDetails, startDate, scholarshipInfo, additionalNotes } = httpRequest.body || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.approveAdmissionUseCase.execute({
        id,
        additionalInfo: { programDetails, startDate, scholarshipInfo, additionalNotes },
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async rejectAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.rejectAdmissionUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async deleteAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.deleteAdmissionUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async confirmAdmissionOffer(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id, action } = httpRequest.params || {};
      const { token } = httpRequest.query || {};
      if (!id || !action || !token || typeof token !== "string") {
        return this.httpErrors.error_400();
      }
      if (action !== "accept" && action !== "reject") {
        return this.httpErrors.error_400();
      }
      const response = await this.confirmAdmissionOfferUseCase.execute({
        admissionId: id,
        token,
        action: action as "accept" | "reject",
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
}