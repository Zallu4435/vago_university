import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IFacultyController } from "../IHttp";
import {
  GetFacultyUseCase,
  GetFacultyByIdUseCase,
  ApproveFacultyUseCase,
  RejectFacultyUseCase,
  DeleteFacultyUseCase,
  ConfirmFacultyOfferUseCase,
  DownloadCertificateUseCase,
} from "../../../application/faculty/useCases/FacultyUseCases";

export class FacultyController implements IFacultyController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getFacultyUseCase: GetFacultyUseCase,
    private getFacultyByIdUseCase: GetFacultyByIdUseCase,
    private approveFacultyUseCase: ApproveFacultyUseCase,
    private rejectFacultyUseCase: RejectFacultyUseCase,
    private deleteFacultyUseCase: DeleteFacultyUseCase,
    private confirmFacultyOfferUseCase: ConfirmFacultyOfferUseCase,
    private downloadCertificateUseCase: DownloadCertificateUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "5", status = "all", department = "all_departments", dateRange = "all" } = httpRequest.query || {};
      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return this.httpErrors.error_400();
      }
      const response = await this.getFacultyUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        department: String(department),
        dateRange: String(dateRange),
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getFacultyById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.getFacultyByIdUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async approveFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      const { department, position, startDate, salary, benefits, additionalNotes } = httpRequest.body || {};
      if (!id || !department || !startDate) {
        return this.httpErrors.error_400();
      }
      const response = await this.approveFacultyUseCase.execute({
        id,
        additionalInfo: { department, position, startDate, salary, benefits, additionalNotes },
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async rejectFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.rejectFacultyUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async deleteFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.deleteFacultyUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async confirmFacultyOffer(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id, action } = httpRequest.params || {};
      const { token } = httpRequest.query || {};
      if (!id || !action || !token || typeof token !== "string") {
        return this.httpErrors.error_400();
      }
      if (action !== "accept" && action !== "reject") {
        return this.httpErrors.error_400();
      }
      const response = await this.confirmFacultyOfferUseCase.execute({
        facultyId: id,
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

  async downloadCertificate(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { facultyId } = httpRequest.params || {};
      const { url, type } = httpRequest.query || {};
      const requestingUserId = httpRequest.user?.id;
      if (!facultyId || !url || typeof url !== "string" || !type || !requestingUserId) {
        return this.httpErrors.error_400();
      }
      const response = await this.downloadCertificateUseCase.execute({
        facultyId,
        certificateUrl: url as string,
        requestingUserId,
        type: String(type),
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