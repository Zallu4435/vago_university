import { IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors, IFinancialController } from "../IHttp";
import {
  IGetStudentFinancialInfoUseCase,
  IGetAllPaymentsUseCase,
  IGetOnePaymentUseCase,
  IMakePaymentUseCase,
  IUploadDocumentUseCase,
  IGetPaymentReceiptUseCase,
  ICreateChargeUseCase,
  IGetAllChargesUseCase,
  IUpdateChargeUseCase,
  IDeleteChargeUseCase,
} from "../../../application/financial/useCases/FinancialUseCases";

export class FinancialController implements IFinancialController {
  private httpSuccess = new HttpSuccess();
  private httpErrors = new HttpErrors();

  constructor(
    private readonly getStudentFinancialInfoUseCase: IGetStudentFinancialInfoUseCase,
    private readonly getAllPaymentsUseCase: IGetAllPaymentsUseCase,
    private readonly getOnePaymentUseCase: IGetOnePaymentUseCase,
    private readonly makePaymentUseCase: IMakePaymentUseCase,
    private readonly uploadDocumentUseCase: IUploadDocumentUseCase,
    private readonly getPaymentReceiptUseCase: IGetPaymentReceiptUseCase,
    private readonly createChargeUseCase: ICreateChargeUseCase,
    private readonly getAllChargesUseCase: IGetAllChargesUseCase,
    private readonly updateChargeUseCase: IUpdateChargeUseCase,
    private readonly deleteChargeUseCase: IDeleteChargeUseCase
  ) { }

  async getStudentFinancialInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user?.userId) {
      return this.httpErrors.error_401();
    }
    const response = await this.getStudentFinancialInfoUseCase.execute({ studentId: httpRequest.user.userId });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getAllPayments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { startDate, endDate, status, studentId, page = "1", limit = "10" } = httpRequest.query || {};
    const response = await this.getAllPaymentsUseCase.execute({
      startDate,
      endDate,
      status,
      studentId,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getOnePayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const response = await this.getOnePaymentUseCase.execute({ paymentId: id });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async makePayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user?.userId) {
      return this.httpErrors.error_401();
    }
    const { amount, method, term, chargeId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = httpRequest.body || {};
    // Validate required fields
    if (!chargeId) {
      return this.httpErrors.error_400('Charge ID is required');
    }
    const response = await this.makePaymentUseCase.execute({
      studentId: httpRequest.user.userId,
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
  }

  async uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const file = httpRequest.file;
    const { type } = httpRequest.body || {};
    if (!file) return this.httpErrors.error_400();
    const response = await this.uploadDocumentUseCase.execute({ file, type });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_201(response.data);
  }

  async getPaymentReceipt(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { paymentId } = httpRequest.params || {};
    if (!httpRequest.user?.userId) {
      return this.httpErrors.error_401();
    }
    const response = await this.getPaymentReceiptUseCase.execute({
      paymentId,
      studentId: httpRequest.user.userId
    });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }


  async createCharge(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { title, description, amount, term, dueDate, applicableFor } = httpRequest.body || {};
    console.log(httpRequest.user);
    if (!httpRequest.user?.userId) {
      return this.httpErrors.error_401();
    }
    const response = await this.createChargeUseCase.execute({
      title,
      description,
      amount,
      term,
      dueDate: new Date(dueDate),
      applicableFor,
      createdBy: httpRequest.user.userId,
    });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_201(response.data);
  }

  async getAllCharges(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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
  }

  async updateCharge(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log(httpRequest.user);  
    console.log(httpRequest.body) 
    console.log(httpRequest.params);
    const { id } = httpRequest.params || {};
    // Instead of wrapping in { id, data }, spread the body fields directly
    const response = await this.updateChargeUseCase.execute({ id, ...httpRequest.body });
    if (!response.success) {
      const errorMsg = typeof response.data === 'object' && response.data && 'error' in response.data ? (response.data as any).error : 'Bad Request';
      return this.httpErrors.error_400(errorMsg);
    }
    return this.httpSuccess.success_200(response.data);
  }

  async deleteCharge(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log(httpRequest.user, "user user");
    console.log(httpRequest.body, "bidy, bidy");
    console.log(httpRequest.params, "params params") 
    const { id } = httpRequest.params || {};
    const response = await this.deleteChargeUseCase.execute({ id });
    if (!response.success) {
      return this.httpErrors.error_400(response.data?.error || 'Bad Request');
    }
    return this.httpSuccess.success_200(response.data);
  }
}