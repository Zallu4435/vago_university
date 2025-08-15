import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IEnquiryController } from "../IHttp";
import {
  ICreateEnquiryUseCase,
  IGetEnquiriesUseCase,
  IGetEnquiryByIdUseCase,
  IUpdateEnquiryStatusUseCase,
  IDeleteEnquiryUseCase,
  ISendEnquiryReplyUseCase,
} from "../../../application/enquiry/useCases/EnquiryUseCases";

export class EnquiryController implements IEnquiryController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private createEnquiryUseCase: ICreateEnquiryUseCase,
    private getEnquiriesUseCase: IGetEnquiriesUseCase,
    private getEnquiryByIdUseCase: IGetEnquiryByIdUseCase,
    private updateEnquiryStatusUseCase: IUpdateEnquiryStatusUseCase,
    private deleteEnquiryUseCase: IDeleteEnquiryUseCase,
    private sendEnquiryReplyUseCase: ISendEnquiryReplyUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async createEnquiry(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { name, email, subject, message } = httpRequest.body || {};

    if (!name || !email || !subject || !message) {
      return this.httpErrors.error_400();
    }

    const response = await this.createEnquiryUseCase.execute({
      name,
      email,
      subject,
      message,
    });

    return this.httpSuccess.success_201(response);
  }

  async getEnquiries(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page, limit, status, dateRange, startDate, endDate, search } = httpRequest.query || {};

    const response = await this.getEnquiriesUseCase.execute({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status ? status : undefined,
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      search: search ? String(search) : undefined,
    });

    return this.httpSuccess.success_200(response);
  }

  async getEnquiryById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};

    if (!id) {
      return this.httpErrors.error_400();
    }

    const response = await this.getEnquiryByIdUseCase.execute({ id });

    return this.httpSuccess.success_200(response);
  }

  async updateEnquiryStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const { status } = httpRequest.body || {};

    if (!id || !status) {
      return this.httpErrors.error_400();
    }

    const response = await this.updateEnquiryStatusUseCase.execute({ id, status });

    return this.httpSuccess.success_200(response);
  }

  async deleteEnquiry(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};

    if (!id) {
      return this.httpErrors.error_400();
    }

    const response = await this.deleteEnquiryUseCase.execute({ id });

    return this.httpSuccess.success_200(response);
  }

  async sendReply(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    const { replyMessage } = httpRequest.body || {};

    if (!id || !replyMessage) {
      return this.httpErrors.error_400();
    }

    const response = await this.sendEnquiryReplyUseCase.execute({ id, replyMessage });

    return this.httpSuccess.success_200(response);
  }
} 