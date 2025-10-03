import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdminAdmissionController } from "../IHttp";

import { Admission } from "../../../infrastructure/database/mongoose/admission/AdmissionModel";
import {
  IApproveAdmissionUseCase,
  IBlockAdmissionUseCase,
  IConfirmAdmissionOfferUseCase,
  IDeleteAdmissionUseCase,
  IGetAdmissionByIdUseCase,
  IGetAdmissionByTokenUseCase,
  IGetAdmissionsUseCase,
  IRejectAdmissionUseCase
} from "../../../application/admin/useCases/IAdmissionUseCases";

export class AdminAdmissionController implements IAdminAdmissionController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getAdmissionsUseCase: IGetAdmissionsUseCase,
    private _getAdmissionByIdUseCase: IGetAdmissionByIdUseCase,
    private _getAdmissionByTokenUseCase: IGetAdmissionByTokenUseCase,
    private _approveAdmissionUseCase: IApproveAdmissionUseCase,
    private _rejectAdmissionUseCase: IRejectAdmissionUseCase,
    private _deleteAdmissionUseCase: IDeleteAdmissionUseCase,
    private _confirmAdmissionOfferUseCase: IConfirmAdmissionOfferUseCase,
    private _blockAdmissionUseCase: IBlockAdmissionUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getAdmissions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = 1, limit = 5, status = "all", program = "all", dateRange = "all", startDate, endDate, search } = httpRequest.query || {};
    const response = await this._getAdmissionsUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      status: String(status),
      program: String(program),
      dateRange: String(dateRange),
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      search: search ? String(search) : undefined,
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async getAdmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._getAdmissionByIdUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_404();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async getAdmissionByToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const { token } = httpRequest.query || {};
    if (!id || !token || typeof token !== "string") {
      return this._httpErrors.error_400();
    }
    const response = await this._getAdmissionByTokenUseCase.execute({
      admissionId: id,
      token,
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async approveAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const { programDetails, startDate, scholarshipInfo, additionalNotes } = httpRequest.body || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._approveAdmissionUseCase.execute({
      id,
      additionalInfo: { programDetails, startDate, scholarshipInfo, additionalNotes },
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async rejectAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._rejectAdmissionUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async deleteAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._deleteAdmissionUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async confirmAdmissionOffer(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id, action } = httpRequest.params || {};
    const { token } = httpRequest.query || {};
    if (!id || !action || !token || typeof token !== "string") {
      return this._httpErrors.error_400();
    }
    if (action !== "accept" && action !== "reject") {
      return this._httpErrors.error_400();
    }
    const response = await this._confirmAdmissionOfferUseCase.execute({
      admissionId: id,
      token,
      action: action as "accept" | "reject",
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401();
    }

    if (httpRequest.user.collection !== 'admin') {
      return this._httpErrors.error_403();
    }

    const { documentId } = httpRequest.params || {};
    const { admissionId } = httpRequest.query || {};

    if (!documentId) {
      return this._httpErrors.error_400();
    }

    if (!admissionId) {
      return this._httpErrors.error_400();
    }

    const admission = await Admission.findOne({
      _id: admissionId,
      "documents.documents": { $elemMatch: { id: documentId } }
    });

    if (!admission) {
      return this._httpErrors.error_404();
    }

    const docsArray = Array.isArray(admission.documents?.documents) 
      ? admission.documents.documents 
      : [];
    const document = docsArray.find((doc) => doc.id === documentId);

    if (!document) {
      return this._httpErrors.error_404();
    }

    const documentUrl = document.cloudinaryUrl || document.url || document.path;

    if (!documentUrl) {
      return this._httpErrors.error_404();
    }

    const response = await fetch(documentUrl);

    if (!response.ok) {
      return this._httpErrors.error_404();
    }

    const pdfBuffer = await response.arrayBuffer();

    const result_response = {
      statusCode: 200,
      body: {
        data: {
          pdfData: Buffer.from(pdfBuffer).toString('base64'),
          fileName: document.fileName,
          contentType: 'application/pdf'
        }
      }
    };

    return result_response;
  }

  async blockAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const response = await this._blockAdmissionUseCase.execute({ id });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }
}