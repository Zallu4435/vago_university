import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdmissionController } from "../IHttp";
import {
  CreateApplicationUseCase,
  GetApplicationUseCase,
  SaveSectionUseCase,
  ProcessPaymentUseCase,
  ConfirmPaymentUseCase,
  FinalizeAdmissionUseCase,
  UploadDocumentUseCase,
  UploadMultipleDocumentsUseCase,
  GetDocumentByKeyUseCase,
} from "../../../application/admission/useCases/AdmissionUseCases";
import axios from 'axios';


export class AdmissionController implements IAdmissionController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private createApplicationUseCase: CreateApplicationUseCase,
    private getApplicationUseCase: GetApplicationUseCase,
    private saveSectionUseCase: SaveSectionUseCase,
    private processPaymentUseCase: ProcessPaymentUseCase,
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
    private finalizeAdmissionUseCase: FinalizeAdmissionUseCase,
    private uploadDocumentUseCase: UploadDocumentUseCase,
    private uploadMultipleDocumentsUseCase: UploadMultipleDocumentsUseCase,
    private getDocumentByKeyUseCase: GetDocumentByKeyUseCase,
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async createApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { userId: registerId } = httpRequest.user;
    const { userId } = httpRequest.body || {};
    if (!userId || userId !== registerId) return this.httpErrors.error_400();
    const result = await this.createApplicationUseCase.execute({ userId });
    return this.httpSuccess.success_201(result);
  }

  async getApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { userId: registerId } = httpRequest.user;
    const { userId } = httpRequest.params || {};
    if (userId !== registerId) return this.httpErrors.error_403();
    const result = await this.getApplicationUseCase.execute({ userId });
    return this.httpSuccess.success_200(result);
  }

  async saveSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { applicationId, section } = httpRequest.params || {};
    const data = httpRequest.body;
    if (!applicationId || !section) return this.httpErrors.error_400();
    const result = await this.saveSectionUseCase.execute({ applicationId, section, data });
    return this.httpSuccess.success_200(result);
  }

  async processPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { applicationId, paymentDetails } = httpRequest.body || {};
    if (!applicationId || !paymentDetails) return this.httpErrors.error_400();
    const result = await this.processPaymentUseCase.execute({ applicationId, paymentDetails });
    return this.httpSuccess.success_200(result);
  }

  async confirmPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { paymentId, stripePaymentIntentId } = httpRequest.body || {};
    if (!paymentId || !stripePaymentIntentId) return this.httpErrors.error_400();
    const result = await this.confirmPaymentUseCase.execute({ paymentId, stripePaymentIntentId });
    return this.httpSuccess.success_200(result);
  }

  async handleFinalSubmit(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { applicationId, paymentId } = httpRequest.body || {};
    if (!applicationId || !paymentId) return this.httpErrors.error_400();
    const result = await this.finalizeAdmissionUseCase.execute({ applicationId, paymentId });
    return this.httpSuccess.success_200({ message: "Admission finalized", admission: result });
  }

  async uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { applicationId, documentType } = httpRequest.body || {};
    const file = httpRequest.file;
    if (!applicationId || !documentType || !file) return this.httpErrors.error_400();
    const result = await this.uploadDocumentUseCase.execute({ applicationId, documentType, file });
    return this.httpSuccess.success_200(result);
  }

  async uploadMultipleDocuments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { applicationId } = httpRequest.body || {};
    const files = httpRequest.files || [];
    if (!applicationId || !files || files.length === 0) return this.httpErrors.error_400();
    const result = await this.uploadMultipleDocumentsUseCase.execute({
      applicationId,
      files: files as Express.Multer.File[],
      documentTypes: Array(files.length).fill('general')
    });
    return this.httpSuccess.success_200(result);
  }

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) return this.httpErrors.error_401();
    const { userId } = httpRequest.user;
    const { documentId } = httpRequest.params || {};
    if (!documentId) {
      return this.httpErrors.error_400();
    }
    const document = await this.getDocumentByKeyUseCase.execute({ userId, documentKey: documentId });
    if (!document) return this.httpErrors.error_404();
    if (!document.cloudinaryUrl) return this.httpErrors.error_404();
    const response = await axios.get(document.cloudinaryUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return this.httpSuccess.success_200({
      ...document,
      pdfData: base64,
    });
  }
}