import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IFacultyController } from "../IHttp";
import { v2 as cloudinary } from 'cloudinary';
import {
  IGetFacultyUseCase,
  IGetFacultyByIdUseCase,
  IGetFacultyByTokenUseCase,
  IApproveFacultyUseCase,
  IRejectFacultyUseCase,
  IDeleteFacultyUseCase,
  IConfirmFacultyOfferUseCase,
  IDownloadCertificateUseCase,
  IBlockFacultyUseCase,
} from "../../../application/faculty/useCases/IFacultyUseCases";
import { FacultyStatus } from "../../../domain/faculty/FacultyTypes";

export class FacultyController implements IFacultyController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getFacultyUseCase: IGetFacultyUseCase,
    private _getFacultyByIdUseCase: IGetFacultyByIdUseCase,
    private _getFacultyByTokenUseCase: IGetFacultyByTokenUseCase,
    private _approveFacultyUseCase: IApproveFacultyUseCase,
    private _rejectFacultyUseCase: IRejectFacultyUseCase,
    private _deleteFacultyUseCase: IDeleteFacultyUseCase,
    private _confirmFacultyOfferUseCase: IConfirmFacultyOfferUseCase,
    private _downloadCertificateUseCase: IDownloadCertificateUseCase,
    private _blockFacultyUseCase: IBlockFacultyUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "5", status = "all", department = "all_departments", dateRange = "all", search, startDate, endDate } = httpRequest.query || {};
    if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
      return this._httpErrors.error_400();
    }
    const response = await this._getFacultyUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      status: status as FacultyStatus,
      department: String(department),
      dateRange: String(dateRange),
      search: search ? String(search) : undefined,
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async getFacultyById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._getFacultyByIdUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_404();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async getFacultyByToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const { token } = httpRequest.query || {};
    if (!id || !token || typeof token !== "string") {
      return this._httpErrors.error_400();
    }
    const response = await this._getFacultyByTokenUseCase.execute({
      facultyId: id,
      token,
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async approveFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const { department, position, startDate, salary, benefits, additionalNotes } = httpRequest.body || {};
    if (!id || !department || !startDate) {
      return this._httpErrors.error_400();
    }
    const response = await this._approveFacultyUseCase.execute({
      id,
      additionalInfo: { department, position, startDate, salary, benefits, additionalNotes },
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async rejectFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._rejectFacultyUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async deleteFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._deleteFacultyUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async confirmFacultyOffer(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id, action } = httpRequest.params || {};
    const { token } = httpRequest.query || {};
    if (!id || !action || !token || typeof token !== "string") {
      return this._httpErrors.error_400();
    }
    if (action !== "accept" && action !== "reject") {
      return this._httpErrors.error_400();
    }
    const response = await this._confirmFacultyOfferUseCase.execute({
      facultyId: id,
      token,
      action: action as "accept" | "reject",
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async downloadCertificate(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { facultyId } = httpRequest.params || {};
    const { url, type } = httpRequest.query || {};
    const requestingUserId = httpRequest.user?.id;
    if (!facultyId || !url || typeof url !== "string" || !type || !requestingUserId) {
      return this._httpErrors.error_400();
    }
    const response = await this._downloadCertificateUseCase.execute({
      facultyId,
      certificateUrl: url as string,
      requestingUserId,
      type: String(type),
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async blockFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._blockFacultyUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this._httpErrors.error_401();
      }

      const { facultyId } = httpRequest.params || {};
      const { type, documentUrl } = httpRequest.query || {};

      if (!facultyId || !type || !documentUrl) {
        return this._httpErrors.error_400();
      }

      const urlParts = (documentUrl as string).split('/');
      const publicId = urlParts.slice(-2).join('/').replace(/\.[^/.]+$/, '');

      const signedUrl = cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true,
        secure: true
      });

      const response = await fetch(signedUrl);

      if (!response.ok) {
        return this._httpErrors.error_404();
      }

      const pdfBuffer = await response.arrayBuffer();

      const result_response = {
        statusCode: 200,
        body: {
          data: {
            pdfData: Buffer.from(pdfBuffer).toString('base64'),
            fileName: `${type}_${facultyId}.pdf`,
            contentType: 'application/pdf'
          }
        }
      };
      return result_response;
    } catch (error) {
      return this._httpErrors.error_500();
    }
  }
}