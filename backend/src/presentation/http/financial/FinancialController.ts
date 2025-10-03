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
  ICheckPendingPaymentUseCase,
  IClearPendingPaymentUseCase
} from "../../../application/financial/useCases/IFinancialUseCases";

export class FinancialController implements IFinancialController {
  private _httpSuccess = new HttpSuccess();
  private _httpErrors = new HttpErrors();

  constructor(
    private readonly _getStudentFinancialInfoUseCase: IGetStudentFinancialInfoUseCase,
    private readonly _getAllPaymentsUseCase: IGetAllPaymentsUseCase,
    private readonly _getOnePaymentUseCase: IGetOnePaymentUseCase,
    private readonly _makePaymentUseCase: IMakePaymentUseCase,
    private readonly _uploadDocumentUseCase: IUploadDocumentUseCase,
    private readonly _getPaymentReceiptUseCase: IGetPaymentReceiptUseCase,
    private readonly _createChargeUseCase: ICreateChargeUseCase,
    private readonly _getAllChargesUseCase: IGetAllChargesUseCase,
    private readonly _updateChargeUseCase: IUpdateChargeUseCase,
    private readonly _deleteChargeUseCase: IDeleteChargeUseCase,
    private readonly _checkPendingPaymentUseCase: ICheckPendingPaymentUseCase,
    private readonly _clearPendingPaymentUseCase: IClearPendingPaymentUseCase 
  ) { }

  async getStudentFinancialInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user?.userId) {
      return this._httpErrors.error_401();
    }
    const response = await this._getStudentFinancialInfoUseCase.execute({ studentId: httpRequest.user.userId });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async getAllPayments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { startDate, endDate, status, studentId, page = "1", limit = "10" } = httpRequest.query || {};
    const response = await this._getAllPaymentsUseCase.execute({
      startDate,
      endDate,
      status,
      studentId,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async getOnePayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const response = await this._getOnePaymentUseCase.execute({ paymentId: id });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async makePayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user?.userId) {
      return this._httpErrors.error_401();
    }
    const { amount, method, term, chargeId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = httpRequest.body || {};
    if (!chargeId) {
      return this._httpErrors.error_400('Charge ID is required');
    }
    const response = await this._makePaymentUseCase.execute({
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
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_201(response.data);
  }

  async uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const file = httpRequest.file;
    const { type } = httpRequest.body || {};
    if (!file) return this._httpErrors.error_400();
    const response = await this._uploadDocumentUseCase.execute({ file, type });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_201(response.data);
  }

  async getPaymentReceipt(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { paymentId } = httpRequest.params || {};
    if (!httpRequest.user?.userId) {
      return this._httpErrors.error_401();
    }
    const response = await this._getPaymentReceiptUseCase.execute({
      paymentId,
      studentId: httpRequest.user.userId
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }


  async createCharge(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { title, description, amount, term, dueDate, applicableFor } = httpRequest.body || {};
    if (!httpRequest.user?.userId) {
      return this._httpErrors.error_401();
    }
    const response = await this._createChargeUseCase.execute({
      title,
      description,
      amount,
      term,
      dueDate,
      applicableFor,
      createdBy: httpRequest.user.userId,
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_201(response.data);
  }

  async getAllCharges(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { term, status, search, page = "1", limit = "10" } = httpRequest.query || {};
    const response = await this._getAllChargesUseCase.execute({
      term,
      status,
      search,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async updateCharge(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const response = await this._updateChargeUseCase.execute({ id, ...httpRequest.body });
    if (!response.success) {
      const errorMsg = hasErrorProperty(response.data) ? response.data.error : 'Bad Request';
      return this._httpErrors.error_400(errorMsg);
    }
    return this._httpSuccess.success_200(response.data);
  }

  async deleteCharge(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const response = await this._deleteChargeUseCase.execute({ id });
    if (!response.success) {
      const errorMsg = typeof response.data === 'object' && response.data && 'error' in response.data ? (response.data).error : 'Bad Request';
      return this._httpErrors.error_400(errorMsg);
    }
    return this._httpSuccess.success_200(response.data);
  }

  async checkPendingPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user?.userId) {
      return this._httpErrors.error_401();
    }
    const response = await this._checkPendingPaymentUseCase.execute(httpRequest.user.userId);
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }

  async clearPendingPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user?.userId) {
      return this._httpErrors.error_401();
    }
    const response = await this._clearPendingPaymentUseCase.execute(httpRequest.user.userId);
    if (!response.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(response.data);
  }
  
}

function hasErrorProperty(data: unknown): data is { error: string } {
  return typeof data === 'object' && data !== null && 'error' in data;
}