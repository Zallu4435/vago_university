import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdmissionController } from "../IHttp";
import {
  CreateApplicationUseCase,
  GetApplicationUseCase,
  SaveSectionUseCase,
  ProcessPaymentUseCase,
  FinalizeAdmissionUseCase,
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
    private finalizeAdmissionUseCase: FinalizeAdmissionUseCase
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
}