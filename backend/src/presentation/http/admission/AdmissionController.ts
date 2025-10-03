import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdmissionController } from "../IHttp";
import {
  ICreateApplicationUseCase,
  IGetApplicationUseCase,
  ISaveSectionUseCase,
  IProcessPaymentUseCase,
  IConfirmPaymentUseCase,
  IFinalizeAdmissionUseCase,
  IUploadDocumentUseCase,
  IUploadMultipleDocumentsUseCase,
  IGetDocumentByKeyUseCase,
} from "../../../application/admission/useCases/IAdmissionUseCases";
import axios from 'axios';


export class AdmissionController implements IAdmissionController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _createApplicationUseCase: ICreateApplicationUseCase,
    private _getApplicationUseCase: IGetApplicationUseCase,
    private _saveSectionUseCase: ISaveSectionUseCase,
    private _processPaymentUseCase: IProcessPaymentUseCase,
    private _confirmPaymentUseCase: IConfirmPaymentUseCase,
    private _finalizeAdmissionUseCase: IFinalizeAdmissionUseCase,
    private _uploadDocumentUseCase: IUploadDocumentUseCase,
    private _uploadMultipleDocumentsUseCase: IUploadMultipleDocumentsUseCase,
    private _getDocumentByKeyUseCase: IGetDocumentByKeyUseCase,
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async createApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { userId: registerId } = httpRequest.user;
    const { userId } = httpRequest.body || {};
    if (!userId || userId !== registerId) return this._httpErrors.error_400();
    const result = await this._createApplicationUseCase.execute({ userId });
    return this._httpSuccess.success_201(result);
  }

  async getApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { userId: registerId } = httpRequest.user;
    const { userId } = httpRequest.params || {};
    if (userId !== registerId) return this._httpErrors.error_403();
    const result = await this._getApplicationUseCase.execute({ userId });
    return this._httpSuccess.success_200(result);
  }

  async saveSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { applicationId, section } = httpRequest.params || {};
    const data = httpRequest.body;
    if (!applicationId || !section) return this._httpErrors.error_400();
    const result = await this._saveSectionUseCase.execute({ applicationId, section, data });
    return this._httpSuccess.success_200(result);
  }

  async processPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { applicationId, paymentDetails } = httpRequest.body || {};
    if (!applicationId || !paymentDetails) return this._httpErrors.error_400();
    const result = await this._processPaymentUseCase.execute({ applicationId, paymentDetails });
    return this._httpSuccess.success_200(result);
  }

  async confirmPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { paymentId, stripePaymentIntentId } = httpRequest.body || {};
    if (!paymentId || !stripePaymentIntentId) return this._httpErrors.error_400();
    const result = await this._confirmPaymentUseCase.execute({ paymentId, stripePaymentIntentId });
    return this._httpSuccess.success_200(result);
  }

  async handleFinalSubmit(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { applicationId, paymentId } = httpRequest.body || {};
    if (!applicationId || !paymentId) return this._httpErrors.error_400();
    const result = await this._finalizeAdmissionUseCase.execute({ applicationId, paymentId });
    return this._httpSuccess.success_200({ message: "Admission finalized", admission: result });
  }

  async uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { applicationId, documentType } = httpRequest.body || {};
    const file = httpRequest.file;
    if (!applicationId || !documentType || !file) return this._httpErrors.error_400();
    const result = await this._uploadDocumentUseCase.execute({ applicationId, documentType, file });
    return this._httpSuccess.success_200(result);
  }

  async uploadMultipleDocuments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { applicationId } = httpRequest.body || {};
    const files = httpRequest.files || [];
    if (!applicationId || !files || files.length === 0) return this._httpErrors.error_400();
    const result = await this._uploadMultipleDocumentsUseCase.execute({
      applicationId,
      files: files as Express.Multer.File[],
      documentTypes: Array(files.length).fill('general')
    });
    return this._httpSuccess.success_200(result);
  }

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this._httpErrors.error_401();
    const { userId } = httpRequest.user;
    const { documentId } = httpRequest.params || {};
    if (!documentId) {
      return this._httpErrors.error_400();
    }
    const document = await this._getDocumentByKeyUseCase.execute({ userId, documentKey: documentId });
    if (!document) return this._httpErrors.error_404();
    if (!document.cloudinaryUrl) return this._httpErrors.error_404();
    const response = await axios.get(document.cloudinaryUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return this._httpSuccess.success_200({
      ...document,
      pdfData: base64,
    });
  }
}