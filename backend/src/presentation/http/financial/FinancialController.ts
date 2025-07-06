import { IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors, IFinancialController } from "../IHttp";
import {
  IGetStudentFinancialInfoUseCase,
  IGetAllPaymentsUseCase,
  IGetOnePaymentUseCase,
  IMakePaymentUseCase,
  IGetFinancialAidApplicationsUseCase,
  IGetAllFinancialAidApplicationsUseCase,
  IApplyForFinancialAidUseCase,
  IGetAvailableScholarshipsUseCase,
  IGetScholarshipApplicationsUseCase,
  IGetAllScholarshipApplicationsUseCase,
  IApplyForScholarshipUseCase,
  IUploadDocumentUseCase,
  IGetPaymentReceiptUseCase,
  IUpdateFinancialAidApplicationUseCase,
  IUpdateScholarshipApplicationUseCase,
  ICreateChargeUseCase,
  IGetAllChargesUseCase,
} from "../../../application/financial/useCases/FinancialUseCases";

export class FinancialController implements IFinancialController {
  private httpSuccess = new HttpSuccess();
  private httpErrors = new HttpErrors();

  constructor(
    private readonly getStudentFinancialInfoUseCase: IGetStudentFinancialInfoUseCase,
    private readonly getAllPaymentsUseCase: IGetAllPaymentsUseCase,
    private readonly getOnePaymentUseCase: IGetOnePaymentUseCase,
    private readonly makePaymentUseCase: IMakePaymentUseCase,
    private readonly getFinancialAidApplicationsUseCase: IGetFinancialAidApplicationsUseCase,
    private readonly getAllFinancialAidApplicationsUseCase: IGetAllFinancialAidApplicationsUseCase,
    private readonly applyForFinancialAidUseCase: IApplyForFinancialAidUseCase,
    private readonly getAvailableScholarshipsUseCase: IGetAvailableScholarshipsUseCase,
    private readonly getScholarshipApplicationsUseCase: IGetScholarshipApplicationsUseCase,
    private readonly getAllScholarshipApplicationsUseCase: IGetAllScholarshipApplicationsUseCase,
    private readonly applyForScholarshipUseCase: IApplyForScholarshipUseCase,
    private readonly uploadDocumentUseCase: IUploadDocumentUseCase,
    private readonly getPaymentReceiptUseCase: IGetPaymentReceiptUseCase,
    private readonly updateFinancialAidApplicationUseCase: IUpdateFinancialAidApplicationUseCase,
    private readonly updateScholarshipApplicationUseCase: IUpdateScholarshipApplicationUseCase,
    private readonly createChargeUseCase: ICreateChargeUseCase,
    private readonly getAllChargesUseCase: IGetAllChargesUseCase
  ) {}

  async getStudentFinancialInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const response = await this.getStudentFinancialInfoUseCase.execute({ studentId: httpRequest.user.id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getAllPayments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { startDate, endDate, status, page = "1", limit = "10" } = httpRequest.query || {};
      const response = await this.getAllPaymentsUseCase.execute({
        startDate,
        endDate,
        status,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getOnePayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      const response = await this.getOnePaymentUseCase.execute({ paymentId: id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async makePayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const { amount, method, term, chargeId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = httpRequest.body || {};
      
      // Validate required fields
      if (!chargeId) {
        return this.httpErrors.error_400('Charge ID is required');
      }
      
      const response = await this.makePaymentUseCase.execute({
        studentId: httpRequest.user.id,
        amount: parseFloat(amount),
        method,
        term,
        chargeId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getFinancialAidApplications(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const { status } = httpRequest.query || {};
      const response = await this.getFinancialAidApplicationsUseCase.execute({
        studentId: httpRequest.user.id,
        status,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getAllFinancialAidApplications(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { status, term, page = "1", limit = "10" } = httpRequest.query || {};
      const response = await this.getAllFinancialAidApplicationsUseCase.execute({
        status,
        term,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async applyForFinancialAid(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const { term, amount, type, documents } = httpRequest.body || {};
      const response = await this.applyForFinancialAidUseCase.execute({
        studentId: httpRequest.user.id,
        term,
        amount,
        type,
        documents,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getAvailableScholarships(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { status, term } = httpRequest.query || {};
      const response = await this.getAvailableScholarshipsUseCase.execute({ status, term });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getScholarshipApplications(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const { status } = httpRequest.query || {};
      const response = await this.getScholarshipApplicationsUseCase.execute({
        studentId: httpRequest.user.id,
        status,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getAllScholarshipApplications(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { status, page = "1", limit = "10" } = httpRequest.query || {};
      const response = await this.getAllScholarshipApplicationsUseCase.execute({
        status,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async applyForScholarship(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const { scholarshipId, documents } = httpRequest.body || {};
      const response = await this.applyForScholarshipUseCase.execute({
        studentId: httpRequest.user.id,
        scholarshipId,
        documents,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const file = httpRequest.file;
      const { type } = httpRequest.body || {};
      if (!file) return this.httpErrors.error_400();
      const response = await this.uploadDocumentUseCase.execute({ file, type });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getPaymentReceipt(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { paymentId } = httpRequest.params || {};
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const response = await this.getPaymentReceiptUseCase.execute({ 
        paymentId,
        studentId: httpRequest.user.id 
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async updateFinancialAidApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const { applicationId } = httpRequest.params || {};
      const { status, amount } = httpRequest.body || {};
      const response = await this.updateFinancialAidApplicationUseCase.execute({
        studentId: httpRequest.user.id,
        applicationId,
        status,
        amount,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async updateScholarshipApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const { applicationId } = httpRequest.params || {};
      const { status } = httpRequest.body || {};
      const response = await this.updateScholarshipApplicationUseCase.execute({
        studentId: httpRequest.user.id,
        applicationId,
        status,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async createCharge(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { title, description, amount, term, dueDate, applicableFor } = httpRequest.body || {};
      if (!httpRequest.user?.id) {
        return this.httpErrors.error_401();
      }
      const response = await this.createChargeUseCase.execute({
        title,
        description,
        amount,
        term,
        dueDate: new Date(dueDate),
        applicableFor,
        createdBy: httpRequest.user.id,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getAllCharges(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { term, status, search, page = "1", limit = "10" } = httpRequest.query || {};
      const response = await this.getAllChargesUseCase.execute({
        term,
        status,
        search,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }
}