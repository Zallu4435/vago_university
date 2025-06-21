import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdmissionController } from "../IHttp";
import {
  CreateApplicationUseCase,
  GetApplicationUseCase,
  SaveSectionUseCase,
  ProcessPaymentUseCase,
  ConfirmPaymentUseCase,
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
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
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

  async confirmPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== CONFIRM PAYMENT CONTROLLER START ===');
      console.log('Request body:', httpRequest.body);
      console.log('Request user:', httpRequest.user);
      
      if (!httpRequest.user) {
        console.log('ERROR: No user found in request');
        return this.httpErrors.error_401();
      }
      
      const { id: registerId } = httpRequest.user;
      const { paymentId, stripePaymentIntentId } = httpRequest.body || {};
      
      console.log('Extracted data:', { registerId, paymentId, stripePaymentIntentId });
      
      if (!paymentId || !stripePaymentIntentId) {
        console.log('ERROR: Missing paymentId or stripePaymentIntentId');
        console.log('paymentId:', paymentId);
        console.log('stripePaymentIntentId:', stripePaymentIntentId);
        return this.httpErrors.error_400();
      }
      
      // Validate that the payment belongs to the current user
      const { PaymentModel } = await import("../../../infrastructure/database/mongoose/models/financial.model");
      console.log('Looking for payment with ID:', paymentId);
      const payment = await PaymentModel.findById(paymentId);
      
      if (!payment) {
        console.log('ERROR: Payment not found with ID:', paymentId);
        return this.httpErrors.error_404();
      }
      
      console.log('Found payment:', {
        id: payment._id,
        studentId: payment.studentId,
        registerId: registerId,
        status: payment.status,
        metadata: payment.metadata
      });
      
      // Check if the payment belongs to the current user
      if (!payment.studentId.equals(registerId)) {
        console.log('ERROR: Payment does not belong to current user');
        console.log('Payment studentId:', payment.studentId);
        console.log('Current registerId:', registerId);
        return this.httpErrors.error_403();
      }
      
      console.log('Payment validation passed, calling use case...');
      const response = await this.confirmPaymentUseCase.execute({ paymentId, stripePaymentIntentId });
      console.log('Use case response:', response);
      
      if (!response.success) {
        console.log('ERROR: Use case failed:', response.data);
        return this.httpErrors.error_400();
      }
      
      console.log('=== CONFIRM PAYMENT CONTROLLER SUCCESS ===');
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      console.log('=== CONFIRM PAYMENT CONTROLLER ERROR ===');
      console.error('Controller error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
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