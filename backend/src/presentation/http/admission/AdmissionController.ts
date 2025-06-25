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
} from "../../../application/admission/useCases/AdmissionUseCases";
import { AdmissionDraft as AdmissionDraftModel } from "../../../infrastructure/database/mongoose/admission/AdmissionDraftModel";
import mongoose from "mongoose";

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
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async createApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { userId } = httpRequest.body || {};
      if (!userId || userId !== registerId) {
        return this.httpErrors.error_400();
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return this.httpErrors.error_400();
      }
      const response = await this.createApplicationUseCase.execute({ userId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { userId } = httpRequest.params || {};
      if (userId !== registerId) {
        return this.httpErrors.error_403();
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return this.httpErrors.error_400();
      }
      const response = await this.getApplicationUseCase.execute({ userId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async saveSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId, section } = httpRequest.params || {};
      const data = httpRequest.body;
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      const response = await this.saveSectionUseCase.execute({ applicationId, section, data });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async processPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId, paymentDetails } = httpRequest.body || {};
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      const response = await this.processPaymentUseCase.execute({ applicationId, paymentDetails });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async confirmPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { paymentId, stripePaymentIntentId } = httpRequest.body || {};
      
      if (!paymentId || !stripePaymentIntentId) {
        return this.httpErrors.error_400();
      }
      
      const { PaymentModel } = await import("../../../infrastructure/database/mongoose/models/financial.model");
      const payment = await PaymentModel.findById(paymentId);
      
      if (!payment) {
        return this.httpErrors.error_404();
      }
      
      if (!payment.studentId.equals(registerId)) {
        return this.httpErrors.error_403();
      }
      
      const response = await this.confirmPaymentUseCase.execute({ paymentId, stripePaymentIntentId });
      
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async handleFinalSubmit(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId, paymentId } = httpRequest.body || {};
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      const response = await this.finalizeAdmissionUseCase.execute({ applicationId, paymentId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200({ message: "Admission finalized", admission: response.data });
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId, documentType } = httpRequest.body || {};
      const file = httpRequest.file;
      
      if (!file) {
        return this.httpErrors.error_400();
      }

      if (!applicationId) {
        return this.httpErrors.error_400();
      }

      if (!documentType) {
        return this.httpErrors.error_400();
      }

      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      
      if (!draft) {
        return this.httpErrors.error_403();
      }
      
      const response = await this.uploadDocumentUseCase.execute({ applicationId, documentType, file });
      
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async uploadMultipleDocuments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId } = httpRequest.body || {};
      const files = httpRequest.files || [];
      
      if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
        return this.httpErrors.error_400();
      }
      
      if (!files || files.length === 0) {
        return this.httpErrors.error_400();
      }
      
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      
      const response = await this.uploadMultipleDocumentsUseCase.execute({ 
        applicationId, 
        files: files as Express.Multer.File[] 
      });
      
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { documentId } = httpRequest.params || {};
      
      if (!documentId) {
        return this.httpErrors.error_400();
      }
      
      const draft = await AdmissionDraftModel.findOne({ 
        registerId,
        "documents.documents": { $elemMatch: { id: documentId } }
      });
      
      if (!draft) {
        return this.httpErrors.error_403();
      }
      
      const document = draft.documents?.documents?.find(doc => doc.id === documentId);
      
      if (!document || !document.cloudinaryUrl) {
        return this.httpErrors.error_404();
      }
      
      const response = await fetch(document.cloudinaryUrl);
      
      if (!response.ok) {
        return this.httpErrors.error_404();
      }
      
      const pdfBuffer = await response.arrayBuffer();
      
      const result = {
        statusCode: 200,
        body: {
          pdfData: Buffer.from(pdfBuffer).toString('base64'),
          fileName: document.fileName,
          contentType: 'application/pdf'
        }
      };
      
      return result;
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
}